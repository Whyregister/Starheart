import type { LuckyNumberResult, LuckyNumberTemplate } from "./lucky";
import type { MBTIResult } from "./mbti";
import type { NicknameResult } from "./nickname";

export type AppState = {
  selectedZodiacId?: string;
  selectedMBTIType?: string;
  mbtiAnswers: Record<string, number>;
  mbtiResult?: MBTIResult;
  nicknameHistory: NicknameResult[];
  luckyTemplates: LuckyNumberTemplate[];
  luckyHistory: LuckyNumberResult[];
};
