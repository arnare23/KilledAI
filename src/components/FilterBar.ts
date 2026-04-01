import type { FailureCategory } from '../types/startup.ts';
import { defaultFilters, type FilterState } from '../lib/filter.ts';

const CATEGORIES: { value: FailureCategory; label: string }[] = [
  { value: 'platform-absorbed', label: 'Platform Absorbed' },
  { value: 'no-moat', label: 'No Moat' },
  { value: 'funding', label: 'Funding' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'market', label: 'Market' },
  { value: 'competition', label: 'Competition' },
  { value: 'technical', label: 'Technical' },
  { value: 'regulatory', label: 'Regulatory' },
  { value: 'acqui-hired', label: 'Acqui-hired' },
  { value: 'other', label: 'Other' },
];

export function renderFilterBar(
  onFilter: (filters: FilterState) => void,
): HTMLElement {
  const state = defaultFilters();

  const container = document.createElement('div');
  container.className = 'filter-bar';

  // Category chips
  const chipsRow = document.createElement('div');
  chipsRow.className = 'filter-chips';

  for (const cat of CATEGORIES) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filter-chip';
    chip.textContent = cat.label;
    chip.setAttribute('aria-pressed', 'false');

    chip.addEventListener('click', () => {
      const idx = state.categories.indexOf(cat.value);
      if (idx >= 0) {
        state.categories.splice(idx, 1);
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      } else {
        state.categories.push(cat.value);
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
      }
      onFilter({ ...state });
    });

    chipsRow.appendChild(chip);
  }

  // Controls row
  const controls = document.createElement('div');
  controls.className = 'filter-controls';

  // Date: after
  const afterLabel = document.createElement('label');
  afterLabel.className = 'filter-label';
  afterLabel.textContent = 'Shut down after';
  const afterInput = document.createElement('input');
  afterInput.type = 'month';
  afterInput.className = 'filter-date';
  afterInput.setAttribute('aria-label', 'Shut down after');
  afterInput.addEventListener('change', () => {
    state.shutdownAfter = afterInput.value;
    onFilter({ ...state });
  });
  afterLabel.appendChild(afterInput);

  // Date: before
  const beforeLabel = document.createElement('label');
  beforeLabel.className = 'filter-label';
  beforeLabel.textContent = 'Shut down before';
  const beforeInput = document.createElement('input');
  beforeInput.type = 'month';
  beforeInput.className = 'filter-date';
  beforeInput.setAttribute('aria-label', 'Shut down before');
  beforeInput.addEventListener('change', () => {
    state.shutdownBefore = beforeInput.value;
    onFilter({ ...state });
  });
  beforeLabel.appendChild(beforeInput);

  // Sort dropdown
  const sortLabel = document.createElement('label');
  sortLabel.className = 'filter-label';
  sortLabel.textContent = 'Sort by';
  const sortSelect = document.createElement('select');
  sortSelect.className = 'filter-sort';
  sortSelect.setAttribute('aria-label', 'Sort order');
  sortSelect.innerHTML = `
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="funded">Most Funded</option>
  `;
  sortSelect.addEventListener('change', () => {
    state.sortBy = sortSelect.value as FilterState['sortBy'];
    onFilter({ ...state });
  });
  sortLabel.appendChild(sortSelect);

  controls.appendChild(afterLabel);
  controls.appendChild(beforeLabel);
  controls.appendChild(sortLabel);

  container.appendChild(chipsRow);
  container.appendChild(controls);
  return container;
}
