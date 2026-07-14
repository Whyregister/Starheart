import { describe, expect, it } from "vitest";
import type { SsqDraw } from "../types/ssq";
import { generateSsqTicket, normalizeSsqDraws } from "./ssqModel";

const history: SsqDraw[] = [
  { issue: "2026003", drawDate: "2026-01-07", redOrder: ["06", "01", "22", "19", "28", "11"], redSorted: ["01", "06", "11", "19", "22", "28"], blue: "08" },
  { issue: "2026002", drawDate: "2026-01-04", redOrder: ["03", "14", "25", "01", "17", "09"], redSorted: ["01", "03", "09", "14", "17", "25"], blue: "12" },
  { issue: "2026001", drawDate: "2026-01-01", redOrder: ["12", "04", "31", "08", "20", "16"], redSorted: ["04", "08", "12", "16", "20", "31"], blue: "02" }
];

describe("ssq model", () => {
  it("normalizes redSorted without changing redOrder draw sequence", () => {
    const [draw] = normalizeSsqDraws([
      { issue: "2026004", drawDate: "2026-01-09", redOrder: ["10", "02", "33", "18", "05", "27"], redSorted: [], blue: "6" }
    ]);

    expect(draw.redOrder).toEqual(["10", "02", "33", "18", "05", "27"]);
    expect(draw.redSorted).toEqual(["02", "05", "10", "18", "27", "33"]);
    expect(draw.blue).toBe("06");
  });

  it("generates deterministic valid double color ball tickets", () => {
    const input = {
      zodiacId: "aries",
      mbtiType: "INFP",
      history,
      seed: "20260709120000"
    };

    const first = generateSsqTicket(input);
    const second = generateSsqTicket(input);

    expect(first).toEqual(second);
    expect(first.redOrder).toHaveLength(6);
    expect(new Set(first.redOrder).size).toBe(6);
    expect(first.redOrder.every((value) => Number(value) >= 1 && Number(value) <= 33)).toBe(true);
    expect(Number(first.blue)).toBeGreaterThanOrEqual(1);
    expect(Number(first.blue)).toBeLessThanOrEqual(16);
  });

  it("trains with a one-year sample window and exposes model features", () => {
    const oneYearHistory = Array.from({ length: 190 }, (_, index): SsqDraw => {
      const start = (index % 28) + 1;
      const redOrder = Array.from({ length: 6 }, (_, offset) => String(((start + offset * 3 - 1) % 33) + 1).padStart(2, "0"));
      return {
        issue: String(2026000 + index),
        drawDate: "2026-01-01",
        redOrder,
        redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
        blue: String((index % 16) + 1).padStart(2, "0")
      };
    });

    const ticket = generateSsqTicket({
      zodiacId: "cancer",
      mbtiType: "INFP",
      history: oneYearHistory,
      seed: "20260715120000"
    });

    expect(ticket.model).toBe("trained-one-year-v2");
    expect(ticket.factors.historySize).toBe(160);
    expect(ticket.factors.trainingWindow).toBe("last-160-draws");
    expect(ticket.factors.features).toEqual(["frequency", "recency", "omission", "position", "zone-balance", "odd-even-balance"]);
  });
});
