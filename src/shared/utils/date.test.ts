import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('formats Firestore seconds with an explicit locale', () => {
    const seconds = Math.floor(
      new Date('2022-08-01T12:00:00.000Z').getTime() / 1000
    );

    expect(formatDate(seconds, 'en-US')).toBe('Aug 1, 2022');
  });
});
