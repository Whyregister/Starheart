import { Link } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import Button from "../components/Common/Button";
import ProfileImage from "../components/Common/ProfileImage";
import Tag from "../components/Common/Tag";
import { mbtiProfileMap } from "../data/mbtiProfiles";
import type { MBTIDimension, MBTILetter } from "../types/mbti";

const pairs: Array<[MBTIDimension, MBTILetter, MBTILetter]> = [["EI", "E", "I"], ["SN", "S", "N"], ["TF", "T", "F"], ["JP", "J", "P"]];

export default function MBTIResultPage() {
  const { mbtiResult, selectedMBTIType } = useAppState();
  const profile = mbtiProfileMap[(mbtiResult?.type ?? selectedMBTIType) as keyof typeof mbtiProfileMap] ?? mbtiProfileMap.INFP;

  return (
    <div className="space-y-6">
      <div className="glass grid gap-6 rounded-lg p-5 md:grid-cols-[280px_1fr]">
        <ProfileImage src={profile.image} alt={`${profile.type} AI 形象卡片`} />
        <div className="space-y-4">
          <div>
            <p className="text-sm text-cyan-200">MBTI 结果</p>
            <h1 className="text-4xl font-bold">{profile.type} {profile.nameZh}</h1>
            <p className="mt-1 text-slate-300">{profile.nameEn}</p>
          </div>
          <p className="leading-7 text-slate-200">{profile.summary}</p>
          {mbtiResult?.uncertainDimensions.length ? (
            <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
              {mbtiResult.uncertainDimensions.join("、")} 维度倾向不明显，结果仅供参考。
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">{profile.keywords.map((item) => <Tag key={item}>{item}</Tag>)}</div>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoList title="优势特点" items={profile.strengths} />
            <InfoList title="可能短板" items={profile.weaknesses} />
          </div>
          {mbtiResult && (
            <div className="space-y-3">
              {pairs.map(([dimension, left, right]) => {
                const total = mbtiResult.scores[left] + mbtiResult.scores[right] || 1;
                return (
                  <div key={dimension}>
                    <div className="mb-1 flex justify-between text-xs text-slate-300"><span>{left}</span><span>{right}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${(mbtiResult.scores[left] / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link to="/nickname"><Button>跳转到昵称生成器</Button></Link>
        </div>
      </div>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.06] p-4">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
