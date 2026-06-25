import { describe, expect, it } from "vitest";
import { doubleColorBallTemplate } from "../data/defaultLuckyTemplates";
import { generateLuckyNumbers, validateLuckyTemplate } from "./luckyNumber";

describe("lucky numbers", () => {
  it("generates deterministic double color ball results", () => {
    const input = {
      zodiacId: "aries",
      mbtiType: "INFP",
      timeSeed: "20260625221530",
      template: doubleColorBallTemplate
    };

    expect(generateLuckyNumbers(input)).toEqual(generateLuckyNumbers(input));
  });

  it("rejects unique groups whose count exceeds available values", () => {
    const invalid = {
      ...doubleColorBallTemplate,
      groups: [{ ...doubleColorBallTemplate.groups[0], count: 40, min: 1, max: 10 }]
    };

    expect(validateLuckyTemplate(invalid).valid).toBe(false);
  });
});
