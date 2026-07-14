export type SsqDraw = {
  issue: string;
  drawDate: string;
  redOrder: string[];
  redSorted: string[];
  blue: string;
  sourceUrl?: string;
  fetchedAt?: string;
};

export type SsqGeneratedTicket = {
  redOrder: string[];
  redSorted: string[];
  blue: string;
  model: "weighted-history" | "trained-one-year-v2";
  seed: string;
  generatedAt: string;
  factors: {
    zodiacId: string;
    mbtiType: string;
    historySize: number;
    trainingWindow?: string;
    features?: string[];
    score?: number;
  };
};

export type SsqGenerateInput = {
  zodiacId: string;
  mbtiType: string;
  history: SsqDraw[];
  seed: string;
};
