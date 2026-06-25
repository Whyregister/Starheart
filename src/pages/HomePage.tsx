import { Brain, Clover, Images, Sparkles, Stars } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { title: "免费 MBTI 测试", desc: "32 道题快速生成 16 型人格结果。", to: "/mbti", icon: Brain },
  { title: "星座性格讲解", desc: "查看 12 星座关键词、风格与幸运元素。", to: "/zodiac", icon: Stars },
  { title: "形象卡片宇宙", desc: "浏览星座与 MBTI 的 AI 形象卡片。", to: "/cards", icon: Images },
  { title: "昵称生成器", desc: "组合星座、MBTI 和风格词库。", to: "/nickname", icon: Sparkles },
  { title: "幸运号码生成器", desc: "用可复现随机种子生成娱乐号码。", to: "/lucky", icon: Clover }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid min-h-[58vh] items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-medium text-cyan-200">Starheart 星心</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">Starheart 星心</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">在星座、MBTI 与时间种子中，找到属于你的个性符号。</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/mbti" className="rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-glow">开始测试</Link>
            <Link to="/lucky" className="rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white">生成幸运号码</Link>
          </div>
        </div>
        <div className="glass overflow-hidden rounded-lg">
          <img src="/assets/starheart-hero.png" alt="Starheart 参考形象" className="h-full min-h-72 w-full object-cover" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {features.map(({ title, desc, to, icon: Icon }) => (
          <Link key={title} to={to} className="glass rounded-lg p-4 transition hover:-translate-y-1 hover:bg-white/[0.12]">
            <Icon className="mb-4 h-7 w-7 text-cyan-200" />
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
          </Link>
        ))}
      </section>

      <p className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
        本网站内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。
      </p>
    </div>
  );
}
