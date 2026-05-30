import { describe, expect, it } from 'vitest';
import { analyzeAnswers, clearDemoStateKeys, defaultDemoAnswers, getSeverity } from '../lib/analysis';

describe('RE路School analysis logic', () => {
  it('maps severity boundaries from raw scores', () => {
    expect(getSeverity(0)).toBe('하');
    expect(getSeverity(3)).toBe('하');
    expect(getSeverity(4)).toBe('중');
    expect(getSeverity(6)).toBe('중');
    expect(getSeverity(7)).toBe('상');
    expect(getSeverity(9)).toBe('상');
  });

  it('keeps raw scoring separate from calibrated display percentages', () => {
    const result = analyzeAnswers(defaultDemoAnswers);
    const factors = Object.fromEntries(result.factors.map((factor) => [factor.id, factor]));

    expect(factors.academic.rawScore).toBe(6);
    expect(factors.academic.rawPercent).toBe(67);
    expect(factors.academic.severity).toBe('중');
    expect(factors.academic.displayPercent).toBeGreaterThanOrEqual(63);
    expect(factors.academic.displayPercent).toBeLessThanOrEqual(67);

    expect(factors.career.rawScore).toBe(5);
    expect(factors.career.severity).toBe('중');
    expect(factors.emotion.rawScore).toBe(8);
    expect(factors.emotion.severity).toBe('상');
    expect(factors.relation.rawScore).toBe(4);
    expect(factors.relation.severity).toBe('중');
    expect(factors.economy.rawScore).toBe(2);
    expect(factors.economy.severity).toBe('하');
    expect(factors.support.rawScore).toBe(5);
    expect(factors.support.severity).toBe('중');

    expect(factors.career.displayPercent).toBeGreaterThanOrEqual(53);
    expect(factors.career.displayPercent).toBeLessThanOrEqual(57);
    expect(factors.emotion.displayPercent).toBeGreaterThanOrEqual(80);
    expect(factors.emotion.displayPercent).toBeLessThanOrEqual(84);
    expect(factors.relation.displayPercent).toBeGreaterThanOrEqual(46);
    expect(factors.relation.displayPercent).toBeLessThanOrEqual(50);
    expect(factors.economy.displayPercent).toBeGreaterThanOrEqual(23);
    expect(factors.economy.displayPercent).toBeLessThanOrEqual(27);
    expect(factors.support.displayPercent).toBeGreaterThanOrEqual(58);
    expect(factors.support.displayPercent).toBeLessThanOrEqual(62);

    expect(result.finalType).toContain('검정고시 준비형');
    expect(result.finalType).toContain('진로탐색 병행형');
    expect(result.overallSeverity).toBe('중간');
    expect(result.needsImmediateSupport).toBe(true);
    expect(result.aiSummary).toContain('상담');
  });

  it('can clear known localStorage keys', () => {
    const removed: string[] = [];
    const fakeStorage = { removeItem: (key: string) => removed.push(key) } as Storage;
    clearDemoStateKeys(fakeStorage);
    expect(removed).toEqual(['re-road-school-answers', 're-road-school-result', 're-road-school-region']);
  });
});
