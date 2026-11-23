import { describe, it, expect } from 'vitest';
import { findEmptyFields } from '../scripts/check-content.js';
import { content, REQUIRED_FIELDS } from '../src/content.js';

describe('findEmptyFields', () => {
  it('returns nothing for the real content', () => {
    expect(findEmptyFields(content, REQUIRED_FIELDS)).toEqual([]);
  });

  it('reports an empty field', () => {
    const c = { ...content, venue: { ...content.venue, mapsUrl: '' } };
    expect(findEmptyFields(c, REQUIRED_FIELDS)).toEqual(['venue.mapsUrl']);
  });

  it('treats a missing field as empty', () => {
    const { name, ...c } = content;
    expect(findEmptyFields(c, REQUIRED_FIELDS)).toEqual(['name']);
  });
});
