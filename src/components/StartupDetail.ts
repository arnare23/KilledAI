import { loadStartup } from '../lib/data.ts';
import { formatDate, formatFunding } from '../lib/format.ts';

let overlay: HTMLElement | null = null;

export function hideDetail(): void {
  if (overlay) {
    overlay.remove();
    overlay = null;
    document.body.style.overflow = '';
  }
}

function renderConfidence(level: string): string {
  const map: Record<string, string> = {
    high: 'confidence-high',
    medium: 'confidence-medium',
    low: 'confidence-low',
  };
  return `<span class="confidence ${map[level] ?? ''}">${level} confidence</span>`;
}

export async function showDetail(slug: string): Promise<void> {
  hideDetail();

  const startup = await loadStartup(slug);

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', startup.name);

  const modal = document.createElement('div');
  modal.className = 'modal-content';

  const tagsHtml = startup.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join('');

  const sourcesHtml = startup.sources
    .map(
      (s) =>
        `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a> <span class="source-date">(${formatDate(s.date)})</span></li>`,
    )
    .join('');

  modal.innerHTML = `
    <button class="modal-close" aria-label="Close">&times;</button>
    <div class="modal-header">
      <h2 class="modal-title">${startup.name}</h2>
      <span class="category-badge cat-${startup.category}">${startup.category}</span>
      ${renderConfidence(startup.confidence)}
    </div>
    <p class="modal-tagline">${startup.tagline}</p>
    <p class="modal-description">${startup.description}</p>
    <div class="modal-story">${startup.story}</div>
    <div class="modal-meta">
      <div class="meta-item"><span class="meta-label">Founded</span><span class="meta-value">${formatDate(startup.founded)}</span></div>
      <div class="meta-item"><span class="meta-label">Shut down</span><span class="meta-value">${formatDate(startup.shutdown)}</span></div>
      <div class="meta-item"><span class="meta-label">Funding</span><span class="meta-value">${formatFunding(startup.funding_raised)}</span></div>
      ${startup.funding_stage ? `<div class="meta-item"><span class="meta-label">Stage</span><span class="meta-value">${startup.funding_stage}</span></div>` : ''}
      ${startup.employee_count ? `<div class="meta-item"><span class="meta-label">Employees</span><span class="meta-value">${startup.employee_count}</span></div>` : ''}
      ${startup.url ? `<div class="meta-item"><span class="meta-label">Website</span><span class="meta-value"><a href="${startup.url}" target="_blank" rel="noopener noreferrer">${startup.url}</a></span></div>` : ''}
    </div>
    ${tagsHtml ? `<div class="modal-tags">${tagsHtml}</div>` : ''}
    ${sourcesHtml ? `<div class="modal-sources"><h3>Sources</h3><ul>${sourcesHtml}</ul></div>` : ''}
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const closeBtn = modal.querySelector('.modal-close')!;
  closeBtn.addEventListener('click', hideDetail);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideDetail();
  });

  document.addEventListener(
    'keydown',
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        hideDetail();
        document.removeEventListener('keydown', handler);
      }
    },
  );
}
