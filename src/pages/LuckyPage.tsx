import { BrainCircuit, RefreshCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../app/AppContext";
import Button from "../components/Common/Button";
import CopyButton from "../components/Common/CopyButton";
import ProfileImage from "../components/Common/ProfileImage";
import Section from "../components/Common/Section";
import { sampleSsqDraws } from "../data/sampleSsqDraws";
import { mbtiProfileMap, mbtiProfiles } from "../data/mbtiProfiles";
import { zodiacProfiles } from "../data/zodiacProfiles";
import { formatDateSeed } from "../lib/format";
import { generateSsqTicket, normalizeSsqDraws } from "../lib/ssqModel";
import type { SsqDraw, SsqGeneratedTicket } from "../types/ssq";

type HistoryResponse = {
  draws: SsqDraw[];
  source: "remote" | "cache" | "sample";
  warning?: string;
};

type GenerateResponse = {
  ticket: SsqGeneratedTicket;
  source: "remote" | "cache" | "sample";
  warning?: string;
};

const redColumns = Array.from({ length: 33 }, (_, index) => String(index + 1).padStart(2, "0"));
const blueColumns = Array.from({ length: 16 }, (_, index) => String(index + 1).padStart(2, "0"));

export default function LuckyPage() {
  const state = useAppState();
  const [history, setHistory] = useState<SsqDraw[]>([]);
  const [ticket, setTicket] = useState<SsqGeneratedTicket>();
  const [source, setSource] = useState<HistoryResponse["source"]>("sample");
  const [warning, setWarning] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [generating, setGenerating] = useState(false);
  const zodiac = zodiacProfiles.find((item) => item.id === state.selectedZodiacId) ?? zodiacProfiles[0];
  const mbti = mbtiProfileMap[state.selectedMBTIType as keyof typeof mbtiProfileMap] ?? mbtiProfileMap.INFP;
  const normalizedHistory = useMemo(() => normalizeSsqDraws(history.length ? history : sampleSsqDraws), [history]);

  async function loadHistory(force = false) {
    setLoadingHistory(true);
    try {
      const response = await fetch(force ? "/api/ssq/sync" : "/api/ssq/history?limit=60", { method: force ? "POST" : "GET" });
      if (!response.ok) throw new Error("后端接口暂时不可用");
      const data = (await response.json()) as HistoryResponse;
      setHistory(normalizeSsqDraws(data.draws));
      setSource(data.source);
      setWarning(data.warning ?? "");
    } catch (error) {
      setHistory(sampleSsqDraws);
      setSource("sample");
      setWarning(error instanceof Error ? `${error.message}，当前使用内置示例数据。` : "当前使用内置示例数据。");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function generate() {
    setGenerating(true);
    const seed = formatDateSeed(new Date());
    try {
      const response = await fetch("/api/ssq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zodiacId: state.selectedZodiacId, mbtiType: state.selectedMBTIType, seed })
      });
      if (!response.ok) throw new Error("后端生成接口暂时不可用");
      const data = (await response.json()) as GenerateResponse;
      setTicket(data.ticket);
      setSource(data.source);
      setWarning(data.warning ?? "");
    } catch (error) {
      setTicket(generateSsqTicket({ zodiacId: state.selectedZodiacId, mbtiType: state.selectedMBTIType, history: normalizedHistory, seed }));
      setSource("sample");
      setWarning(error instanceof Error ? `${error.message}，当前使用本地模型兜底。` : "当前使用本地模型兜底。");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  const copyText = ticket ? `双色球娱乐生成\n原顺序红球：${ticket.redOrder.join(" ")}\n升序红球：${ticket.redSorted.join(" ")}\n蓝球：${ticket.blue}` : "";

  return (
    <div className="space-y-8">
      <Section title="双色球生成器" description="保留星座与 MBTI 作为个性因子，结合最近开奖历史做轻量统计模型生成。结果仅供娱乐，不预测中奖。">
        <div className="glass space-y-5 rounded-lg p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-2">
              <span className="label">星座</span>
              <select className="field" value={state.selectedZodiacId} onChange={(event) => state.setSelectedZodiacId(event.target.value)}>
                {zodiacProfiles.map((item) => <option key={item.id} value={item.id}>{item.nameZh}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="label">MBTI</span>
              <select className="field" value={state.selectedMBTIType} onChange={(event) => state.setSelectedMBTIType(event.target.value)}>
                {mbtiProfiles.map((item) => <option key={item.type} value={item.type}>{item.type}</option>)}
              </select>
            </label>
            <div className="flex items-end">
              <Button onClick={generate} disabled={generating} className="inline-flex w-full items-center justify-center gap-2 md:w-auto">
                <Sparkles className="h-4 w-4" />
                {generating ? "生成中" : "生成双色球"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">数据源：{sourceLabel(source)}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">历史样本：{normalizedHistory.length} 期</span>
            <Button variant="secondary" onClick={() => void loadHistory(true)} disabled={loadingHistory} className="inline-flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              {loadingHistory ? "同步中" : "同步开奖"}
            </Button>
          </div>

          {warning && <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">{warning}</p>}
        </div>
      </Section>

      {ticket && (
        <div className="glass rounded-lg p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cyan-100">
                <BrainCircuit className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm text-cyan-200">模型：轻量历史加权 · {zodiac.nameZh} · {state.selectedMBTIType}</p>
                <h2 className="text-2xl font-semibold">生成结果</h2>
              </div>
            </div>
            <CopyButton text={copyText} label="复制号码" />
          </div>
          <div className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-300">原顺序</p>
              <div className="flex flex-wrap items-center gap-3">
                {ticket.redOrder.map((number, index) => (
                  <span key={`order-${number}-${index}`} className="ssq-ball ssq-red-ball">{number}</span>
                ))}
                <span className="mx-1 h-10 w-px bg-white/15" />
                <span className="ssq-ball ssq-blue-ball">{ticket.blue}</span>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-slate-300">升序整理</p>
              <div className="flex flex-wrap items-center gap-3">
                {ticket.redSorted.map((number) => (
                  <span key={`sorted-${number}`} className="ssq-ball ssq-red-ball">{number}</span>
                ))}
                <span className="mx-1 h-10 w-px bg-white/15" />
                <span className="ssq-ball ssq-blue-ball">{ticket.blue}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-300">红球展示为模型抽取顺序；走势图里的历史红球优先使用出球顺序，抓不到时使用公开排序号码兜底。</p>
        </div>
      )}

      <div className="glass rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 md:max-w-md">
          <ProfileImage src={zodiac.image} alt={`${zodiac.nameZh} AI 形象卡片`} />
          <ProfileImage src={mbti.image} alt={`${mbti.type} AI 形象卡片`} />
        </div>
      </div>

      <Section title="最近双色球走势" description="按页面宽度自适应显示。红球圆点中的数字代表当期红球出球顺序，蓝球用蓝色圆点标记命中位置。">
        <div className="glass overflow-hidden rounded-lg">
          <div className="ssq-trend-wrap">
            <table className="ssq-trend-table">
              <thead>
                <tr>
                  <th>日期</th>
                  {redColumns.map((number) => <th key={`red-head-${number}`}>{number}</th>)}
                  {blueColumns.map((number) => <th key={`blue-head-${number}`} className="text-sky-200">{number}</th>)}
                </tr>
              </thead>
              <tbody>
                {normalizedHistory.slice(0, 40).map((draw) => (
                  <tr key={draw.issue}>
                    <td>{draw.drawDate}</td>
                    {redColumns.map((number) => {
                      const orderIndex = draw.redOrder.indexOf(number);
                      return (
                        <td key={`${draw.issue}-red-${number}`}>
                          {orderIndex >= 0 ? <span className="trend-red-hit">{orderIndex + 1}</span> : <span className="trend-miss trend-red-miss">{number}</span>}
                        </td>
                      );
                    })}
                    {blueColumns.map((number) => (
                      <td key={`${draw.issue}-blue-${number}`}>
                        {draw.blue === number ? <span className="trend-blue-hit">{number}</span> : <span className="trend-miss trend-blue-miss">{number}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <p className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
        双色球生成结果来自历史频率、近期权重和个性因子的娱乐模型。彩票开奖结果具有随机性，本页面不保证、不暗示也不预测中奖。
      </p>
    </div>
  );
}

function sourceLabel(source: HistoryResponse["source"]) {
  if (source === "remote") return "远程同步";
  if (source === "cache") return "本地缓存";
  return "示例兜底";
}
