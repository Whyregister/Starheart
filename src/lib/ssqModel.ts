import { sampleSsqDraws } from "../data/sampleSsqDraws";
import type { SsqDraw, SsqGeneratedTicket, SsqGenerateInput } from "../types/ssq";
import { createSeededRandom } from "./random";

const RED_MIN = 1;
const RED_MAX = 33;
const BLUE_MIN = 1;
const BLUE_MAX = 16;

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

  draws.forEach((draw, drawIndex) => {
    const recencyWeight = Math.max(1, 8 - drawIndex * 0.12);
    pick(draw).forEach((ball, position) => {
      const value = Number(ball);
      weights.set(value, (weights.get(value) ?? 1) + recencyWeight + position * 0.04);
    });
  });

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

export function generateSsqTicket(input: SsqGenerateInput): SsqGeneratedTicket {
  const history = normalizeSsqDraws(input.history.length ? input.history : sampleSsqDraws);
  const random = createSeededRandom(`${input.zodiacId}-${input.mbtiType}-${input.seed}-${history.map((draw) => draw.issue).join("|")}`);
  const redWeights = buildWeights(history, RED_MIN, RED_MAX, (draw) => draw.redOrder);
  const blueWeights = buildWeights(history, BLUE_MIN, BLUE_MAX, (draw) => [draw.blue]);
  const blocked = new Set<number>();
  const redOrder: string[] = [];

  while (redOrder.length < 6) {
    const value = weightedPick(redWeights, random, blocked);
    blocked.add(value);
    redOrder.push(padBall(value));
  }

  const blue = padBall(weightedPick(blueWeights, random));

  return {
    redOrder,
    redSorted: [...redOrder].sort((a, b) => Number(a) - Number(b)),
    blue,
    model: "weighted-history",
    seed: input.seed,
    generatedAt: new Date(0).toISOString(),
    factors: {
      zodiacId: input.zodiacId,
      mbtiType: input.mbtiType,
      historySize: history.length
    }
  };
}
