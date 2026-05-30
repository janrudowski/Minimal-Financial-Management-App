export function formatDate(
  seconds: number,
  locale = navigator.language
): string {
  const date = new Date(seconds * 1000);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}
