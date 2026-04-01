import type { IndexFile, StartupIndex, StartupDetail } from '../types/startup.ts';

export async function loadIndex(): Promise<StartupIndex[]> {
  const res = await fetch('/data/index.json');
  const data: IndexFile = await res.json();
  return data.startups.filter((s) => s.status === 'published');
}

export async function loadStartup(slug: string): Promise<StartupDetail> {
  const res = await fetch(`/data/startups/${slug}.json`);
  return res.json();
}
