import type { LuckyNumberTemplate } from "../types/lucky";

export const doubleColorBallTemplate: LuckyNumberTemplate = {
  id: "double-color-ball",
  name: "双色球",
  description: "红球 6 个，范围 1-33，不重复；蓝球 1 个，范围 1-16。",
  groups: [
    { id: "red", label: "红球", count: 6, min: 1, max: 33, unique: true, sort: "asc", padLength: 2 },
    { id: "blue", label: "蓝球", count: 1, min: 1, max: 16, unique: true, sort: "asc", padLength: 2 }
  ]
};

export const defaultLuckyTemplates = [doubleColorBallTemplate];
