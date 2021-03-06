import * as typeName from "type-name";
import { STCBox } from "../../model/states/stcBox";
import {Action} from "../actions/action";
import {Timetable} from "./../../model/timetable";

export interface ITimetableListState {
    CurrentIndex:       number;
    FiltrateTimetables: Timetable[];
    ResidueTimetables:  Timetable[];
}

export function NewTimetableListState(timetables: Timetable[]) : ITimetableListState {
    return {
        CurrentIndex: 0,
        FiltrateTimetables: timetables,
        ResidueTimetables: [],
    };
}

export abstract class TimetableListStateAction extends Action < ITimetableListState > {
    public StateName() {
        return typeName(NewTimetableListState(null));
    }
}
