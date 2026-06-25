export default function AboutPage() {
  return (
    <div className="glass max-w-3xl space-y-5 rounded-lg p-6">
      <h1 className="text-4xl font-bold">关于星心</h1>
      <p className="leading-7 text-slate-300">Starheart / 星心 是一个结合 MBTI、星座、AI 形象卡片、昵称生成和幸运号码生成的轻量级娱乐 Web 应用。</p>
      <p className="leading-7 text-slate-300">第一版不要求登录，不连接数据库，不保存用户数据。MBTI 答题记录、星座选择、自定义模板和生成历史都只存在于当前页面运行状态中。</p>
      <p className="leading-7 text-slate-300">AI 形象图建议离线生成后放入 public/assets/cards/，前端只引用静态图片路径。如果图片暂时不存在，会显示统一占位图。</p>
      <p className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">星心 Starheart 提供的 MBTI、星座、昵称和幸运号码内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。</p>
    </div>
  );
}
