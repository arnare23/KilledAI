const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(partial: string): string {
  if (!partial) return 'Unknown';
  const parts = partial.split('-');
  const year = parts[0];
  if (parts.length === 1) return year;
  const month = MONTHS[parseInt(parts[1], 10) - 1] ?? parts[1];
  if (parts.length === 2) return `${month} ${year}`;
  const day = parseInt(parts[2], 10);
  return `${month} ${day}, ${year}`;
}

export function formatFunding(amount: string): string {
  return amount || 'Unknown';
}
