import { Link } from "react-router-dom";
import { generateNicknames } from "../../lib/nickname";
import type { MBTIProfile } from "../../types/mbti";
import type { ZodiacProfile } from "../../types/zodiac";
import Button from "../Common/Button";
import ProfileImage from "../Common/ProfileImage";
import Tag from "../Common/Tag";

export default function StarheartComboPreview({ zodiac, mbti }: { zodiac?: ZodiacProfile; mbti?: MBTIProfile }) {
  if (!zodiac || !mbti) return null;
  const keywords = [...new Set([...zodiac.keywords, ...mbti.keywords, ...zodiac.luckyKeywords])].slice(0, 8);
  const names = generateNicknames({ zodiacId: zodiac.id, mbtiType: mbti.type, style: "梦幻系", count: 3 }, 3);

  return (
    <div className="glass grid gap-4 rounded-lg p-4 md:grid-cols-[160px_1fr]">
      <div className="grid grid-cols-2 gap-2">
        <ProfileImage src={zodiac.image} alt={`${zodiac.nameZh} AI 形象卡片`} />
        <ProfileImage src={mbti.image} alt={`${mbti.type} AI 形象卡片`} />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-cyan-200">你的星心形象</p>
          <h3 className="text-2xl font-semibold">{zodiac.nameZh} × {mbti.type}</h3>
        </div>
        <div className="flex flex-wrap gap-2">{keywords.map((item) => <Tag key={item}>{item}</Tag>)}</div>
        <p className="text-sm text-slate-300">推荐昵称：{names.map((item) => item.value).join("、")}</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/nickname"><Button variant="secondary">生成昵称</Button></Link>
          <Link to="/lucky"><Button variant="secondary">生成幸运号码</Button></Link>
        </div>
      </div>
    </div>
  );
}
