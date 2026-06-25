import { createContext, useContext, useMemo, useState } from "react";
import { defaultLuckyTemplates } from "../data/defaultLuckyTemplates";
import type { LuckyNumberResult, LuckyNumberTemplate } from "../types/lucky";
import type { MBTIResult } from "../types/mbti";
import type { NicknameResult } from "../types/nickname";

type AppContextValue = {
  selectedZodiacId: string;
  setSelectedZodiacId: (value: string) => void;
  selectedMBTIType: string;
  setSelectedMBTIType: (value: string) => void;
  mbtiAnswers: Record<string, number>;
  setMbtiAnswers: (value: Record<string, number>) => void;
  mbtiResult?: MBTIResult;
  setMbtiResult: (value?: MBTIResult) => void;
  nicknameHistory: NicknameResult[];
  setNicknameHistory: (value: NicknameResult[]) => void;
  luckyTemplates: LuckyNumberTemplate[];
  setLuckyTemplates: (value: LuckyNumberTemplate[]) => void;
  luckyHistory: LuckyNumberResult[];
  setLuckyHistory: (value: LuckyNumberResult[]) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedZodiacId, setSelectedZodiacId] = useState("aries");
  const [selectedMBTIType, setSelectedMBTIType] = useState("INFP");
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<string, number>>({});
  const [mbtiResult, setMbtiResult] = useState<MBTIResult>();
  const [nicknameHistory, setNicknameHistory] = useState<NicknameResult[]>([]);
  const [luckyTemplates, setLuckyTemplates] = useState(defaultLuckyTemplates);
  const [luckyHistory, setLuckyHistory] = useState<LuckyNumberResult[]>([]);

  const value = useMemo(
    () => ({
      selectedZodiacId,
      setSelectedZodiacId,
      selectedMBTIType,
      setSelectedMBTIType,
      mbtiAnswers,
      setMbtiAnswers,
      mbtiResult,
      setMbtiResult,
      nicknameHistory,
      setNicknameHistory,
      luckyTemplates,
      setLuckyTemplates,
      luckyHistory,
      setLuckyHistory
    }),
    [selectedZodiacId, selectedMBTIType, mbtiAnswers, mbtiResult, nicknameHistory, luckyTemplates, luckyHistory]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppState must be used within AppProvider");
  return value;
}
