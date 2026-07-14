import { sampleSsqDraws } from "./sample-ssq-data.mjs";

const RED_MIN = 1;
const RED_MAX = 33;
const BLUE_MIN = 1;
const BLUE_MAX = 16;

function padBall(value) {
  return String(Number(value)).padStart(2, "0");
}

function range(min, max) {
  return Array.from({ length: max - min + 1 }, (_, index) => index + min);
}

function hashString(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed) {
  let state = hashString(seed) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

function isWithin(value, min, max) {
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max;
}

export function normalizeSsqDraws(draws) {
  return draws
    .map((draw) => {
      const redOrder = (draw.redOrder ?? []).map(padBall).filter((value, index, values) => isWithin(value, RED_MIN, RED_MAX) && values.indexOf(value) === index).slice(0, 6);
      if (redOrder.length !== 6 || !isWithin(draw.blue, BLUE_MIN, BLUE_MAX)) return undefined;
      return {
        ...draw,
        redOrder,
        redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
        blue: padBall(draw.blue)
      };
    })
    .filter(Boolean);
}

function buildWeights(draws, min, max, pick) {
  const weights = new Map();
  range(min, max).forEach((value) => weights.set(value, 1));

  draws.forEach((draw, drawIndex) => {
    const recencyWeight = Math.max(1, 8 - drawIndex * 0.12);
    pick(draw).forEach((ball, position) => {
      const value = Number(ball);
      weights.set(value, (weights.get(value) ?? 1) + recencyWeight + position * 0.04);
    });
  });

  return weights;
}

function weightedPick(weights, random, blocked = new Set()) {
  const candidates = [...weights.entries()].filter(([value]) => !blocked.has(value));
  const total = candidates.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = random() * total;

  for (const [value, weight] of candidates) {
    cursor -= weight;
    if (cursor <= 0) return value;
  }

  return candidates[candidates.length - 1][0];
}

export function generateSsqTicket({ zodiacId, mbtiType, history, seed }) {
  const normalizedHistory = normalizeSsqDraws(history?.length ? history : sampleSsqDraws);
  const random = createSeededRandom(`${zodiacId}-${mbtiType}-${seed}-${normalizedHistory.map((draw) => draw.issue).join("|")}`);
  const redWeights = buildWeights(normalizedHistory, RED_MIN, RED_MAX, (draw) => draw.redOrder);
  const blueWeights = buildWeights(normalizedHistory, BLUE_MIN, BLUE_MAX, (draw) => [draw.blue]);
  const blocked = new Set();
  const redOrder = [];

  while (redOrder.length < 6) {
    const value = weightedPick(redWeights, random, blocked);
    blocked.add(value);
    redOrder.push(padBall(value));
  }

  return {
    redOrder,
    redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
    blue: padBall(weightedPick(blueWeights, random)),
    model: "weighted-history",
    seed,
    generatedAt: new Date().toISOString(),
    factors: {
      zodiacId,
      mbtiType,
      historySize: normalizedHistory.length
    }
  };
}
