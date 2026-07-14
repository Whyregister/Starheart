import { Brain, Clover, Images, Sparkles, Stars } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { title: "免费 MBTI 测试", desc: "32 道题快速生成 16 型人格结果。", to: "/mbti", icon: Brain },
  { title: "星座性格讲解", desc: "查看 12 星座关键词、风格与幸运元素。", to: "/zodiac", icon: Stars },
  { title: "形象卡片宇宙", desc: "浏览星座与 MBTI 的 AI 形象卡片。", to: "/cards", icon: Images },
  { title: "昵称生成器", desc: "组合星座、MBTI 和风格词库。", to: "/nickname", icon: Sparkles },
  { title: "幸运号码生成器", desc: "用当前时间生成娱乐号码。", to: "/lucky", icon: Clover }
];

const stageCharacters = [
  { src: "/assets/cards/zodiac/aries.webp", alt: "白羊座", className: "left-[2%] top-[12%] w-40 -rotate-12" },
  { src: "/assets/cards/mbti/infp.webp", alt: "INFP", className: "right-[4%] top-[10%] w-40 rotate-12" },
  { src: "/assets/cards/zodiac/gemini.webp", alt: "双子座", className: "left-[12%] bottom-[16%] z-0 w-36 rotate-6" },
  { src: "/assets/cards/mbti/entp.webp", alt: "ENTP", className: "right-[13%] bottom-[15%] z-0 w-36 -rotate-6" },
  { src: "/assets/cards/zodiac/leo.webp", alt: "狮子座", className: "left-[28%] top-[1%] w-32 rotate-3" },
  { src: "/assets/cards/mbti/infj.webp", alt: "INFJ", className: "right-[30%] top-[2%] w-32 -rotate-3" },
  { src: "/assets/cards/zodiac/pisces.webp", alt: "双鱼座", className: "left-[36%] bottom-[2%] z-0 w-32 -rotate-2" },
  { src: "/assets/cards/mbti/esfp.webp", alt: "ESFP", className: "right-[36%] bottom-[1%] z-0 w-32 rotate-2" }
];

const mobileCharacters = stageCharacters.slice(0, 4);

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-lg py-8 md:min-h-[72vh] md:py-20">
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {stageCharacters.map((character) => (
            <img
              key={character.src}
              src={character.src}
              alt={character.alt}
              className={`home-stage-character absolute aspect-square object-cover ${character.className}`}
              loading="lazy"
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="text-sm font-medium text-cyan-200">Starheart 星心</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">Starheart 星心</h1>
          <p className="mt-5 max-w-2xl px-2 text-base leading-7 text-slate-300 md:text-lg md:leading-8">在星座、MBTI 与当前时间中，找到属于你的个性符号。</p>

          <div className="mt-7 grid w-full max-w-sm grid-cols-4 gap-2 px-4 md:hidden">
            {mobileCharacters.map((character) => (
              <img
                key={`mobile-${character.src}`}
                src={character.src}
                alt={character.alt}
                className="home-mobile-character aspect-square w-full object-cover"
                loading="lazy"
              />
            ))}
          </div>

          <div className="relative mt-8 grid w-full max-w-3xl gap-3 px-2 sm:grid-cols-2 md:mt-12 md:px-0 lg:grid-cols-5">
            {features.map(({ title, desc, to, icon: Icon }) => (
              <Link
                key={title}
                to={to}
                className="glass relative z-10 flex min-h-28 flex-col items-center justify-center rounded-lg px-4 py-4 text-center transition hover:-translate-y-1 hover:bg-white/[0.14] md:min-h-36 md:py-5"
              >
                <Icon className="mb-3 h-7 w-7 text-cyan-200" />
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-slate-300">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-cyan-200">Starheart Cast</p>
          <h2 className="text-2xl font-semibold md:text-3xl">星心大合影</h2>
        </div>
        <img
          src="/assets/cards/starheart-cast.webp"
          alt="星心星座与 MBTI 角色大合影"
          className="w-full rounded-lg border border-white/15 shadow-glow"
          loading="lazy"
        />
      </section>

      <p className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
        本网站内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。
      </p>
    </div>
  );
}
