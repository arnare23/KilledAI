import { loadIndex } from './lib/data.ts';
import { createSearchIndex, searchStartups } from './lib/search.ts';
import { applyFilters, defaultFilters, type FilterState } from './lib/filter.ts';
import { renderHeader } from './components/Header.ts';
import { renderSearchBar } from './components/SearchBar.ts';
import { renderFilterBar } from './components/FilterBar.ts';
import { renderGrid } from './components/StartupGrid.ts';
import { renderStats } from './components/Stats.ts';
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
  app.appendChild(renderHeader(allStartups.length));
  app.appendChild(renderStats(allStartups));
  app.appendChild(
    renderSearchBar((query) => {
      currentQuery = query;
      rerenderGrid();
    }),
  );
  app.appendChild(
    renderFilterBar((filters) => {
      currentFilters = filters;
      rerenderGrid();
    }),
  );
  app.appendChild(
    renderGrid(filtered, (slug) => {
      showDetail(slug);
    }),
  );
}

function rerenderGrid(): void {
  const filtered = getFiltered();
  const existing = app.querySelector('.startup-grid');
  const newGrid = renderGrid(filtered, (slug) => {
    showDetail(slug);
  });
  if (existing) {
    existing.replaceWith(newGrid);
  } else {
    app.appendChild(newGrid);
  }
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
