import {
    expect
} from "chai";
import {
    GetTestRawSlot1,
    IndexOf
} from "../../tests/testDataGenerator";
import {
    ParseSlotToSubject
} from "../parseSlotToSubject";

describe("ParseSlotToSubject", () => {
    it("should set the SlotNumber property of each subject without duplication", () => {
        const subjects = ParseSlotToSubject(GetTestRawSlot1());
        expect(subjects[IndexOf.ACP].SlotNumbers).to.not.deep.eq(["10", "10", "11", "11"]);
        expect(subjects[IndexOf.ACP].SlotNumbers).to.deep.eq(["10", "11"]);
    });
});
