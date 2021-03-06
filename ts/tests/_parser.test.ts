import {expect} from "chai";
import {find, last} from "lodash";
import * as S from "string";
import ParseHtmlToSlots from "../parser/parseHtmlToRawSlot";
import {ParseSlotToSubject} from "../parser/parseSlotToSubject";
import testManager from "./testManager";
import {FileName} from "./testManager";

const jiahau2017septHtml = new testManager().GetDataFrom(FileName.jiahau_2017_sept);

describe("Parser which is used to parse html into slots", () => {
    it("jiahau_2017_sept's last slot should have hash id of 202", () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseHtmlToSlots(plainHtml);
        expect(last(result).HashId)
            .to
            .equal(202);
    });

    it("jiahau_2017_sept's data should have 203 slots", () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseHtmlToSlots(plainHtml);
        expect(result.length)
            .to
            .equal(203);
    });

    it("jiahau_2017_sept's last slot should have number of 129", () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseHtmlToSlots(plainHtml);
        expect(last(result).Number)
            .to
            .equal("129");
    });

    it("jiahau_2017_sept's data should have 21 subjects", () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseSlotToSubject(ParseHtmlToSlots(plainHtml));
        expect(result.length)
            .to
            .equal(21);
    });

    it("jiahau_2017_sept's data first subject (sorted by name) should be Artificial Inte" +
            "lligence",
    () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseSlotToSubject(ParseHtmlToSlots(plainHtml));
        expect(result[0].Name.toLowerCase())
            .to
            .equal("Artificial Intelligence".toLowerCase());
    });

    it("jiahau_2017_sept's data first subject (sorted by name) should be TITAS", () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseSlotToSubject(ParseHtmlToSlots(plainHtml));
        expect(S(last(result).Name.toLowerCase()).contains("titas"))
            .to
            .equal(true);
    });

    it("jiahau_2017_sept's data subject Management Principles should contain 7 slots", () => {
        const plainHtml = jiahau2017septHtml;
        const result = ParseSlotToSubject(ParseHtmlToSlots(plainHtml));
        expect(find(result, {Name: "MANAGEMENT PRINCIPLES"}).SlotIds.length)
            .to
            .equal(7);
    });

    it("keli_2017_sept's data : subject UKAI3013 shold have name of E-Commerce", () => {
        const plainHtml = new testManager().GetDataFrom(FileName.keli_2017_sept);
        const result = ParseHtmlToSlots(plainHtml);
        expect(result.filter((s) => S(s.SubjectCode).contains("UKAI3013"))[0].SubjectName)
        .to
        .equal("E-COMMERCE");
    });

});
