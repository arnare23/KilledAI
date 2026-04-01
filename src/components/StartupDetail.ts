import { loadStartup } from '../lib/data.ts';
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

export async function showDetail(
  slug: string,
  onBack: () => void,
): Promise<HTMLElement> {
  const startup = await loadStartup(slug);

  const page = document.createElement('div');
  page.className = 'detail-page';

  const tagsHtml = startup.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join('');

  const sourcesHtml = startup.sources
    .map(
      (s) =>
        `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a> <span class="source-date">(${formatDate(s.date)})</span></li>`,
    )
    .join('');

  page.innerHTML = `
    <button class="back-btn">\u2190 Back to all stories</button>
    <div class="detail-category">${CATEGORY_LABELS[startup.category] ?? startup.category} &middot; <span class="confidence">${startup.confidence} confidence</span></div>
    <h1 class="detail-title">${startup.name}</h1>
    <p class="detail-tagline">${startup.tagline}</p>
    <p class="detail-description">${startup.description}</p>
    <div class="detail-story">${startup.story}</div>
    <div class="detail-meta">
      <div class="meta-item"><span class="meta-label">Founded</span><span class="meta-value">${formatDate(startup.founded)}</span></div>
      <div class="meta-item"><span class="meta-label">Shut down</span><span class="meta-value">${formatDate(startup.shutdown)}</span></div>
      <div class="meta-item"><span class="meta-label">Funding</span><span class="meta-value">${formatFunding(startup.funding_raised)}</span></div>
      ${startup.funding_stage ? `<div class="meta-item"><span class="meta-label">Stage</span><span class="meta-value">${startup.funding_stage}</span></div>` : ''}
      ${startup.employee_count ? `<div class="meta-item"><span class="meta-label">Employees</span><span class="meta-value">${startup.employee_count}</span></div>` : ''}
      ${startup.url ? `<div class="meta-item"><span class="meta-label">Website</span><span class="meta-value"><a href="${startup.url}" target="_blank" rel="noopener noreferrer">${startup.url}</a></span></div>` : ''}
    </div>
    ${tagsHtml ? `<div class="detail-tags">${tagsHtml}</div>` : ''}
    ${sourcesHtml ? `<div class="detail-sources"><h3>Sources</h3><ul>${sourcesHtml}</ul></div>` : ''}
  `;

  const backBtn = page.querySelector('.back-btn')!;
  backBtn.addEventListener('click', onBack);

  return page;
}
