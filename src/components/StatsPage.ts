import type { FailureCategory, StartupIndex } from '../types/startup.ts';

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

function parseFunding(amount: string): number {
  const clean = amount.replace(/[^0-9.BMKbmk]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  if (clean.toUpperCase().includes('B')) return num * 1_000_000_000;
  if (clean.toUpperCase().includes('M')) return num * 1_000_000;
  if (clean.toUpperCase().includes('K')) return num * 1_000;
  return num;
}

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatLifetime(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  if (years > 0 && remainingMonths > 0) {
    return `${years} yr${years !== 1 ? 's' : ''}, ${remainingMonths} mo`;
  }
  if (years > 0) return `${years} yr${years !== 1 ? 's' : ''}`;
  return `${remainingMonths} mo`;
}

function parseFoundedYear(founded: string): number | null {
  const match = founded.match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

export function renderStatsPage(
  startups: StartupIndex[],
  onBack: () => void,
): HTMLElement {
  const page = document.createElement('div');
  page.className = 'stats-page';

  // Compute metrics
  const lifetimes = startups
    .map((s) => (s as StartupIndex & { lifetime_months?: number | null }).lifetime_months)
    .filter((v): v is number => v != null && v > 0);

  const avgLifetime = lifetimes.length > 0
    ? lifetimes.reduce((a, b) => a + b, 0) / lifetimes.length
    : 0;

  const sortedLifetimes = [...lifetimes].sort((a, b) => a - b);
  const medianLifetime = sortedLifetimes.length > 0
    ? sortedLifetimes.length % 2 === 1
      ? sortedLifetimes[Math.floor(sortedLifetimes.length / 2)]
      : (sortedLifetimes[sortedLifetimes.length / 2 - 1] + sortedLifetimes[sortedLifetimes.length / 2]) / 2
    : 0;

  const totalFunding = startups.reduce((sum, s) => sum + parseFunding(s.funding_raised), 0);

  // Category breakdown
  const categoryCounts = new Map<FailureCategory, number>();
  for (const s of startups) {
    categoryCounts.set(s.category, (categoryCounts.get(s.category) ?? 0) + 1);
  }
  const sortedCategories = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]);

  // Average lifetime by founding year
  const yearData = new Map<number, number[]>();
  for (const s of startups) {
    const year = parseFoundedYear(s.founded);
    const lt = (s as StartupIndex & { lifetime_months?: number | null }).lifetime_months;
    if (year != null && lt != null && lt > 0) {
      if (!yearData.has(year)) yearData.set(year, []);
      yearData.get(year)!.push(lt);
    }
  }

  const yearAverages = [...yearData.entries()]
    .map(([year, vals]) => ({
      year,
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      count: vals.length,
    }))
    .sort((a, b) => a.year - b.year);

  const maxAvg = Math.max(...yearAverages.map((y) => y.avg), 1);

  // Build HTML
  const metricsHtml = `
    <div class="stats-metrics">
      <div class="stats-metric-card">
        <span class="stats-metric-value">${startups.length}</span>
        <span class="stats-metric-label">Startups Tracked</span>
      </div>
      <div class="stats-metric-card">
        <span class="stats-metric-value">${lifetimes.length > 0 ? formatLifetime(avgLifetime) : 'N/A'}</span>
        <span class="stats-metric-label">Average Lifetime</span>
      </div>
      <div class="stats-metric-card">
        <span class="stats-metric-value">${totalFunding > 0 ? formatLargeNumber(totalFunding) : 'N/A'}</span>
        <span class="stats-metric-label">Total Funding Lost</span>
      </div>
      <div class="stats-metric-card">
        <span class="stats-metric-value">${lifetimes.length > 0 ? formatLifetime(medianLifetime) : 'N/A'}</span>
        <span class="stats-metric-label">Median Lifetime</span>
      </div>
    </div>
  `;

  const barsHtml = yearAverages.length > 0
    ? yearAverages
        .map((y) => {
          const pct = (y.avg / maxAvg) * 100;
          const label = y.avg >= 12
            ? `${(y.avg / 12).toFixed(1)} yrs`
            : `${y.avg.toFixed(1)} mo`;
          return `
            <div class="stats-bar-row">
              <span class="stats-bar-label">${y.year}</span>
              <div class="stats-bar-track">
                <div class="stats-bar-fill" style="width: ${pct}%"></div>
              </div>
              <span class="stats-bar-value">${label}</span>
            </div>
          `;
        })
        .join('')
    : '<p class="stats-empty">No lifetime data available yet.</p>';

  const categoryRowsHtml = sortedCategories
    .map(
      ([cat, count]) => `
      <div class="stats-category-row">
        <span class="stats-category-name">${CATEGORY_LABELS[cat]}</span>
        <span class="stats-category-count">${count}</span>
      </div>
    `,
    )
    .join('');

  page.innerHTML = `
    <button class="back-btn">\u2190 All Stories</button>
    <h1 class="stats-title">Statistics</h1>
    ${metricsHtml}
    <section class="stats-section">
      <h2 class="stats-section-title">Average Lifetime by Founding Year</h2>
      <div class="stats-chart">
        ${barsHtml}
      </div>
    </section>
    <section class="stats-section">
      <h2 class="stats-section-title">Breakdown by Failure Category</h2>
      <div class="stats-categories">
        ${categoryRowsHtml}
      </div>
    </section>
  `;

  const backBtn = page.querySelector('.back-btn')!;
  backBtn.addEventListener('click', onBack);

  return page;
}
