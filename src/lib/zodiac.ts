import { zodiacProfiles } from "../data/zodiacProfiles";

function dayOfYear(month: number, day: number) {
  const starts = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return starts[month] + day;
}

export function getZodiacById(id: string) {
  return zodiacProfiles.find((profile) => profile.id === id);
}

export function getZodiacByDate(month: number, day: number) {
  const target = dayOfYear(month, day);
  return zodiacProfiles.find((profile) => {
    const start = dayOfYear(profile.start.month, profile.start.day);
    const end = dayOfYear(profile.end.month, profile.end.day);
    return start <= end ? target >= start && target <= end : target >= start || target <= end;
  });
}
