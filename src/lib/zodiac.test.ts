import { describe, expect, it } from "vitest";
import { getZodiacByDate, getZodiacById } from "./zodiac";

describe("zodiac lookup", () => {
  it("finds a zodiac by id", () => {
    expect(getZodiacById("aries")?.nameZh).toBe("白羊座");
  });

  it("handles zodiac date ranges crossing the year boundary", () => {
    expect(getZodiacByDate(12, 25)?.id).toBe("capricorn");
    expect(getZodiacByDate(1, 15)?.id).toBe("capricorn");
  });
});
