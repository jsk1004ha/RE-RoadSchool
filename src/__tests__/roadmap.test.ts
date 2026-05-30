import { describe, expect, it } from 'vitest';
import { analyzeAnswers, defaultDemoAnswers } from '../lib/analysis';
import { buildRoadmapModel } from '../lib/roadmap';

describe('dynamic roadmap model', () => {
  it('prioritizes recovery when emotional factor is high', () => {
    const model = buildRoadmapModel(analyzeAnswers(defaultDemoAnswers));
    expect(model.headline).toContain('회복');
    expect(model.selectedPath.id).toBe('recovery');
    expect(model.selectedPath.priorityLabel).toBe('설문 결과 선정');
    expect(model.staircaseSteps).toHaveLength(4);
    expect(model.previewWeeks[0].title).toContain('회복');
  });

  it('prioritizes work-self-reliance when economy is the strongest high factor', () => {
    const economyHigh = [0, 0, 1, 2, 1, 1, 0, 0, 0, 1, 1, 0, 3, 3, 3, 1, 1, 1];
    const model = buildRoadmapModel(analyzeAnswers(economyHigh));
    expect(model.selectedPath.id).toBe('work');
    expect(model.headline).toContain('일경험');
    expect(model.previewWeeks[0].title).toContain('생활');
  });

  it('prioritizes alternative-school exploration when relationship burden is strongest', () => {
    const relationHigh = [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 0, 0, 0, 1, 1, 1];
    const model = buildRoadmapModel(analyzeAnswers(relationHigh));
    expect(model.selectedPath.id).toBe('alternative');
    expect(model.headline).toContain('관계');
    expect(model.previewWeeks[0].title).toContain('관계');
  });

  it('returns only the survey-selected path for the full roadmap view', () => {
    const model = buildRoadmapModel(analyzeAnswers(defaultDemoAnswers));
    expect(model.selectedPath.title).toBe('심리회복·상담 우선');
    expect(model).not.toHaveProperty('paths');
    expect(model.staircaseSteps.map((step) => step.step)).toEqual(['1단계', '2단계', '3단계', '4단계']);
  });
});
