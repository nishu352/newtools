/**
 * OmniTools - Pure Productivity Engine
 * Random item pickers, list shuffler, and team dividers.
 */

export function pickRandomItems<T>(items: T[], count = 1, unique = true): T[] {
  if (!items || items.length === 0) return [];
  const safeCount = Math.max(1, count);

  if (unique) {
    const copy = [...items];
    const picked: T[] = [];
    const limit = Math.min(safeCount, copy.length);
    for (let i = 0; i < limit; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      picked.push(copy.splice(idx, 1)[0]);
    }
    return picked;
  }

  const picked: T[] = [];
  for (let i = 0; i < safeCount; i++) {
    const idx = Math.floor(Math.random() * items.length);
    picked.push(items[idx]);
  }
  return picked;
}

export function shuffleList<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function splitIntoGroups<T>(items: T[], numGroups: number): T[][] {
  const count = Math.max(1, Math.round(numGroups));
  const shuffled = shuffleList(items);
  const groups: T[][] = Array.from({ length: count }, () => []);

  shuffled.forEach((item, idx) => {
    groups[idx % count].push(item);
  });

  return groups;
}
