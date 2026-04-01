import { loadIndex } from './lib/data.ts';
import { createSearchIndex, searchStartups } from './lib/search.ts';
import { applyFilters, defaultFilters, type FilterState } from './lib/filter.ts';
import { renderNav, renderHero } from './components/Header.ts';
import { renderGrid } from './components/StartupGrid.ts';
import { showDetail } from './components/StartupDetail.ts';
import type { StartupIndex } from './types/startup.ts';

let allStartups: StartupIndex[] = [];
let currentQuery = '';
let currentFilters: FilterState = defaultFilters();

const app = document.getElementById('app')!;

function getFiltered(): StartupIndex[] {
  let list = allStartups;

  if (currentQuery.trim()) {
    const slugs = new Set(searchStartups(currentQuery));
    list = list.filter((s) => slugs.has(s.slug));
  }

  return applyFilters(list, currentFilters);
}

function renderAll(): void {
  const filtered = getFiltered();

  app.innerHTML = '';
  app.appendChild(
    renderNav((query) => {
      currentQuery = query;
      rerenderGrid();
    }),
  );
  app.appendChild(renderHero(allStartups));

  // Section heading
  const heading = document.createElement('div');
  heading.className = 'section-heading';
  heading.innerHTML = `
    <span class="section-title">All Stories</span>
    <span class="section-count">${filtered.length} ${filtered.length === 1 ? 'startup' : 'startups'}</span>
  `;
  app.appendChild(heading);

  app.appendChild(
    renderGrid(filtered, (slug) => {
      openDetail(slug);
    }),
  );
}

function rerenderGrid(): void {
  const filtered = getFiltered();

  // Update count
  const countEl = app.querySelector('.section-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'startup' : 'startups'}`;
  }

  const existing = app.querySelector('.startup-grid');
  const newGrid = renderGrid(filtered, (slug) => {
    openDetail(slug);
  });
  if (existing) {
    existing.replaceWith(newGrid);
  } else {
    app.appendChild(newGrid);
  }
}

async function openDetail(slug: string): Promise<void> {
  const page = await showDetail(slug, () => {
    renderAll();
    window.scrollTo(0, 0);
  });
  app.innerHTML = '';
  app.appendChild(page);
  window.scrollTo(0, 0);
}

async function init(): Promise<void> {
  try {
    allStartups = await loadIndex();
    createSearchIndex(allStartups);
    renderAll();
  } catch (err) {
    app.innerHTML = `
      <div class="empty-state" style="padding-top: 6rem;">
        <p class="empty-title">Failed to load data</p>
        <p class="empty-subtitle">Make sure the data files are available at /data/index.json</p>
      </div>
    `;
    console.error('Failed to load startup data:', err);
  }
}

init();
