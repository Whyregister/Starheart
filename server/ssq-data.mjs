import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sampleSsqDraws } from "./sample-ssq-data.mjs";
import { normalizeSsqDraws } from "./ssq-model.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cachePath = join(__dirname, "cache", "ssq-history.json");
const historyWindowSize = 160;
const listEndpoint = `https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=${historyWindowSize}`;
const zhcwEndpoint = "https://jc.zhcw.com/port/client_json.php";
const juheHistoryEndpoint = "https://apis.juhe.cn/lottery/history";

function padBall(value) {
  return String(Number(value)).padStart(2, "0");
}

function splitBalls(value) {
  return String(value ?? "")
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(padBall);
}

function splitJuheLotteryResult(value) {
  const balls = splitBalls(value);
  if (balls.length < 7) return { red: [], blue: "" };
  return { red: balls.slice(0, 6), blue: balls[6] };
}

function extractFirstSixPlusBlue(text) {
  const values = text.match(/\b\d{1,2}\b/g)?.map(Number).filter((value) => value >= 1 && value <= 33) ?? [];
  const uniqueRed = [];
  for (const value of values) {
    if (uniqueRed.length === 6) break;
    if (value >= 1 && value <= 33 && !uniqueRed.includes(value)) uniqueRed.push(value);
  }
  return uniqueRed.length === 6 ? uniqueRed.map(padBall) : [];
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 Starheart/1.0",
      Referer: "https://www.cwl.gov.cn/"
    }
  });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} ${url}`);
  return response.json();
}

async function fetchJsonp(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 Starheart/1.0",
      Referer: "https://www.zhcw.com/kjxx/ssq/kjxq/"
    }
  });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} ${url}`);
  const text = await response.text();
  const json = text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, "");
  return JSON.parse(json);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 Starheart/1.0",
      Referer: "https://www.zhcw.com/"
    }
  });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} ${url}`);
  return response.text();
}

async function tryFetchDrawOrder(draw) {
  const detailUrl = draw.detailsLink || draw.detailLink || draw.link || draw.url;
  if (!detailUrl) return [];
  const sourceUrl = detailUrl.startsWith("http") ? detailUrl : `https://www.cwl.gov.cn${detailUrl}`;
  const html = await fetchText(sourceUrl);
  const orderIndex = html.indexOf("出球顺序");
  if (orderIndex === -1) return [];
  return extractFirstSixPlusBlue(html.slice(orderIndex, orderIndex + 600));
}

function mapApiDraw(draw, redOrder) {
  const redSorted = splitBalls(draw.red || draw.redCode || draw.redball || draw.winningNumbers);
  const order = redOrder.length === 6 ? redOrder : redSorted;
  return {
    issue: String(draw.code || draw.issue || draw.expect || ""),
    drawDate: String(draw.date || draw.drawDate || draw.openTime || ""),
    redOrder: order,
    redSorted,
    blue: padBall(draw.blue || draw.blueCode || draw.blueball),
    sourceUrl: draw.detailsLink || draw.detailLink || draw.link || listEndpoint,
    fetchedAt: new Date().toISOString()
  };
}

async function fetchRemoteDraws() {
  const payload = await fetchJson(listEndpoint);
  const rows = Array.isArray(payload.result) ? payload.result : Array.isArray(payload.data) ? payload.data : [];
  const mapped = [];

  for (const row of rows.slice(0, historyWindowSize)) {
    let redOrder = [];
    try {
      redOrder = await tryFetchDrawOrder(row);
    } catch {
      redOrder = [];
    }
    mapped.push(mapApiDraw(row, redOrder));
  }

  return normalizeSsqDraws(mapped);
}

async function fetchZhcwDraw(issue) {
  const url = `${zhcwEndpoint}?transactionType=10001002&lotteryId=1&issue=${issue}&tt=${Math.random()}&callback=cb`;
  const draw = await fetchJsonp(url);
  return {
    issue: String(draw.issue || issue),
    drawDate: String(draw.openTime || ""),
    redOrder: splitBalls(draw.seqFrontWinningNum || draw.frontWinningNum),
    redSorted: splitBalls(draw.frontWinningNum),
    blue: padBall(draw.seqBackWinningNum || draw.backWinningNum),
    sourceUrl: "https://www.zhcw.com/kjxx/ssq/kjxq/",
    fetchedAt: new Date().toISOString()
  };
}

async function fetchZhcwDraws(count = historyWindowSize) {
  const url = `${zhcwEndpoint}?transactionType=10001003&lotteryId=1&count=${count}&tt=${Math.random()}&callback=cb`;
  const payload = await fetchJsonp(url);
  const issues = Array.isArray(payload.issue) ? payload.issue : [];
  const draws = [];

  for (const issue of issues.slice(0, count)) {
    draws.push(await fetchZhcwDraw(issue));
  }

  return normalizeSsqDraws(draws);
}

async function fetchJuheDraws(count = historyWindowSize) {
  const key = process.env.JUHE_LOTTERY_KEY?.trim();
  if (!key) return [];

  const pageSize = 50;
  const pageCount = Math.ceil(count / pageSize);
  const draws = [];

  for (let page = 1; page <= pageCount; page += 1) {
    const params = new URLSearchParams({
      key,
      lottery_id: "ssq",
      page_size: String(pageSize),
      page: String(page)
    });
    const payload = await fetchJson(`${juheHistoryEndpoint}?${params.toString()}`);
    if (payload.error_code !== 0) throw new Error(`聚合数据接口失败：${payload.reason || payload.error_code}`);

    const rows = payload.result?.lotteryResList;
    if (!Array.isArray(rows)) break;

    for (const row of rows) {
      const { red, blue } = splitJuheLotteryResult(row.lottery_res);
      draws.push({
        issue: String(row.lottery_no || ""),
        drawDate: String(row.lottery_date || ""),
        redOrder: red,
        redSorted: [...red].sort((a, b) => Number(a) - Number(b)),
        blue,
        sourceUrl: juheHistoryEndpoint,
        fetchedAt: new Date().toISOString()
      });
    }
  }

  return normalizeSsqDraws(draws).slice(0, count);
}

export async function readCachedDraws() {
  try {
    const content = await readFile(cachePath, "utf8");
    const parsed = JSON.parse(content);
    return normalizeSsqDraws(parsed.draws ?? parsed);
  } catch {
    return [];
  }
}

export async function writeCachedDraws(draws) {
  await mkdir(dirname(cachePath), { recursive: true });
  await writeFile(cachePath, JSON.stringify({ updatedAt: new Date().toISOString(), draws }, null, 2), "utf8");
}

export async function getSsqHistory({ force = false } = {}) {
  const cached = await readCachedDraws();
  if (!force && cached.length > 0) return { draws: cached, source: "cache" };
  let providerWarning = "";

  try {
    const juhe = await fetchJuheDraws(historyWindowSize);
    if (juhe.length > 0) {
      await writeCachedDraws(juhe);
      return { draws: juhe, source: "juhe", warning: "聚合数据历史接口不提供真实红球出球顺序，当前红球原顺序使用接口返回号码顺序。" };
    }
  } catch (error) {
    providerWarning = error.message;
  }

  try {
    const remote = await fetchZhcwDraws(historyWindowSize);
    if (remote.length > 0) {
      await writeCachedDraws(remote);
      return { draws: remote, source: "remote" };
    }
  } catch (error) {
    try {
      const remote = await fetchRemoteDraws();
      if (remote.length > 0) {
        await writeCachedDraws(remote);
        return { draws: remote, source: "remote", warning: "中彩网出球顺序接口不可用，已使用普通开奖列表兜底。" };
      }
    } catch {
      if (cached.length > 0) return { draws: cached, source: "cache", warning: providerWarning || error.message };
    }
  }

  return { draws: normalizeSsqDraws(sampleSsqDraws), source: "sample", warning: "未能抓取远程开奖数据，当前使用内置示例数据。" };
}
