export type ZodiacElement = "火象" | "土象" | "风象" | "水象";

export type ZodiacProfile = {
  id: string;
  nameZh: string;
  nameEn: string;
  dateRange: string;
  start: { month: number; day: number };
  end: { month: number; day: number };
  element: ZodiacElement;
  rulingPlanet: string;
  keywords: string[];
  summary: string;
  personality: string[];
  loveStyle: string;
  careerStyle: string;
  luckyColor: string;
  luckyKeywords: string[];
  image: string;
  cardTheme: {
    primaryColor: string;
    secondaryColor: string;
    aura: string;
  };
};
