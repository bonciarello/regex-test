/**
 * Attempt to compile a regex. Returns { valid, regex, error }.
 */
export function compileRegex(pattern, flags) {
  if (!pattern || pattern.trim() === '') {
    return { valid: false, regex: null, error: null };
  }
  try {
    const regex = new RegExp(pattern, flags);
    return { valid: true, regex, error: null };
  } catch (e) {
    return { valid: false, regex: null, error: e.message };
  }
}

/**
 * Find all matches of a compiled regex against a string.
 * Returns an array of match detail objects.
 */
export function findAllMatches(regex, text) {
  if (!regex || !text) return [];

  const matches = [];
  // Reset lastIndex for global/sticky regex
  regex.lastIndex = 0;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const groups = [];
    if (match.groups) {
      for (const [name, value] of Object.entries(match.groups)) {
        groups.push({ name, value });
      }
    }
    // Also capture numbered groups (skip index 0 which is the full match)
    for (let i = 1; i < match.length; i++) {
      groups.push({ name: `$${i}`, value: match[i] });
    }
    matches.push({
      fullMatch: match[0],
      index: match.index,
      length: match[0].length,
      groups,
    });

    // Prevent infinite loops for zero-length matches
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
    // Break if not global (avoid infinite loop)
    if (!regex.global && !regex.sticky) break;
  }

  return matches;
}

/**
 * Build an array of segments for highlighted rendering.
 * Each segment is { text, isMatch, matchIndex? }.
 */
export function buildHighlightedSegments(text, matches) {
  if (!matches.length) {
    return [{ text, isMatch: false }];
  }

  // Sort matches by index
  const sorted = [...matches].sort((a, b) => a.index - b.index);

  const segments = [];
  let cursor = 0;

  for (const match of sorted) {
    // Non-match text before this match
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), isMatch: false });
    }
    // The match itself
    segments.push({
      text: match.fullMatch,
      isMatch: true,
      matchIndex: match.index,
    });
    cursor = match.index + match.length;
  }

  // Remaining text after last match
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }

  return segments;
}

/**
 * Validate regex syntax and return a user-friendly error message.
 */
export function getRegexError(pattern, flags) {
  try {
    new RegExp(pattern, flags);
    return null;
  } catch (e) {
    // Clean up the error message for display
    return e.message.replace('Invalid regular expression: ', '');
  }
}
