import { describe, it, expect } from 'vitest';
import { compileRegex, findAllMatches, buildHighlightedSegments, getRegexError } from '../utils/regexUtils';

describe('compileRegex', () => {
  it('returns valid for a correct pattern', () => {
    const result = compileRegex('[a-z]+', 'gi');
    expect(result.valid).toBe(true);
    expect(result.regex).toBeInstanceOf(RegExp);
    expect(result.error).toBeNull();
  });

  it('returns invalid for a bad pattern', () => {
    const result = compileRegex('[a-z', 'g');
    expect(result.valid).toBe(false);
    expect(result.regex).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('returns valid false for empty string', () => {
    const result = compileRegex('', 'g');
    expect(result.valid).toBe(false);
    expect(result.regex).toBeNull();
    expect(result.error).toBeNull();
  });

  it('returns valid false for whitespace only', () => {
    const result = compileRegex('   ', 'g');
    expect(result.valid).toBe(false);
  });

  it('applies flags correctly', () => {
    const result = compileRegex('[A-Z]+', 'gi');
    expect(result.regex.flags).toBe('gi');
    expect(result.regex.test('abc')).toBe(true);
  });

  it('works with no flags', () => {
    const result = compileRegex('hello', '');
    expect(result.valid).toBe(true);
    expect(result.regex.flags).toBe('');
  });

  it('handles unicode flag', () => {
    const result = compileRegex('\\p{L}+', 'u');
    expect(result.valid).toBe(true);
  });
});

describe('findAllMatches', () => {
  it('finds all global matches', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, 'a 123 b 456 c 789');
    expect(matches).toHaveLength(3);
    expect(matches[0].fullMatch).toBe('123');
    expect(matches[0].index).toBe(2);
    expect(matches[1].fullMatch).toBe('456');
    expect(matches[1].index).toBe(8);
    expect(matches[2].fullMatch).toBe('789');
    expect(matches[2].index).toBe(14);
  });

  it('returns empty array for no matches', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, 'no numbers here');
    expect(matches).toHaveLength(0);
  });

  it('returns empty array for null regex', () => {
    const matches = findAllMatches(null, 'test');
    expect(matches).toHaveLength(0);
  });

  it('returns empty array for empty text', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, '');
    expect(matches).toHaveLength(0);
  });

  it('captures groups', () => {
    const { regex } = compileRegex('(\\w+)@(\\w+)', 'g');
    const matches = findAllMatches(regex, 'a@b c@d');
    expect(matches).toHaveLength(2);
    expect(matches[0].groups).toHaveLength(2);
    expect(matches[0].groups[0].name).toBe('$1');
    expect(matches[0].groups[0].value).toBe('a');
    expect(matches[0].groups[1].name).toBe('$2');
    expect(matches[0].groups[1].value).toBe('b');
  });

  it('handles zero-length matches', () => {
    const { regex } = compileRegex('(?=x)', 'g');
    const matches = findAllMatches(regex, 'x');
    // Should not go into infinite loop
    expect(matches.length).toBeGreaterThanOrEqual(0);
  });

  it('only returns first match for non-global regex', () => {
    const { regex } = compileRegex('\\d+', '');
    const matches = findAllMatches(regex, '123 456 789');
    expect(matches).toHaveLength(1);
    expect(matches[0].fullMatch).toBe('123');
  });
});

describe('buildHighlightedSegments', () => {
  it('returns single segment for no matches', () => {
    const segments = buildHighlightedSegments('hello world', []);
    expect(segments).toHaveLength(1);
    expect(segments[0].text).toBe('hello world');
    expect(segments[0].isMatch).toBe(false);
  });

  it('splits text around matches', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, 'a 123 b');
    const segments = buildHighlightedSegments('a 123 b', matches);
    expect(segments).toHaveLength(3);
    expect(segments[0].text).toBe('a ');
    expect(segments[0].isMatch).toBe(false);
    expect(segments[1].text).toBe('123');
    expect(segments[1].isMatch).toBe(true);
    expect(segments[2].text).toBe(' b');
    expect(segments[2].isMatch).toBe(false);
  });

  it('handles match at start of text', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, '123 abc');
    const segments = buildHighlightedSegments('123 abc', matches);
    expect(segments[0].text).toBe('123');
    expect(segments[0].isMatch).toBe(true);
    expect(segments[1].text).toBe(' abc');
    expect(segments[1].isMatch).toBe(false);
  });

  it('handles match at end of text', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, 'abc 123');
    const segments = buildHighlightedSegments('abc 123', matches);
    expect(segments[segments.length - 1].text).toBe('123');
    expect(segments[segments.length - 1].isMatch).toBe(true);
  });

  it('handles multiple consecutive matches', () => {
    const { regex } = compileRegex('\\d+', 'g');
    const matches = findAllMatches(regex, '123 456');
    const segments = buildHighlightedSegments('123 456', matches);
    const matchSegments = segments.filter((s) => s.isMatch);
    expect(matchSegments).toHaveLength(2);
  });
});

describe('getRegexError', () => {
  it('returns null for valid regex', () => {
    expect(getRegexError('[a-z]+', 'g')).toBeNull();
  });

  it('returns error message for invalid regex', () => {
    const error = getRegexError('[a-z', 'g');
    expect(error).toBeTruthy();
    expect(typeof error).toBe('string');
  });

  it('returns error for invalid flag', () => {
    const error = getRegexError('[a-z]', 'z');
    expect(error).toBeTruthy();
  });
});
