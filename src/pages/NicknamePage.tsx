import { Trash2 } from "lucide-react";
import { useAppState } from "../app/AppContext";
import Button from "../components/Common/Button";
import CopyButton from "../components/Common/CopyButton";
import Section from "../components/Common/Section";
import StarheartComboPreview from "../components/Starheart/StarheartComboPreview";
import { mbtiProfileMap, mbtiProfiles } from "../data/mbtiProfiles";
import { nicknameStyles } from "../data/nicknameWords";
import { zodiacProfiles } from "../data/zodiacProfiles";
import { generateNicknames } from "../lib/nickname";

export default function NicknamePage() {
  const state = useAppState();
  const zodiac = zodiacProfiles.find((item) => item.id === state.selectedZodiacId) ?? zodiacProfiles[0];
  const mbti = mbtiProfileMap[state.selectedMBTIType as keyof typeof mbtiProfileMap] ?? mbtiProfileMap.INFP;

  function generate() {
    state.setNicknameHistory(generateNicknames({ zodiacId: state.selectedZodiacId, mbtiType: state.selectedMBTIType, style: (document.getElementById("nickname-style") as HTMLSelectElement).value, count: Number((document.getElementById("nickname-count") as HTMLInputElement).value) || 10 }, Number((document.getElementById("nickname-count") as HTMLInputElement).value) || 10));
  }

  return (
    <div className="space-y-8">
      <Section title="昵称生成器" description="根据星座、MBTI 和昵称风格组合生成不重复昵称。">
        <div className="glass grid gap-4 rounded-lg p-5 md:grid-cols-4">
          <label className="space-y-2"><span className="label">星座</span><select className="field" value={state.selectedZodiacId} onChange={(e) => state.setSelectedZodiacId(e.target.value)}>{zodiacProfiles.map((item) => <option key={item.id} value={item.id}>{item.nameZh}</option>)}</select></label>
          <label className="space-y-2"><span className="label">MBTI</span><select className="field" value={state.selectedMBTIType} onChange={(e) => state.setSelectedMBTIType(e.target.value)}>{mbtiProfiles.map((item) => <option key={item.type} value={item.type}>{item.type}</option>)}</select></label>
          <label className="space-y-2"><span className="label">风格</span><select id="nickname-style" className="field" defaultValue="梦幻系">{nicknameStyles.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="label">数量</span><input id="nickname-count" className="field" type="number" min={1} max={50} defaultValue={10} /></label>
          <div className="flex gap-3 md:col-span-4">
            <Button onClick={generate}>生成昵称</Button>
            <Button variant="secondary" onClick={() => state.setNicknameHistory([])} className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> 清空结果</Button>
          </div>
        </div>
      </Section>
      <StarheartComboPreview zodiac={zodiac} mbti={mbti} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {state.nicknameHistory.map((item) => (
          <div key={item.value} className="glass flex items-center justify-between gap-3 rounded-lg p-4">
            <div><div className="font-semibold">{item.value}</div><div className="text-xs text-slate-400">{item.source.zodiac} · {item.source.mbti} · {item.source.style}</div></div>
            <CopyButton text={item.value} label="复制" />
          </div>
        ))}
      </div>
    </div>
  );
}
