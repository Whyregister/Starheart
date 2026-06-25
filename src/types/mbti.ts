export type MBTIDimension = "EI" | "SN" | "TF" | "JP";
export type MBTILetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type MBTIQuestion = {
  id: string;
  text: string;
  dimension: MBTIDimension;
  positive: MBTILetter;
};

export type MBTIScores = Record<MBTILetter, number>;

export type MBTIResult = {
  type: MBTIType;
  scores: MBTIScores;
  uncertainDimensions: MBTIDimension[];
};

export type MBTIProfile = {
  type: MBTIType;
  nameZh: string;
  nameEn: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  nicknameStyles: string[];
  image: string;
  cardTheme: {
    primaryColor: string;
    secondaryColor: string;
    aura: string;
  };
};
