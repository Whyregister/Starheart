import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Button from "./Button";

export default function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button variant="secondary" onClick={copy} className="inline-flex items-center gap-2">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "已复制" : label}
    </Button>
  );
}
