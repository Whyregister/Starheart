import { describe, expect, it } from "vitest";
import { getCelestialMode } from "./celestial";

describe("getCelestialMode", () => {
  it("uses the sun during daytime", () => {
    expect(getCelestialMode(new Date("2026-06-26T12:00:00"))).toBe("sun");
  });

  it("uses the moon at night", () => {
    expect(getCelestialMode(new Date("2026-06-26T22:00:00"))).toBe("moon");
  });
});
