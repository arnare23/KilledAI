import type { FailureCategory, StartupIndex } from '../types/startup.ts';

const CATEGORY_LABELS: Record<FailureCategory, string> = {
  'platform-absorbed': 'Platform Absorbed',
  'no-moat': 'No Moat',
  'funding': 'Funding',
  'pricing': 'Pricing',
  'market': 'Market',
  'competition': 'Competition',
  'technical': 'Technical',
  'regulatory': 'Regulatory',
  'acqui-hired': 'Acqui-hired',
  'other': 'Other',
};

export function renderStats(startups: StartupIndex[]): HTMLElement {
  const stats = document.createElement('div');
  stats.className = 'stats-bar';

  const counts = new Map<FailureCategory, number>();
  for (const s of startups) {
    counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
  }

  const totalEl = document.createElement('span');
  totalEl.className = 'stats-total';
  totalEl.textContent = `${startups.length} total`;
  stats.appendChild(totalEl);

  const pills = document.createElement('div');
  pills.className = 'stats-pills';

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sorted) {
    const pill = document.createElement('span');
    pill.className = `stats-pill cat-${cat}`;
    pill.textContent = `${CATEGORY_LABELS[cat]} ${count}`;
    pills.appendChild(pill);
  }

  stats.appendChild(pills);
  return stats;
}
