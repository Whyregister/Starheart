import { describe, expect, it } from "vitest";
import { generateNicknames } from "./nickname";

describe("generateNicknames", () => {
  it("caps output at 50 unique nicknames", () => {
    const results = generateNicknames(
      { zodiacId: "aries", mbtiType: "INFP", style: "梦幻系", count: 80 },
      80
    );

    expect(results).toHaveLength(50);
    expect(new Set(results.map((item) => item.value)).size).toBe(50);
  });
});
