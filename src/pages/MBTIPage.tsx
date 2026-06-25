import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../app/AppContext";
import Button from "../components/Common/Button";
import Section from "../components/Common/Section";
import { mbtiQuestions } from "../data/mbtiQuestions";
import { calculateMBTIResult } from "../lib/mbti";

const options = ["非常不同意", "比较不同意", "不确定", "比较同意", "非常同意"];

export default function MBTIPage() {
  const navigate = useNavigate();
  const { mbtiAnswers, setMbtiAnswers, setMbtiResult, setSelectedMBTIType } = useAppState();
  const [index, setIndex] = useState(0);
  const question = mbtiQuestions[index];
  const answered = Object.keys(mbtiAnswers).length;
  const completed = answered === mbtiQuestions.length;

  function choose(value: number) {
    setMbtiAnswers({ ...mbtiAnswers, [question.id]: value });
  }

  function finish() {
    const result = calculateMBTIResult(mbtiAnswers, mbtiQuestions);
    setMbtiResult(result);
    setSelectedMBTIType(result.type);
    navigate("/mbti/result");
  }

  return (
    <div className="space-y-6">
      <Section title="免费 MBTI 测试" description="MBTI 测试结果仅供娱乐和自我观察参考，不代表专业心理测评或医学诊断。">
        <div className="glass rounded-lg p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-300">进度 {answered}/{mbtiQuestions.length}</span>
            <Button variant="ghost" className="inline-flex items-center gap-2" onClick={() => { setMbtiAnswers({}); setIndex(0); }}>
              <RotateCcw className="h-4 w-4" /> 重置
            </Button>
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${(answered / mbtiQuestions.length) * 100}%` }} />
          </div>
          <p className="text-sm text-cyan-200">第 {index + 1} 题 / {mbtiQuestions.length}</p>
          <h1 className="mt-3 text-2xl font-semibold">{question.text}</h1>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {options.map((label, optionIndex) => {
              const value = optionIndex + 1;
              return (
                <button
                  key={label}
                  onClick={() => choose(value)}
                  className={`rounded-md border px-3 py-4 text-sm transition ${mbtiAnswers[question.id] === value ? "border-cyan-300 bg-cyan-300/20" : "border-white/15 bg-white/10 hover:bg-white/15"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Button variant="secondary" disabled={index === 0} onClick={() => setIndex(index - 1)} className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 上一题
            </Button>
            {index < mbtiQuestions.length - 1 ? (
              <Button disabled={!mbtiAnswers[question.id]} onClick={() => setIndex(index + 1)} className="inline-flex items-center gap-2">
                下一题 <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button disabled={!completed} onClick={finish}>完成测试</Button>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
