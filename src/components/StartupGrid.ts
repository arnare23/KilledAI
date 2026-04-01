import type { StartupIndex } from '../types/startup.ts';
import { renderCard } from './StartupCard.ts';

export function renderGrid(
  startups: StartupIndex[],
  onCardClick: (slug: string) => void,
): HTMLElement {
  const grid = document.createElement('div');
  grid.className = 'startup-grid';

  if (startups.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p class="empty-title">No startups found</p>
      <p class="empty-subtitle">Try adjusting your search or filters</p>
    `;
    grid.appendChild(empty);
    return grid;
  }

  for (const startup of startups) {
    grid.appendChild(renderCard(startup, () => onCardClick(startup.slug)));
  }

  return grid;
}
