import { describe, expect, it } from "vitest";
import { mbtiQuestions } from "../data/mbtiQuestions";
import { calculateMBTIResult } from "./mbti";

describe("calculateMBTIResult", () => {
  it("scores dominant letters and reports the resulting type", () => {
    const answers = Object.fromEntries(
      mbtiQuestions.map((question) => [question.id, question.positive === "I" || question.positive === "N" || question.positive === "F" || question.positive === "P" ? 5 : 1])
    );

    const result = calculateMBTIResult(answers, mbtiQuestions);

    expect(result.type).toBe("INFP");
    expect(result.scores.I).toBeGreaterThan(result.scores.E);
    expect(result.scores.N).toBeGreaterThan(result.scores.S);
    expect(result.scores.F).toBeGreaterThan(result.scores.T);
    expect(result.scores.P).toBeGreaterThan(result.scores.J);
  });

  it("marks dimensions as uncertain when scores tie", () => {
    const answers = Object.fromEntries(mbtiQuestions.map((question) => [question.id, 3]));

    const result = calculateMBTIResult(answers, mbtiQuestions);

    expect(result.uncertainDimensions).toEqual(["EI", "SN", "TF", "JP"]);
  });
});
