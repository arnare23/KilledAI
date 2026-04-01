import type { StartupIndex } from '../types/startup.ts';
import { formatDate, formatFunding } from '../lib/format.ts';

export function renderCard(
  startup: StartupIndex,
  onClick: () => void,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'startup-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-name">${startup.name}</h3>
      <span class="category-badge cat-${startup.category}">${startup.category}</span>
    </div>
    <p class="card-tagline">${startup.tagline}</p>
    <div class="card-meta">
      <span class="card-date">Shut down ${formatDate(startup.shutdown)}</span>
      <span class="card-funding">${formatFunding(startup.funding_raised)}</span>
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
