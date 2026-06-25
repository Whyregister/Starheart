export default function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs text-slate-100">{children}</span>;
}
