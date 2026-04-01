import type { StartupIndex } from '../types/startup.ts';
import { formatDate, formatFunding } from '../lib/format.ts';

const CATEGORY_LABELS: Record<string, string> = {
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

export function renderCard(
  startup: StartupIndex,
  onClick: () => void,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'startup-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  card.innerHTML = `
    <span class="card-category">${CATEGORY_LABELS[startup.category] ?? startup.category}</span>
    <h3 class="card-name">${startup.name}</h3>
    <p class="card-tagline">${startup.tagline}</p>
    <div class="card-footer">
      <span class="card-meta">Shut down ${formatDate(startup.shutdown)} &middot; ${formatFunding(startup.funding_raised)}</span>
      <span class="card-arrow">\u2192</span>
    </div>
  `;

  card.addEventListener('click', onClick);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  });

  return card;
}
