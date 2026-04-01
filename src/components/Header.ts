export function renderHeader(count: number): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';

  header.innerHTML = `
    <div class="header-content">
      <h1 class="site-title">Killed<span class="accent">AI</span></h1>
      <p class="site-subtitle">Every AI startup that didn't make it</p>
      <span class="count-badge">${count} startups</span>
    </div>
  `;

  return header;
}
