import { cn } from './cn';

describe('cn', () => {
  it('joins strings and conditional classes', () => {
    expect(cn('flex', false && 'hidden', { 'text-sm': true })).toBe(
      'flex text-sm'
    );
  });

  it('lets later Tailwind classes override earlier conflicting classes', () => {
    expect(cn('p-2 text-sm', 'p-4')).toBe('text-sm p-4');
  });
});
