export function formatNumber(value: number): string {
  return new Intl.NumberFormat('uk-UA').format(value);
}
