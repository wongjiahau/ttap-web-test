import {
    sortBy
} from "lodash";
import {
    ParseDay
} from "../../att/day";
import {
    TimePeriod
} from "../../att/timePeriod";
import {
    RawSlot
} from "../../model/rawSlot";

/**
 * @export
 * @param {RawSlot[]} rawSlots must be sorted according to Day
 * @param {number} xOffset
 * @param {number} yOffset
 * @returns {[ReactGridLayout.Layout[], ReactGridLayout.Layout[]]} [0] is the SlotsLayout, [1] is the DayColumnLayouts
 */
export function GenerateSlotAndDayLayouts(rawSlots: RawSlot[], xOffset: number, yOffset: number): [ReactGridLayout.Layout[], ReactGridLayout.Layout[]] {
    const dayRows = GetDayRows();
    const slotLayouts: ReactGridLayout.Layout[] = [];
    for (let h = 0; h < rawSlots.length; h++) {
        const slot = rawSlots[h];
        const Y = ParseDay(slot.Day) - 1;
        const timePeriod = TimePeriod.Parse(slot.TimePeriod);
        let extraYOffset = 0;
        for (let i = 0; i < dayRows[Y].state.length; i++) {
            const state = dayRows[Y].state[i];
            if ((timePeriod.BinaryData & state) === 0) {
                extraYOffset = i;
                if (i > 0 && state === 0) {
                    for (let j = Y + 1; j <= 6; j++) {
                        dayRows[j].rowIndex++;
                    }
                }
                dayRows[Y].state[i] |= timePeriod.BinaryData;
                break;
            }
        }
        const [X, W] = GetXandW(timePeriod);
        const layout: ReactGridLayout.Layout = {
            h: 1,
            i: "s" + h,
            w: W,
            x: X + xOffset,
            y: dayRows[Y].rowIndex + yOffset + extraYOffset
        };
        slotLayouts.push(layout);
    }
    return [slotLayouts, GetDayColumnLayouts(dayRows)];
}

export interface IDayRow {
    rowIndex: number;
    state: number[];
}

export function GetDayRows(): IDayRow[] {
    const dayRows: IDayRow[] = [];
    for (let i = 0; i < 7; i++) {
        dayRows.push({
            rowIndex: i,
            state: [0, 0, 0, 0, 0] // Assume to have maximum of 5 overlapping slot in one day
        });
    }
    return dayRows;
}

export function GetDayColumnLayouts(dayRows: IDayRow[]): ReactGridLayout.Layout[] {
    const result : ReactGridLayout.Layout[] = [];
    result.push({x: 0, w: 2, i: "d0", y: 0, h: 1}); // for the extra box on top of day column
    for (let i = 0; i < dayRows.length - 1; i++) {
        result.push({
            x: 0,
            w: 2,
            i: "d" + (i + 1),
            y: dayRows[i].rowIndex + 1, // +1 because of the extra box on top of day column
            h: dayRows[i + 1].rowIndex - dayRows[i].rowIndex
        });
    }
    result.push({x: 0, w: 2, i: "d7", y: dayRows[6].rowIndex + 1, h: 1});
    return result;
}

export function GetXandW(timePeriod: TimePeriod): [number, number] {
    let x = (timePeriod.StartTime.Hour - TimePeriod.Min.Hour) * 2;
    if (timePeriod.StartTime.Minute === 30) {
        x++;
    }
    const w = timePeriod
        .EndTime
        .Minus(timePeriod.StartTime)
        .TotalHours() * 2;
    return [x, w];
}
