export function formatDate(seconds) {
  const date = new Date(seconds * 1000);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat(navigator.language, options).format(date);
}
