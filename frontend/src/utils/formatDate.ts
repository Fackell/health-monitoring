export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
