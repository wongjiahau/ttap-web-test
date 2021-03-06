import {
    includes
} from "lodash";
import * as S from "string";
import {
    FindClashes
} from "../../clashFinder/findClashes";
import {
    Beautify
} from "../../helper";
import {
    IStringDicionary
} from "../../interfaces/dictionary";
import {
    RawSlot
} from "../../model/rawSlot";
import {
    ClashReport,
    Subject
} from "../../model/subject";
import {
    Timetable
} from "../../model/timetable";
import {
    NewTimetableListState
} from "../reducers/timetableListState";
import {
    IMasterState,
    MasterStateAction,
    MasterStateReducer
} from "./../reducers/masterState";
import {
    ToggleSubjectListViewingOptions
} from "./toggleSubjectListViewingOption";

let CurrentTimetableFinder: (rawSlots: RawSlot[]) => Timetable[];

export class ToggleSubjectSelection extends MasterStateAction {
    public constructor(private subjectIndex: number) {
        super();
    }
    public TypeName(): string {
        return "toggle subject selection";
    }
    protected GenerateNewState(state: IMasterState): IMasterState {
        CurrentTimetableFinder = state.SettingsState.TimetableFinder;
        const newSubjects = state.SubjectListState.Subjects.map((x) => ({ ...x
        }));
        const targetSubject = newSubjects[this.subjectIndex];
        if (targetSubject.ClashReport !== null) {
            return state;
        }
        return targetSubject.IsSelected ?
            DeselectSubject(targetSubject, newSubjects, state) :
            SelectSubject(targetSubject, newSubjects, state);
    }
}

export function SelectSubject(subjectToBeSelected: Subject, allSubjects: Subject[], state: IMasterState): IMasterState {
    const selectedSubjects = allSubjects.filter((x) => x.IsSelected);
    const clashReport = CheckForClashesBetween(subjectToBeSelected, selectedSubjects);
    if (clashReport) {
        subjectToBeSelected.ClashReport = clashReport;
        return {
            ...state,
            SubjectListState: {
                ...state.SubjectListState,
                Subjects: allSubjects
            }
        };
    }
    const timetables = FindTimetableBasedOn(selectedSubjects.concat([subjectToBeSelected]), CurrentTimetableFinder);
    if (timetables.length === 0) {
        subjectToBeSelected.ClashReport = new ClashReport("group");
        return {
            ...state,
            SubjectListState: {
                ...state.SubjectListState,
                Subjects: allSubjects
            }
        };
    }
    subjectToBeSelected.IsSelected = true;
    return {
        ...state,
        SubjectListState: {
            ...state.SubjectListState,
            Subjects: allSubjects,
        },
        TimetableListState: NewTimetableListState(timetables)
    };
}

export function DeselectSubject(subjectToBeDeselected: Subject, allSubjects: Subject[], state: IMasterState): IMasterState {
    subjectToBeDeselected.IsSelected = false;
    const selectedSubjects = allSubjects.filter((x) => x.IsSelected);
    ReleaseDisabledSubjectsIfPossible(selectedSubjects, allSubjects);
    const timetables = FindTimetableBasedOn(selectedSubjects, CurrentTimetableFinder);
    const result: IMasterState = {
        ...state,
        SubjectListState: {
            ...state.SubjectListState,
            Subjects: allSubjects,

        },
        TimetableListState: NewTimetableListState(timetables)
    };

    const allSubjectIsDeselected = allSubjects.every((x) => !x.IsSelected);
    const newIsShowSelectedSubjectOnly =
        state.SubjectListState.IsShowingSelectedSubjectOnly && !allSubjectIsDeselected;
    const shouldToggleToShowAllSubject =
        state.SubjectListState.IsShowingSelectedSubjectOnly && newIsShowSelectedSubjectOnly === false;
    if (shouldToggleToShowAllSubject) {
        return MasterStateReducer(result, new ToggleSubjectListViewingOptions());
    } else {
        return result;
    }
}

export function ReleaseDisabledSubjectsIfPossible(selectedSubjects: Subject[], allSubjects: Subject[]): void {
    const disabledSubjects = allSubjects.filter((s) => s.ClashReport !== null);
    for (let i = 0; i < disabledSubjects.length; i++) {
        const s = disabledSubjects[i];
        switch (s.ClashReport.Type) {
            case "single":
                let stillGotClashes = false;
                for (let j = 0; j < selectedSubjects.length; j++) {
                    if (includes(selectedSubjects[j].ClashingCounterparts, s.Code)) {
                        s.ClashReport = new ClashReport("single", Beautify(selectedSubjects[j].Name));
                        stillGotClashes = true;
                        break;
                    }
                }
                if (!stillGotClashes) {
                    s.ClashReport = null;
                }
                break;
            case "group":
                if (FindTimetableBasedOn(selectedSubjects.concat([s]), CurrentTimetableFinder).length > 0) {
                    s.ClashReport = null;
                }
                break;
        }
    }
}

export function CheckForClashesBetween(s: Subject, subjects: Subject[]): ClashReport {
    for (let i = 0; i < subjects.length; i++) {
        for (let j = 0; j < subjects[i].ClashingCounterparts.length; j++) {
            if (s.Code === subjects[i].ClashingCounterparts[j]) {
                return new ClashReport("single", Beautify(subjects[i].Name));
            }
        }
    }
    return null;
}

export function FindTimetableBasedOn(
    subjects: Subject[],
    timetableFinder: (rawSlots: RawSlot[]) => Timetable[] ): Timetable[] {
    if (subjects.length === 0) {
        return [];
    }
    let slotIds = [];
    for (let i = 0; i < subjects.length; i++) {
        slotIds = slotIds.concat(subjects[i].SlotIds);
    }
    return timetableFinder(RawSlot.GetBunch(slotIds));
}
