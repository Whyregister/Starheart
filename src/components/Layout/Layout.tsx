import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  ["首页", "/"],
  ["MBTI", "/mbti"],
  ["星座", "/zodiac"],
  ["卡片", "/cards"],
  ["昵称", "/nickname"],
  ["幸运号码", "/lucky"],
  ["关于", "/about"]
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-2 md:flex-row md:items-center">
      {navItems.map(([label, to]) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm transition ${isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090b1a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-fuchsia-500 to-cyan-400">
              <Sparkles className="h-5 w-5" />
            </span>
            Starheart 星心
          </NavLink>
          <div className="hidden md:block">{nav}</div>
          <button className="rounded-md border border-white/15 p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="打开导航">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && <div className="mx-auto max-w-6xl px-4 pb-4 md:hidden">{nav}</div>}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 text-sm text-slate-400">
        星心 Starheart 提供的 MBTI、星座、昵称和幸运号码内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。
      </footer>
    </div>
  );
}
