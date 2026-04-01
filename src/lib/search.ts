import MiniSearch from 'minisearch';
import type { StartupIndex } from '../types/startup.ts';

let index: MiniSearch<StartupIndex> | null = null;

export function createSearchIndex(startups: StartupIndex[]): void {
  index = new MiniSearch<StartupIndex>({
    fields: ['name', 'tagline', 'category'],
    storeFields: ['slug'],
    idField: 'slug',
    searchOptions: {
      boost: { name: 3, tagline: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  index.addAll(startups);
}

export function searchStartups(query: string): string[] {
  if (!index || !query.trim()) return [];
  return index.search(query).map((r) => r.id);
}
