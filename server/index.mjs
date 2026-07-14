import { createServer } from "node:http";
import { getSsqHistory } from "./ssq-data.mjs";
import { generateSsqTicket } from "./ssq-model.mjs";

const port = Number(process.env.PORT || 8787);

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(data));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function formatSeed(date = new Date()) {
  const values = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
  return `${values[0]}${values.slice(1).map((value) => String(value).padStart(2, "0")).join("")}`;
}

const server = createServer(async (request, response) => {
  if (!request.url) return sendJson(response, 404, { error: "Not found" });
  if (request.method === "OPTIONS") return sendJson(response, 204, {});

  const url = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (request.method === "GET" && url.pathname === "/api/ssq/health") {
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === "GET" && url.pathname === "/api/ssq/history") {
      const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 60), 1), 120);
      const history = await getSsqHistory();
      return sendJson(response, 200, { ...history, draws: history.draws.slice(0, limit) });
    }

    if (request.method === "POST" && url.pathname === "/api/ssq/sync") {
      const history = await getSsqHistory({ force: true });
      return sendJson(response, 200, history);
    }

    if (request.method === "POST" && url.pathname === "/api/ssq/generate") {
      const body = await readBody(request);
      const history = await getSsqHistory();
      const ticket = generateSsqTicket({
        zodiacId: String(body.zodiacId || "aries"),
        mbtiType: String(body.mbtiType || "INFP"),
        seed: String(body.seed || formatSeed()),
        history: history.draws
      });
      return sendJson(response, 200, { ticket, source: history.source, warning: history.warning });
    }

    return sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    return sendJson(response, 500, { error: error instanceof Error ? error.message : "Unknown server error" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Starheart API listening on http://127.0.0.1:${port}`);
});
