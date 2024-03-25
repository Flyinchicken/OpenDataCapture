import { describe, expect, it, test } from 'vitest';
import { z } from 'zod';

import { BILINGUAL_FORM_INSTRUMENT, UNILINGUAL_FORM_INSTRUMENT } from '../__stubs__/form-instrument.stubs.js';
import {
  $$InstrumentUIOption,
  $BaseInstrument,
  $BaseInstrumentDetails,
  $EnhancedBaseInstrumentDetails,
  $InstrumentKind,
  $InstrumentLanguage
} from '../instrument.base.js';

test('$InstrumentKind', () => {
  expect($InstrumentKind.safeParse('FORM').success).toBe(true);
  expect($InstrumentKind.safeParse('INTERACTIVE').success).toBe(true);
  expect($InstrumentKind.safeParse('UNKNOWN').success).toBe(true);
});

test('$InstrumentLanguage', () => {
  expect($InstrumentLanguage.safeParse('en').success).toBe(true);
  expect($InstrumentLanguage.safeParse('fr').success).toBe(true);
  expect($InstrumentLanguage.safeParse([]).success).toBe(false);
  expect($InstrumentLanguage.safeParse(['en']).success).toBe(true);
  expect($InstrumentLanguage.safeParse(['fr']).success).toBe(true);
  expect($InstrumentLanguage.safeParse(['en', 'fr']).success).toBe(true);
  expect($InstrumentLanguage.safeParse(['en', 'fr', 'en']).success).toBe(false);
});

describe('$$InstrumentUIOption', () => {
  const num = -1;
  const obj = Object.freeze({ en: num, fr: num });

  it('should handle the language "en" successfully', () => {
    expect($$InstrumentUIOption(z.number(), 'en').parse(num)).toBe(num);
    expect(() => $$InstrumentUIOption(z.string(), 'en').parse(num)).toThrow();
    expect(() => $$InstrumentUIOption(z.number(), 'en').parse(obj)).toThrow();
  });

  it('should handle the language "fr" successfully', () => {
    expect($$InstrumentUIOption(z.number(), 'fr').parse(num)).toBe(num);
    expect(() => $$InstrumentUIOption(z.string(), 'fr').parse(num)).toThrow();
    expect(() => $$InstrumentUIOption(z.number(), 'fr').parse(obj)).toThrow();
  });

  it('should handle the language ["en", "fr"] successfully', () => {
    expect($$InstrumentUIOption(z.number(), ['en', 'fr']).parse(obj)).toEqual(obj);
    expect(() => $$InstrumentUIOption(z.string(), ['en', 'fr']).parse(obj)).toThrow();
    expect(() => $$InstrumentUIOption(z.number(), ['en', 'fr']).parse(num)).toThrow();
  });
  it('should handle the language ["en", "fr", "fr] successfully', () => {
    expect($$InstrumentUIOption(z.number(), ['en', 'fr', 'fr']).parse(obj)).toEqual(obj);
    expect(() => $$InstrumentUIOption(z.string(), ['en', 'fr', 'fr']).parse(obj)).toThrow();
    expect(() => $$InstrumentUIOption(z.number(), ['en', 'fr', 'fr']).parse(num)).toThrow();
  });
  it('should handle the language ["en"] successfully', () => {
    expect($$InstrumentUIOption(z.number(), ['en']).parse(obj)).toEqual({ en: num });
    expect(() => $$InstrumentUIOption(z.string(), ['en']).parse(obj)).toThrow();
    expect(() => $$InstrumentUIOption(z.number(), ['en']).parse(num)).toThrow();
  });
  it('should handle the language ["fr"] successfully', () => {
    expect($$InstrumentUIOption(z.number(), ['fr']).parse(obj)).toEqual({ fr: num });
    expect(() => $$InstrumentUIOption(z.string(), ['fr']).parse(obj)).toThrow();
    expect(() => $$InstrumentUIOption(z.number(), ['fr']).parse(num)).toThrow();
  });
});

describe('$BaseInstrumentDetails', () => {
  it('should handle unilingual details', () => {
    expect($BaseInstrumentDetails.safeParse(UNILINGUAL_FORM_INSTRUMENT.details).success).toBe(true);
  });
  it('should handle multilingual details', () => {
    expect($BaseInstrumentDetails.safeParse(BILINGUAL_FORM_INSTRUMENT.details).success).toBe(true);
  });
});

describe('$EnhancedBaseInstrumentDetails', () => {
  it('should handle unilingual details', () => {
    expect($EnhancedBaseInstrumentDetails.safeParse(UNILINGUAL_FORM_INSTRUMENT.details).success).toBe(true);
  });
  it('should handle multilingual details', () => {
    expect($EnhancedBaseInstrumentDetails.safeParse(BILINGUAL_FORM_INSTRUMENT.details).success).toBe(true);
  });
});

describe('$BaseInstrument', () => {
  it('should handle a unilingual form', () => {
    expect($BaseInstrument.safeParse(UNILINGUAL_FORM_INSTRUMENT).success).toBe(true);
  });
  it('should handle a multilingual form', () => {
    expect($BaseInstrument.safeParse(BILINGUAL_FORM_INSTRUMENT).success).toBe(true);
  });
});
