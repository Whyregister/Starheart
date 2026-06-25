export type LuckyNumberGroup = {
  id: string;
  label: string;
  count: number;
  min: number;
  max: number;
  unique: boolean;
  sort: "asc" | "desc" | "none";
  padLength: number;
};

export type LuckyNumberTemplate = {
  id: string;
  name: string;
  description: string;
  groups: LuckyNumberGroup[];
};

export type LuckyNumberResult = {
  templateId: string;
  templateName: string;
  seed: string;
  groups: {
    label: string;
    numbers: string[];
  }[];
  createdAt: string;
};
