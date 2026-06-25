import { useAppState } from "../app/AppContext";
import ProfileImage from "../components/Common/ProfileImage";
import Section from "../components/Common/Section";
import Tag from "../components/Common/Tag";
import StarheartComboPreview from "../components/Starheart/StarheartComboPreview";
import { mbtiProfileMap } from "../data/mbtiProfiles";
import { zodiacProfiles } from "../data/zodiacProfiles";

export default function ZodiacPage() {
  const { selectedZodiacId, setSelectedZodiacId, selectedMBTIType } = useAppState();
  const selected = zodiacProfiles.find((item) => item.id === selectedZodiacId) ?? zodiacProfiles[0];

  return (
    <div className="space-y-8">
      <Section title="星座性格讲解" description="选择一个星座，查看性格关键词、关系风格、工作风格和幸运元素。">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {zodiacProfiles.map((profile) => (
            <button key={profile.id} onClick={() => setSelectedZodiacId(profile.id)} className={`rounded-md border p-3 text-left transition ${selected.id === profile.id ? "border-cyan-300 bg-cyan-300/15" : "border-white/15 bg-white/10 hover:bg-white/15"}`}>
              <div className="font-semibold">{profile.nameZh}</div>
              <div className="text-xs text-slate-300">{profile.nameEn}</div>
            </button>
          ))}
        </div>
      </Section>
      <div className="glass grid gap-6 rounded-lg p-5 md:grid-cols-[320px_1fr]">
        <ProfileImage src={selected.image} alt={`${selected.nameZh} AI 形象卡片`} />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{selected.nameZh} {selected.nameEn}</h1>
          <p className="text-slate-300">{selected.dateRange} · {selected.element} · 守护星 {selected.rulingPlanet}</p>
          <p className="leading-7 text-slate-200">{selected.summary}</p>
          <div className="flex flex-wrap gap-2">{selected.keywords.map((item) => <Tag key={item}>{item}</Tag>)}</div>
          <div className="grid gap-4 md:grid-cols-3">
            <Panel title="性格讲解" body={selected.personality.join("、")} />
            <Panel title="感情风格" body={selected.loveStyle} />
            <Panel title="工作风格" body={selected.careerStyle} />
          </div>
          <p className="text-sm text-slate-300">幸运色：{selected.luckyColor}</p>
        </div>
      </div>
      <StarheartComboPreview zodiac={selected} mbti={mbtiProfileMap[selectedMBTIType as keyof typeof mbtiProfileMap]} />
    </div>
  );
}

function Panel({ title, body }: { title: string; body: string }) {
  return <div className="rounded-md border border-white/10 bg-white/[0.06] p-4"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></div>;
}
