import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppState } from "../app/AppContext";
import Button from "../components/Common/Button";
import CopyButton from "../components/Common/CopyButton";
import Section from "../components/Common/Section";
import StarheartComboPreview from "../components/Starheart/StarheartComboPreview";
import { defaultLuckyTemplates } from "../data/defaultLuckyTemplates";
import { mbtiProfileMap, mbtiProfiles } from "../data/mbtiProfiles";
import { zodiacProfiles } from "../data/zodiacProfiles";
import { formatDateSeed } from "../lib/format";
import { generateLuckyNumbers, validateLuckyTemplate } from "../lib/luckyNumber";
import type { LuckyNumberTemplate } from "../types/lucky";

export default function LuckyPage() {
  const state = useAppState();
  const [timeSeed, setTimeSeed] = useState(formatDateSeed());
  const [templateId, setTemplateId] = useState(state.luckyTemplates[0].id);
  const [draft, setDraft] = useState<LuckyNumberTemplate>({ id: "custom-" + Date.now(), name: "自定义模板", description: "当前窗口内有效", groups: [{ id: "group-1", label: "号码", count: 5, min: 1, max: 35, unique: true, sort: "asc", padLength: 2 }] });
  const selectedTemplate = state.luckyTemplates.find((item) => item.id === templateId) ?? state.luckyTemplates[0];
  const result = state.luckyHistory[0];
  const zodiac = zodiacProfiles.find((item) => item.id === state.selectedZodiacId) ?? zodiacProfiles[0];
  const mbti = mbtiProfileMap[state.selectedMBTIType as keyof typeof mbtiProfileMap] ?? mbtiProfileMap.INFP;
  const draftValidation = useMemo(() => validateLuckyTemplate(draft), [draft]);

  function generate() {
    const next = generateLuckyNumbers({ zodiacId: state.selectedZodiacId, mbtiType: state.selectedMBTIType, timeSeed, template: selectedTemplate });
    state.setLuckyHistory([next, ...state.luckyHistory]);
  }

  function saveDraft() {
    if (!draftValidation.valid) return;
    const next = { ...draft, id: "custom-" + Date.now() };
    state.setLuckyTemplates([...state.luckyTemplates, next]);
    setTemplateId(next.id);
  }

  return (
    <div className="space-y-8">
      <Section title="幸运号码生成器" description="幸运号码由星座、MBTI、时间种子和模板配置共同生成，仅供娱乐参考。">
        <div className="glass grid gap-4 rounded-lg p-5 md:grid-cols-4">
          <label className="space-y-2"><span className="label">星座</span><select className="field" value={state.selectedZodiacId} onChange={(e) => state.setSelectedZodiacId(e.target.value)}>{zodiacProfiles.map((item) => <option key={item.id} value={item.id}>{item.nameZh}</option>)}</select></label>
          <label className="space-y-2"><span className="label">MBTI</span><select className="field" value={state.selectedMBTIType} onChange={(e) => state.setSelectedMBTIType(e.target.value)}>{mbtiProfiles.map((item) => <option key={item.type} value={item.type}>{item.type}</option>)}</select></label>
          <label className="space-y-2"><span className="label">时间种子</span><input className="field" value={timeSeed} onChange={(e) => setTimeSeed(e.target.value)} /></label>
          <label className="space-y-2"><span className="label">模板</span><select className="field" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>{state.luckyTemplates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="flex flex-wrap gap-3 md:col-span-4">
            <Button onClick={generate}>生成号码</Button>
            <Button variant="secondary" onClick={() => setTimeSeed(formatDateSeed())} className="inline-flex items-center gap-2"><RotateCcw className="h-4 w-4" /> 使用当前时间</Button>
            <Button variant="secondary" onClick={() => { state.setLuckyTemplates(defaultLuckyTemplates); setTemplateId(defaultLuckyTemplates[0].id); }}>恢复默认模板</Button>
          </div>
        </div>
      </Section>

      {result && (
        <div className="glass rounded-lg p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm text-cyan-200">模板：{result.templateName}</p><h2 className="text-2xl font-semibold">生成结果</h2></div>
            <CopyButton text={result.groups.map((group) => `${group.label}：${group.numbers.join(" ")}`).join("\n")} label="复制号码" />
          </div>
          <div className="space-y-3">
            {result.groups.map((group) => <p key={group.label} className="text-lg"><span className="text-slate-300">{group.label}：</span>{group.numbers.join(" ")}</p>)}
            <p className="break-all text-xs text-slate-400">种子：{result.seed}</p>
          </div>
        </div>
      )}

      <StarheartComboPreview zodiac={zodiac} mbti={mbti} />

      <Section title="自定义模板" description="自定义模板只保存在当前页面运行状态中，刷新或关闭后可以自然消失。">
        <div className="glass space-y-4 rounded-lg p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2"><span className="label">模板名称</span><input className="field" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
            <label className="space-y-2"><span className="label">模板说明</span><input className="field" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          </div>
          {draft.groups.map((group, index) => (
            <div key={group.id} className="grid gap-3 rounded-md border border-white/10 bg-white/[0.05] p-3 md:grid-cols-8">
              <input className="field md:col-span-2" value={group.label} onChange={(e) => setDraft({ ...draft, groups: draft.groups.map((item) => item.id === group.id ? { ...item, label: e.target.value } : item) })} />
              {(["count", "min", "max", "padLength"] as const).map((key) => <input key={key} className="field" type="number" value={group[key]} onChange={(e) => setDraft({ ...draft, groups: draft.groups.map((item) => item.id === group.id ? { ...item, [key]: Number(e.target.value) } : item) })} />)}
              <select className="field" value={group.unique ? "true" : "false"} onChange={(e) => setDraft({ ...draft, groups: draft.groups.map((item) => item.id === group.id ? { ...item, unique: e.target.value === "true" } : item) })}><option value="true">不重复</option><option value="false">可重复</option></select>
              <select className="field" value={group.sort} onChange={(e) => setDraft({ ...draft, groups: draft.groups.map((item) => item.id === group.id ? { ...item, sort: e.target.value as LuckyNumberTemplate["groups"][number]["sort"] } : item) })}><option value="asc">升序</option><option value="desc">降序</option><option value="none">不排序</option></select>
              <Button variant="ghost" onClick={() => setDraft({ ...draft, groups: draft.groups.filter((_, groupIndex) => groupIndex !== index) })} className="inline-flex items-center justify-center"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          {!draftValidation.valid && <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">{draftValidation.errors.join(" ")}</p>}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setDraft({ ...draft, groups: [...draft.groups, { id: "group-" + Date.now(), label: "新分组", count: 1, min: 1, max: 10, unique: true, sort: "asc", padLength: 2 }] })} className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> 添加分组</Button>
            <Button onClick={saveDraft} disabled={!draftValidation.valid}>保存到当前窗口</Button>
          </div>
        </div>
      </Section>
      <p className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
        幸运号码仅为随机娱乐结果，不预测任何彩票开奖结果，也不保证中奖。
      </p>
    </div>
  );
}
