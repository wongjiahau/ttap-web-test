import {
    Filter
} from "../../model/states/filter";
import {
    GenerateTotalState
} from "../../model/states/generateTotalState";
import {
    STCBox
} from "../../model/states/stcBox";
import {
    Timetable
} from "../../model/timetable";
import {
    StateKind
} from "./../../model/states/stcBox";
import {
    ITimetableListState,
    TimetableListStateAction
} from "./../reducers/timetableListState";

export class FilterTimetable extends TimetableListStateAction {
    public constructor(private clickedState: STCBox) {
        super();
    }
    public TypeName(): string {
        return `filter timetable at [${this.clickedState.Uid}]`;
    }
    protected GenerateNewState(state: ITimetableListState): ITimetableListState {
        const [filtrate, residue] = Filter(state.FiltrateTimetables, this.clickedState);
        const newUidsOfClickedState = state.UidsOfClickedState.concat(this.clickedState.Uid);
        const newClickedTimeConstraint = state.ClickedTimeConstraint.slice();
        newClickedTimeConstraint[this.clickedState.Day] |= this.clickedState.TimePeriod;
        return {
            ...state,
            CurrentIndex: 0,
            FiltrateTimetables: filtrate,
            ResidueTimetables: state.ResidueTimetables.concat(residue),
            TotalState: GenerateTotalState(filtrate, newUidsOfClickedState),
            UidsOfClickedState: newUidsOfClickedState,
            ClickedTimeConstraint: newClickedTimeConstraint
        };
    }
}
