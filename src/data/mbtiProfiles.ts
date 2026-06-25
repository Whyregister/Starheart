import type { MBTIProfile, MBTIType } from "../types/mbti";

const names: Record<MBTIType, [string, string, string[], string[]]> = {
  INTJ: ["策划师", "Architect", ["星轨", "策略", "深夜", "远见"], ["冷淡系", "高级感"]],
  INTP: ["思想家", "Thinker", ["谜题", "宇宙", "灵感", "模型"], ["神秘系", "赛博系"]],
  ENTJ: ["指挥官", "Commander", ["王冠", "远征", "秩序", "锋芒"], ["高级感", "英文系"]],
  ENTP: ["辩论家", "Debater", ["闪电", "奇想", "反转", "冒险"], ["赛博系", "元气系"]],
  INFJ: ["提灯者", "Advocate", ["月影", "洞察", "守护", "预言"], ["梦幻系", "神秘系"]],
  INFP: ["调停者", "Mediator", ["月光", "梦境", "森林", "诗意", "温柔"], ["治愈系", "梦幻系", "文艺系"]],
  ENFJ: ["引路人", "Protagonist", ["晨星", "共鸣", "花火", "鼓舞"], ["元气系", "可爱系"]],
  ENFP: ["追光者", "Campaigner", ["彩虹", "风筝", "自由", "新鲜"], ["元气系", "二次元系"]],
  ISTJ: ["守序者", "Logistician", ["钟表", "石阶", "星历", "可靠"], ["高级感", "冷淡系"]],
  ISFJ: ["守护者", "Defender", ["烛光", "棉云", "怀抱", "安稳"], ["治愈系", "可爱系"]],
  ESTJ: ["执行官", "Executive", ["勋章", "路线", "清单", "掌控"], ["高级感", "英文系"]],
  ESFJ: ["执政官", "Consul", ["糖霜", "花束", "聚会", "温暖"], ["可爱系", "元气系"]],
  ISTP: ["工匠", "Virtuoso", ["机械", "短刃", "冷光", "行动"], ["冷淡系", "赛博系"]],
  ISFP: ["艺术家", "Adventurer", ["花瓣", "画笔", "微风", "即兴"], ["文艺系", "梦幻系"]],
  ESTP: ["冒险家", "Entrepreneur", ["火花", "速度", "街灯", "胆量"], ["元气系", "赛博系"]],
  ESFP: ["表演者", "Entertainer", ["舞台", "彩带", "笑容", "聚光"], ["可爱系", "二次元系"]]
};

export const mbtiProfiles: MBTIProfile[] = Object.entries(names).map(([type, [nameZh, nameEn, keywords, nicknameStyles]], index) => ({
  type: type as MBTIType,
  nameZh,
  nameEn,
  summary: `${type} ${nameZh}通常带着独特的节奏感，在自我探索、关系互动和行动选择中展现鲜明个性。`,
  strengths: ["自我风格清晰", "能在擅长领域持续投入", "对重要目标有独特判断"],
  weaknesses: ["压力下可能固执", "容易忽略相反视角", "节奏不合时会消耗能量"],
  keywords,
  nicknameStyles,
  image: `/assets/cards/mbti/${type.toLowerCase()}.webp`,
  cardTheme: {
    primaryColor: ["#A78BFA", "#60A5FA", "#F472B6", "#34D399"][index % 4],
    secondaryColor: ["#22D3EE", "#FBBF24", "#818CF8", "#FB7185"][index % 4],
    aura: keywords.join("、")
  }
}));

export const mbtiProfileMap = Object.fromEntries(mbtiProfiles.map((profile) => [profile.type, profile])) as Record<MBTIType, MBTIProfile>;
