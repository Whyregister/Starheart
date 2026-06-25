import CopyButton from "../components/Common/CopyButton";
import ProfileImage from "../components/Common/ProfileImage";
import Section from "../components/Common/Section";
import Tag from "../components/Common/Tag";
import { mbtiProfiles } from "../data/mbtiProfiles";
import { zodiacProfiles } from "../data/zodiacProfiles";

export default function CardsPage() {
  return (
    <div className="space-y-10">
      <Section title="星座卡片" description="12 张星座形象卡片，支持复制展示文案。">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zodiacProfiles.map((profile) => (
            <article key={profile.id} className="glass rounded-lg p-4">
              <ProfileImage src={profile.image} alt={`${profile.nameZh} AI 形象卡片`} />
              <h2 className="mt-4 text-xl font-semibold">{profile.nameZh} {profile.nameEn}</h2>
              <p className="text-sm text-slate-300">{profile.dateRange} · {profile.element}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{profile.summary}</p>
              <div className="my-3 flex flex-wrap gap-2">{profile.keywords.map((item) => <Tag key={item}>{item}</Tag>)}</div>
              <CopyButton text={`${profile.nameZh} ${profile.nameEn}\n日期：${profile.dateRange}\n元素：${profile.element}\n关键词：${profile.keywords.join("、")}\n一句话：${profile.summary}`} />
            </article>
          ))}
        </div>
      </Section>
      <Section title="MBTI 卡片" description="16 张 MBTI 形象卡片，支持复制展示文案。">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mbtiProfiles.map((profile) => (
            <article key={profile.type} className="glass rounded-lg p-4">
              <ProfileImage src={profile.image} alt={`${profile.type} AI 形象卡片`} />
              <h2 className="mt-4 text-xl font-semibold">{profile.type} {profile.nameZh}</h2>
              <p className="text-sm text-slate-300">{profile.nameEn}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{profile.summary}</p>
              <div className="my-3 flex flex-wrap gap-2">{profile.keywords.map((item) => <Tag key={item}>{item}</Tag>)}</div>
              <CopyButton text={`${profile.type} ${profile.nameZh} ${profile.nameEn}\n关键词：${profile.keywords.join("、")}\n简介：${profile.summary}`} />
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
