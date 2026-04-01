import type { StartupIndex } from '../types/startup.ts';
import type { FailureCategory } from '../types/startup.ts';

const CATEGORY_LABELS: Record<FailureCategory, string> = {
  'platform-absorbed': 'Platform Absorbed',
  'no-moat': 'No Moat',
  funding: 'Funding',
  pricing: 'Pricing',
  market: 'Market',
  competition: 'Competition',
  technical: 'Technical',
  regulatory: 'Regulatory',
  'acqui-hired': 'Acqui-hired',
  other: 'Other',
};

export function renderNav(onSearch: (query: string) => void): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'top-nav';

  nav.innerHTML = `
    <span class="nav-logo">KilledAI</span>
    <div class="nav-search">
      <input type="text" class="nav-search-input" placeholder="Search stories..." aria-label="Search startups" />
    </div>
  `;

  const input = nav.querySelector('.nav-search-input') as HTMLInputElement;
  let timer: ReturnType<typeof setTimeout>;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onSearch(input.value), 300);
  });

  return nav;
}

export function renderHero(startups: StartupIndex[]): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero';

  // Count top categories
  const counts = new Map<FailureCategory, number>();
  for (const s of startups) {
    counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
  }
  const topCategory = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  section.innerHTML = `
    <h1 class="hero-title">The AI Startup<br>Graveyard</h1>
    <p class="hero-description">Documenting every AI startup that didn't make it. The stories, the patterns, and the lessons behind each failure.</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="hero-stat-value">${startups.length}</span>
        <span class="hero-stat-label">Startups Documented</span>
      </div>
      ${
        topCategory
          ? `<div class="hero-stat">
              <span class="hero-stat-value">${CATEGORY_LABELS[topCategory[0]]}</span>
              <span class="hero-stat-label">Top Cause of Failure</span>
            </div>`
          : ''
      }
      <div class="hero-stat">
        <span class="hero-stat-value">${counts.size}</span>
        <span class="hero-stat-label">Failure Categories</span>
      </div>
    </div>
  `;

  return section;
}
