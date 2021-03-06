import {FindClashes} from "../clashFinder/findClashes";
import {Slot} from "../model/slot";
import ParseHtmlToSlots from "../parser/parseHtmlToRawSlot";
import {ParseRawSlotToSlot} from "../parser/parseRawSlotToSlot";
import { ParseSlotToBigSlot } from "../parser/parseSlotToBigSlot";
import {ParseSlotToSubject} from "../parser/parseSlotToSubject";
import {ParseSlotToTinySlot} from "../parser/parseSlotToTinySlot";
import { BigSlot } from "../permutator/bigSlot";
import {FindTimetable} from "../permutator/findTimetable";
import {TinySlot} from "../permutator/tinySlot";
import {heng_2017_sept} from "../tests/testData/heng_2017_sept";
import {RawSlot} from "./../model/rawSlot";
import {Subject} from "./../model/subject";
import {Timetable} from "./../model/timetable";

export const GetTestSubjects1 = () : Subject[] => {
    const subjects = ParseSlotToSubject(ParseHtmlToSlots(heng_2017_sept()));
    return subjects;
};

export const GetTestRawSlot1 = () : RawSlot[] => {
    RawSlot.Reset();
    return ParseHtmlToSlots(heng_2017_sept());
};

export const GetTestSlot1 = () : Slot[] => {
    return ParseRawSlotToSlot(GetTestRawSlot1());
};

export const GetTestTinySlot1 = () : TinySlot[] => {
    return ParseSlotToTinySlot(GetTestSlot1());
};

export const GetRawSlotsOf = (subjectCode: string) : RawSlot[] => {
    const subject = GetTestSubjects1().filter((x) => x.Code === subjectCode);
    if (subject.length === 0) {
        throw new Error("No subject have the code of " + subjectCode);
    }
    return RawSlot.GetBunch(subject[0].SlotIds);
};

export const GetTinySlotsOf = (subjectCode : string) : TinySlot[] => {
    const rawSlots = GetRawSlotsOf(subjectCode);
    const slots = ParseRawSlotToSlot(rawSlots);
    return ParseSlotToTinySlot(slots);
};

export const GetBigSlotsOf = (subjectCode : string) : BigSlot[] => {
    const subject = GetTestSubjects1().filter((x) => x.Code === subjectCode);
    if (subject.length === 0) {
        throw new Error("No subject have the code of " + subjectCode);
    }
    const rawSlots = RawSlot.GetBunch(subject[0].SlotIds);
    const slots = ParseRawSlotToSlot(rawSlots);
    return ParseSlotToBigSlot(slots);
};

export const GetTestTimetables1 = () : Timetable[] => {
    const input1 = GetTinySlotsOf("UEMX3653"); // WWT
    const input2 = GetTinySlotsOf("MPU3123"); // Titas
    const input3 = GetTinySlotsOf("UKMM1011"); // Sun Zi
    const allSlots = input1
        .concat(input2)
        .concat(input3);
    return FindTimetable(allSlots);
};

export enum CodeOf {
    ACP = "MPU34022",
    BKA = "MPU32013",
    BMK2 = "MPU3143",
    BEAM = "UKMM1043",
    CP = "MPU34032",
    EE = "UEMK4343",
    HE = "MPU3113",
    IT = "UEGE3114",
    ITF = "UALF1003",
    ITGL = "UALB1003",
    ITJ = "UALJ2013",
    ITK = "UJLL1093",
    LT = "MPU34152",
    MS3 = "MPU3173",
    SA1 = "UEMX2313",
    SZAOWBS = "UKMM1011",
    TITA = "MPU3123",
    WWT = "UEMX3653"
}

export enum IndexOf {
    ACP     = 0,
    BKA     = 1,
    BMK2    = 2,
    BEAM    = 3,
    CP      = 4,
    EE      = 5,
    HE      = 6,
    IT      = 7,
    ITF     = 8,
    ITGL    = 9,
    ITJ     = 10,
    ITK     = 11,
    LT      = 12,
    MS3     = 13,
    SA1     = 14,
    SZAOWBS = 15,
    TITA    = 16,
    WWT     = 17
}
