import { createSeededRandom } from "./random";
import type { LuckyNumberResult, LuckyNumberTemplate } from "../types/lucky";

export function validateLuckyTemplate(template: LuckyNumberTemplate): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!template.name.trim()) errors.push("模板名称不能为空。");
  if (template.groups.length === 0) errors.push("模板至少需要一个号码分组。");

  for (const group of template.groups) {
    if (!group.label.trim()) errors.push("分组名称不能为空。");
    if (group.count <= 0) errors.push(`${group.label} 的数字数量必须大于 0。`);
    if (group.min > group.max) errors.push(`${group.label} 的最小值不能大于最大值。`);
    if (group.padLength < 0) errors.push(`${group.label} 的补零位数不能小于 0。`);
    if (group.unique && group.count > group.max - group.min + 1) {
      errors.push("当前配置要求数字不重复，但数量超过了范围容量，请调整数量或范围。");
    }
  }

  return { valid: errors.length === 0, errors };
}

export function generateLuckyNumbers(input: {
  zodiacId: string;
  mbtiType: string;
  timeSeed: string;
  template: LuckyNumberTemplate;
}): LuckyNumberResult {
  const validation = validateLuckyTemplate(input.template);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));

  const templateHash = JSON.stringify(input.template.groups);
  const seed = `${input.zodiacId}-${input.mbtiType}-${input.timeSeed}-${templateHash}`;
  const random = createSeededRandom(seed);
  const groups = input.template.groups.map((group) => {
    const numbers: number[] = [];
    const used = new Set<number>();

    while (numbers.length < group.count) {
      const value = Math.floor(random() * (group.max - group.min + 1)) + group.min;
      if (group.unique && used.has(value)) continue;
      used.add(value);
      numbers.push(value);
    }

    if (group.sort === "asc") numbers.sort((a, b) => a - b);
    if (group.sort === "desc") numbers.sort((a, b) => b - a);

    return {
      label: group.label,
      numbers: numbers.map((value) => String(value).padStart(group.padLength, "0"))
    };
  });

  return {
    templateId: input.template.id,
    templateName: input.template.name,
    seed,
    groups,
    createdAt: new Date(0).toISOString()
  };
}
