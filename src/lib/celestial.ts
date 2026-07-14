export type CelestialMode = "sun" | "moon";

export function getCelestialMode(date = new Date()): CelestialMode {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? "sun" : "moon";
}
