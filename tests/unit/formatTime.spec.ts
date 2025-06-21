/**
 * UNIT TEST: VITEST - BLACKBOX TESTING
 * Tests the formatTime utility function as a black box without knowledge of internal implementation.
 * Verifies input/output behavior, edge cases, and error handling for time formatting.
 */

import { describe, it, expect } from 'vitest';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

describe('formatTime - Blackbox Testing', () => {
  it('should format 0 seconds correctly', () => {
    const result = formatTime(0);
    expect(result).toBe('0:00');
  });

  it('should format seconds less than 60', () => {
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(59)).toBe('0:59');
  });

  it('should format minutes and seconds correctly', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(3661)).toBe('61:01');
  });

  it('should handle invalid inputs', () => {
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(-10)).toBe('0:00');
    //@ts-ignore
    expect(formatTime(null)).toBe('0:00');
    //@ts-ignore
    expect(formatTime(undefined)).toBe('0:00');
  });

  it('should handle decimal numbers', () => {
    expect(formatTime(65.7)).toBe('1:05');
    expect(formatTime(59.9)).toBe('0:59');
  });

  it('should handle large numbers', () => {
    expect(formatTime(7260)).toBe('121:00');
    expect(formatTime(36000)).toBe('600:00');
  });
});
