export function formatDate(
  value: number | Date,
  locale = navigator.language
): string {
  const date = value instanceof Date ? value : new Date(value * 1000);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}
