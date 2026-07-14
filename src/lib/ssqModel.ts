import { sampleSsqDraws } from "../data/sampleSsqDraws";
import type { SsqDraw, SsqGeneratedTicket, SsqGenerateInput } from "../types/ssq";
import { createSeededRandom } from "./random";

const RED_MIN = 1;
const RED_MAX = 33;
const BLUE_MIN = 1;
const BLUE_MAX = 16;
const TRAINING_WINDOW_SIZE = 160;
const MODEL_FEATURES = ["frequency", "recency", "omission", "position", "zone-balance", "odd-even-balance"];

function padBall(value: number | string) {
  return String(Number(value)).padStart(2, "0");
}

function range(min: number, max: number) {
  return Array.from({ length: max - min + 1 }, (_, index) => index + min);
}

function isWithin(value: string, min: number, max: number) {
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max;
}

export function normalizeSsqDraws(draws: SsqDraw[]): SsqDraw[] {
  return draws
    .map((draw) => {
      const redOrder = draw.redOrder.map(padBall).filter((value, index, values) => isWithin(value, RED_MIN, RED_MAX) && values.indexOf(value) === index).slice(0, 6);
      if (redOrder.length !== 6 || !isWithin(draw.blue, BLUE_MIN, BLUE_MAX)) return undefined;
      return {
        ...draw,
        redOrder,
        redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
        blue: padBall(draw.blue)
      };
    })
    .filter((draw): draw is SsqDraw => Boolean(draw));
}

function buildWeights(draws: SsqDraw[], min: number, max: number, pick: (draw: SsqDraw) => string[]) {
  const weights = new Map<number, number>();
  for (const value of range(min, max)) weights.set(value, 1);
  const lastSeen = new Map<number, number>();

  draws.forEach((draw, drawIndex) => {
    const recencyWeight = Math.max(0.8, 7 - drawIndex * 0.04);
    pick(draw).forEach((ball, position) => {
      const value = Number(ball);
      if (!lastSeen.has(value)) lastSeen.set(value, drawIndex);
      weights.set(value, (weights.get(value) ?? 1) + recencyWeight + (6 - position) * 0.08);
    });
  });

  for (const value of range(min, max)) {
    const omission = lastSeen.has(value) ? lastSeen.get(value)! : draws.length;
    weights.set(value, (weights.get(value) ?? 1) + Math.min(8, omission * 0.08));
  }

  return weights;
}

function weightedPick(weights: Map<number, number>, random: () => number, blocked = new Set<number>()) {
  const candidates = [...weights.entries()].filter(([value]) => !blocked.has(value));
  const total = candidates.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = random() * total;

  for (const [value, weight] of candidates) {
    cursor -= weight;
    if (cursor <= 0) return value;
  }

  return candidates[candidates.length - 1][0];
}

function zoneScore(values: number[]) {
  const zones = [
    values.filter((value) => value <= 11).length,
    values.filter((value) => value >= 12 && value <= 22).length,
    values.filter((value) => value >= 23).length
  ];
  return 1 - zones.reduce((penalty, count) => penalty + Math.abs(count - 2), 0) / 8;
}

function oddEvenScore(values: number[]) {
  const oddCount = values.filter((value) => value % 2 === 1).length;
  return 1 - Math.abs(oddCount - 3) / 6;
}

function spreadScore(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const span = sorted[sorted.length - 1] - sorted[0];
  const adjacentPairs = sorted.filter((value, index) => index > 0 && value - sorted[index - 1] <= 1).length;
  return Math.min(1, span / 28) - adjacentPairs * 0.08;
}

function scoreTicket(redNumbers: number[], redWeights: Map<number, number>, blue: number, blueWeights: Map<number, number>) {
  const redWeightScore = redNumbers.reduce((sum, value) => sum + (redWeights.get(value) ?? 1), 0) / redNumbers.length;
  const blueWeightScore = blueWeights.get(blue) ?? 1;
  return Number((redWeightScore * 0.58 + blueWeightScore * 0.22 + zoneScore(redNumbers) * 5 + oddEvenScore(redNumbers) * 4 + spreadScore(redNumbers) * 3).toFixed(4));
}

function buildCandidate(redWeights: Map<number, number>, blueWeights: Map<number, number>, random: () => number) {
  const blocked = new Set<number>();
  const redNumbers: number[] = [];

  while (redNumbers.length < 6) {
    const value = weightedPick(redWeights, random, blocked);
    blocked.add(value);
    redNumbers.push(value);
  }

  const blue = weightedPick(blueWeights, random);
  const score = scoreTicket(redNumbers, redWeights, blue, blueWeights);

  return { redNumbers, blue, score };
}

export function generateSsqTicket(input: SsqGenerateInput): SsqGeneratedTicket {
  const normalizedHistory = normalizeSsqDraws(input.history.length ? input.history : sampleSsqDraws);
  const history = normalizedHistory.slice(0, TRAINING_WINDOW_SIZE);
  const random = createSeededRandom(`${input.zodiacId}-${input.mbtiType}-${input.seed}-${history.map((draw) => draw.issue).join("|")}`);
  const redWeights = buildWeights(history, RED_MIN, RED_MAX, (draw) => draw.redOrder);
  const blueWeights = buildWeights(history, BLUE_MIN, BLUE_MAX, (draw) => [draw.blue]);
  const candidates = Array.from({ length: 36 }, () => buildCandidate(redWeights, blueWeights, random));
  const best = candidates.reduce((winner, candidate) => (candidate.score > winner.score ? candidate : winner), candidates[0]);
  const redOrder = best.redNumbers.map(padBall);
  const blue = padBall(best.blue);

  return {
    redOrder,
    redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
    blue,
    model: "trained-one-year-v2",
    seed: input.seed,
    generatedAt: new Date(0).toISOString(),
    factors: {
      zodiacId: input.zodiacId,
      mbtiType: input.mbtiType,
      historySize: history.length,
      trainingWindow: `last-${TRAINING_WINDOW_SIZE}-draws`,
      features: MODEL_FEATURES,
      score: best.score
    }
  };
}
