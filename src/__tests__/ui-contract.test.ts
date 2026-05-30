import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { supportCenters } from '../data/centers';

describe('UI contract safeguards', () => {
  const main = readFileSync('src/main.tsx', 'utf8');

  it('guards malformed stored survey answers and complete-only submit', () => {
    expect(main).toContain('function readStoredAnswers');
    expect(main).toContain('try {');
    expect(main).toContain('JSON.parse(stored)');
    expect(main).toContain('disabled={!allAnswered}');
    expect(main).toContain('모든 문항에 답한 뒤 분석을 시작할 수 있습니다');
    expect(main).toContain('지역을 먼저 선택해주세요');
    expect(main).toContain('localStorage.setItem(STORAGE_KEYS.region');
    expect(main).toContain('analyzeAnswers(numericAnswers, { region: selectedRegion })');
  });

  it('applies centers severity filtering and avoids calibrated score wording ambiguity', () => {
    expect(main).toContain('function centerMatchesSeverity');
    expect(main).toContain('const visible = typeFiltered.filter');
    expect(main).toContain('현재 필터와 정확히 맞는 대표 예시가 없습니다.');
    expect(main).toContain('시각화 지표 {factor.displayPercent}%');
    expect(main).toContain('원점수 {factor.rawScore}/9');
  });

  it('does not fall back to non-matching centers when severity and type filters have no exact match', () => {
    const mainSource = readFileSync('src/main.tsx', 'utf8');
    const match = mainSource.match(/if \(severity === '중'\) return center\.services\.some\(\(service\) => service\.includes\('학습'\) \|\| service\.includes\('진로'\) \|\| service\.includes\('검정고시'\)\);/);
    expect(match).toBeTruthy();
    const jeonbukCrisis = supportCenters.filter((center) => center.regionKey === '전북' && center.services.join('').includes('위기'));
    expect(jeonbukCrisis.length).toBeGreaterThan(0);
    expect(jeonbukCrisis.some((center) => center.services.some((service) => service.includes('학습') || service.includes('진로') || service.includes('검정고시')))).toBe(false);
  });


  it('roadmap shows only the survey-selected path as a staircase', () => {
    const mainSource = readFileSync('src/main.tsx', 'utf8');
    const roadmapSource = readFileSync('src/lib/roadmap.ts', 'utf8');
    const roadmapSources = `${mainSource}
${roadmapSource}`;
    expect(roadmapSources).not.toContain('대학, 직업훈련, 취업, 복학 중 선택');
    expect(mainSource).toContain('roadmap-staircase');
    expect(mainSource).toContain('roadmap.staircaseSteps.map');
    expect(mainSource).toContain('roadmap.selectedPath.title');
    expect(mainSource).not.toContain('roadmap.paths.map');
    expect(roadmapSource).toContain('selectedPath: top');
    expect(roadmapSource).toContain('staircaseSteps: previewWeeksByPath[top.id].map');
  });

});
