import { mbtiProfileMap } from "../data/mbtiProfiles";
import { bannedWords, coreWords, prefixWords, suffixWords, styleWords } from "../data/nicknameWords";
import { zodiacProfiles } from "../data/zodiacProfiles";
import type { NicknameInput, NicknameResult } from "../types/nickname";

function isClean(value: string) {
  return !bannedWords.some((word) => value.includes(word));
}

export function generateNicknames(input: NicknameInput, count = input.count): NicknameResult[] {
  const zodiac = zodiacProfiles.find((item) => item.id === input.zodiacId) ?? zodiacProfiles[0];
  const mbti = mbtiProfileMap[input.mbtiType as keyof typeof mbtiProfileMap] ?? mbtiProfileMap.INFP;
  const requested = Math.min(50, Math.max(1, count || input.count || 10));
  const stylePool = styleWords[input.style] ?? styleWords["梦幻系"];
  const seeds = [...zodiac.keywords, ...mbti.keywords, ...zodiac.luckyKeywords, ...stylePool];
  const patterns = [
    (i: number) => `${prefixWords[i % prefixWords.length]}${seeds[i % seeds.length]}${coreWords[i % coreWords.length]}`,
    (i: number) => `${zodiac.nameZh.replace("座", "")}${stylePool[i % stylePool.length]}${mbti.type}`,
    (i: number) => `${mbti.type}${coreWords[i % coreWords.length]}`,
    (i: number) => `${suffixWords[i % suffixWords.length]}${zodiac.nameZh.replace("座", "")}心`,
    (i: number) => `${seeds[i % seeds.length]}${mbti.nameZh}`
  ];
  const values = new Set<string>();
  let cursor = 0;

  while (values.size < requested && cursor < 500) {
    const value = patterns[cursor % patterns.length](cursor);
    if (isClean(value)) values.add(value);
    cursor += 1;
  }

  return [...values].slice(0, requested).map((value) => ({
    value,
    source: { zodiac: zodiac.nameZh, mbti: mbti.type, style: input.style }
  }));
}
