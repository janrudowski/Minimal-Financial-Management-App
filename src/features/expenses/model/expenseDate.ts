import { formatDate } from '../../../shared/utils/date';
import type { FirestoreTimestampLike } from '../types';

export function toExpenseDate(timestamp: FirestoreTimestampLike): Date {
  if (timestamp.toDate) {
    return timestamp.toDate();
  }

  return new Date(timestamp.seconds * 1000);
}

export function formatExpenseDisplayDate(
  timestamp: FirestoreTimestampLike,
  locale?: string
): string {
  return formatDate(toExpenseDate(timestamp), locale);
}

export function formatExpenseInputDate(
  timestamp: FirestoreTimestampLike
): string {
  return toExpenseDate(timestamp).toISOString().slice(0, 10);
}
