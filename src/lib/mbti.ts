import type { MBTIDimension, MBTILetter, MBTIQuestion, MBTIResult, MBTIScores, MBTIType } from "../types/mbti";

const pairs: Record<MBTIDimension, [MBTILetter, MBTILetter]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"]
};

function opposite(letter: MBTILetter): MBTILetter {
  const match = Object.values(pairs).find(([a, b]) => a === letter || b === letter);
  if (!match) return letter;
  return match[0] === letter ? match[1] : match[0];
}

export function calculateMBTIResult(answers: Record<string, number>, questions: MBTIQuestion[]): MBTIResult {
  const scores: MBTIScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const question of questions) {
    const value = Math.min(5, Math.max(1, answers[question.id] ?? 3));
    const positiveScore = value - 1;
    const negativeScore = 5 - value;
    scores[question.positive] += positiveScore;
    scores[opposite(question.positive)] += negativeScore;
  }

  const uncertainDimensions: MBTIDimension[] = [];
  const type = (Object.entries(pairs).map(([dimension, [left, right]]) => {
    if (scores[left] === scores[right]) uncertainDimensions.push(dimension as MBTIDimension);
    return scores[left] >= scores[right] ? left : right;
  }).join("")) as MBTIType;

  return { type, scores, uncertainDimensions };
}
