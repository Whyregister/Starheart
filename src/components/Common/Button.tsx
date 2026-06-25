import type { ButtonHTMLAttributes } from "react";

export default function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const styles = {
    primary: "bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white shadow-glow hover:brightness-110",
    secondary: "border border-white/15 bg-white/10 text-white hover:bg-white/15",
    ghost: "text-slate-200 hover:bg-white/10"
  };
  return <button className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props} />;
}
