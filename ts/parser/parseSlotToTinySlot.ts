import {
    last,
    sortBy
} from "lodash";
import {
    ISlot
} from "../model/slot";
import {
    TinySlot
} from "../permutator/tinySlot";

export function ParseSlotToTinySlot(slots: ISlot[]): TinySlot[] {
    const sorted = sortBy(slots, ["SlotNumber"]);
    const result = new Array < TinySlot > ();
    result.push(new TinySlot(sorted[0]));
    for (let i = 1; i < sorted.length; i++) {
        const s = sorted[i];
        const prevSlot = last(result);
        if (s.SlotNumber === prevSlot.SlotNumber) {
            prevSlot.SlotIds.push(s.HashId);
            prevSlot.State[s.Day - 1] |= s.TimePeriod;
        } else {
            result.push(new TinySlot(s));
        }
    }
    return result;
}
