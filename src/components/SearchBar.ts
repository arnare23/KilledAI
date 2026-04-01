export function renderSearchBar(
  onSearch: (query: string) => void,
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-bar';

  const icon = document.createElement('span');
  icon.className = 'search-icon';
  icon.textContent = '\u{1F50D}';
  icon.setAttribute('aria-hidden', 'true');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = 'Search dead startups...';
  input.setAttribute('aria-label', 'Search startups');

  let timer: ReturnType<typeof setTimeout>;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onSearch(input.value), 300);
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(input);
  return wrapper;
}
