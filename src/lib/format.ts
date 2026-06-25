export function formatDateSeed(date = new Date()) {
  const parts = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ];
  return `${parts[0]}${parts.slice(1).map((value) => String(value).padStart(2, "0")).join("")}`;
}

export function uniqueTake<T>(items: T[], count: number) {
  return [...new Set(items)].slice(0, count);
}
