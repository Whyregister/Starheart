import { sampleSsqDraws } from "./sample-ssq-data.mjs";

const RED_MIN = 1;
const RED_MAX = 33;
const BLUE_MIN = 1;
const BLUE_MAX = 16;
const TRAINING_WINDOW_SIZE = 160;
const MODEL_FEATURES = ["frequency", "recency", "omission", "position", "zone-balance", "odd-even-balance"];

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
  const lastSeen = new Map();

  draws.forEach((draw, drawIndex) => {
    const recencyWeight = Math.max(0.8, 7 - drawIndex * 0.04);
    pick(draw).forEach((ball, position) => {
      const value = Number(ball);
      if (!lastSeen.has(value)) lastSeen.set(value, drawIndex);
      weights.set(value, (weights.get(value) ?? 1) + recencyWeight + (6 - position) * 0.08);
    });
  });

  range(min, max).forEach((value) => {
    const omission = lastSeen.has(value) ? lastSeen.get(value) : draws.length;
    weights.set(value, (weights.get(value) ?? 1) + Math.min(8, omission * 0.08));
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

function zoneScore(values) {
  const zones = [
    values.filter((value) => value <= 11).length,
    values.filter((value) => value >= 12 && value <= 22).length,
    values.filter((value) => value >= 23).length
  ];
  return 1 - zones.reduce((penalty, count) => penalty + Math.abs(count - 2), 0) / 8;
}

function oddEvenScore(values) {
  const oddCount = values.filter((value) => value % 2 === 1).length;
  return 1 - Math.abs(oddCount - 3) / 6;
}

function spreadScore(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const span = sorted[sorted.length - 1] - sorted[0];
  const adjacentPairs = sorted.filter((value, index) => index > 0 && value - sorted[index - 1] <= 1).length;
  return Math.min(1, span / 28) - adjacentPairs * 0.08;
}

function scoreTicket(redNumbers, redWeights, blue, blueWeights) {
  const redWeightScore = redNumbers.reduce((sum, value) => sum + (redWeights.get(value) ?? 1), 0) / redNumbers.length;
  const blueWeightScore = blueWeights.get(blue) ?? 1;
  return Number((redWeightScore * 0.58 + blueWeightScore * 0.22 + zoneScore(redNumbers) * 5 + oddEvenScore(redNumbers) * 4 + spreadScore(redNumbers) * 3).toFixed(4));
}

function buildCandidate(redWeights, blueWeights, random) {
  const blocked = new Set();
  const redNumbers = [];

  while (redNumbers.length < 6) {
    const value = weightedPick(redWeights, random, blocked);
    blocked.add(value);
    redNumbers.push(value);
  }

  const blue = weightedPick(blueWeights, random);
  const score = scoreTicket(redNumbers, redWeights, blue, blueWeights);
  return { redNumbers, blue, score };
}

export function generateSsqTicket({ zodiacId, mbtiType, history, seed }) {
  const normalizedHistory = normalizeSsqDraws(history?.length ? history : sampleSsqDraws);
  const trainingHistory = normalizedHistory.slice(0, TRAINING_WINDOW_SIZE);
  const random = createSeededRandom(`${zodiacId}-${mbtiType}-${seed}-${trainingHistory.map((draw) => draw.issue).join("|")}`);
  const redWeights = buildWeights(trainingHistory, RED_MIN, RED_MAX, (draw) => draw.redOrder);
  const blueWeights = buildWeights(trainingHistory, BLUE_MIN, BLUE_MAX, (draw) => [draw.blue]);
  const candidates = Array.from({ length: 36 }, () => buildCandidate(redWeights, blueWeights, random));
  const best = candidates.reduce((winner, candidate) => (candidate.score > winner.score ? candidate : winner), candidates[0]);
  const redOrder = best.redNumbers.map(padBall);

  return {
    redOrder,
    redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
    blue: padBall(best.blue),
    model: "trained-one-year-v2",
    seed,
    generatedAt: new Date().toISOString(),
    factors: {
      zodiacId,
      mbtiType,
      historySize: trainingHistory.length,
      trainingWindow: `last-${TRAINING_WINDOW_SIZE}-draws`,
      features: MODEL_FEATURES,
      score: best.score
    }
  };
}
