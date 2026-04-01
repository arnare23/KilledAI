import type { FailureCategory, StartupIndex } from '../types/startup.ts';

export interface FilterState {
  categories: FailureCategory[];
  shutdownAfter: string;
  shutdownBefore: string;
  sortBy: 'newest' | 'oldest' | 'funded';
}

export function defaultFilters(): FilterState {
  return {
    categories: [],
    shutdownAfter: '',
    shutdownBefore: '',
    sortBy: 'newest',
  };
}

function parseFunding(amount: string): number {
  const clean = amount.replace(/[^0-9.BMKbmk]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  const upper = clean.toUpperCase();
  if (upper.includes('B')) return num * 1_000_000_000;
  if (upper.includes('M')) return num * 1_000_000;
  if (upper.includes('K')) return num * 1_000;
  return num;
}

export function applyFilters(
  startups: StartupIndex[],
  filters: FilterState,
): StartupIndex[] {
  let result = startups;

  if (filters.categories.length > 0) {
    result = result.filter((s) => filters.categories.includes(s.category));
  }

  if (filters.shutdownAfter) {
    result = result.filter((s) => s.shutdown >= filters.shutdownAfter);
  }

  if (filters.shutdownBefore) {
    result = result.filter((s) => s.shutdown <= filters.shutdownBefore);
  }

  result = [...result];
  switch (filters.sortBy) {
    case 'newest':
      result.sort((a, b) => b.shutdown.localeCompare(a.shutdown));
      break;
    case 'oldest':
      result.sort((a, b) => a.shutdown.localeCompare(b.shutdown));
      break;
    case 'funded':
      result.sort((a, b) => parseFunding(b.funding_raised) - parseFunding(a.funding_raised));
      break;
  }

  return result;
}
