import { factorMetas, FactorId, Severity, surveyQuestions } from '../data/survey';

export interface FactorResult {
  id: FactorId;
  label: string;
  rawScore: number;
  rawPercent: number;
  displayPercent: number;
  severity: Severity;
  color: string;
  description: string;
}

export interface AnalysisResult {
  userAlias: string;
  region: string;
  finalType: string;
  overallSeverity: '낮음' | '중간' | '높음';
  factors: FactorResult[];
  topFactors: FactorResult[];
  needsImmediateSupport: boolean;
  aiSummary: string;
  generatedAt: string;
}

export const STORAGE_KEYS = {
  answers: 're-road-school-answers',
  result: 're-road-school-result',
  region: 're-road-school-region',
} as const;

export const defaultDemoAnswers = [2, 2, 2, 2, 2, 1, 3, 3, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1];

const defaultDisplayPercent: Record<FactorId, number> = {
  academic: 65,
  career: 55,
  emotion: 82,
  relation: 48,
  economy: 25,
  support: 60,
};

export function getSeverity(score: number): Severity {
  if (score >= 7) return '상';
  if (score >= 4) return '중';
  return '하';
}

export function severityTone(severity: Severity) {
  if (severity === '상') return { label: '전문가 상담 필요', color: '#FF5A6E', bg: '#FFECEF' };
  if (severity === '중') return { label: '상담자와 계획 권장', color: '#FF9F43', bg: '#FFF3E0' };
  return { label: '스스로 점검 가능', color: '#3CCB7F', bg: '#E8F8EF' };
}

function factorDescription(id: FactorId, severity: Severity): string {
  const descriptions: Record<FactorId, Record<Severity, string>> = {
    academic: {
      하: '현재 학업 요인은 큰 부담으로 보이지 않으며, 간단한 체크리스트부터 시작해볼 수 있습니다.',
      중: '검정고시 또는 학습 재시작에 대한 구체적인 계획이 필요합니다.',
      상: '혼자 학습계획을 세우기보다 학습지원 기관과 함께 시작점을 정하는 것이 좋습니다.',
    },
    career: {
      하: '진로 방향은 기본 정보와 관심 분야 정리만으로도 다음 단계를 잡을 수 있습니다.',
      중: '진로 방향을 정하기 위한 탐색과 상담이 도움이 됩니다.',
      상: '진로 불확실성이 큰 상태이므로 직업흥미검사와 상담을 우선 연결하는 것이 좋습니다.',
    },
    emotion: {
      하: '현재 정서 부담은 스스로 점검하면서 생활 루틴을 유지할 수 있는 수준입니다.',
      중: '부담이 이어질 수 있어 상담자와 함께 회복 루틴을 만드는 것이 도움이 됩니다.',
      상: '혼자 해결하기보다 전문가 상담을 우선 연결하는 것이 좋습니다.',
    },
    relation: {
      하: '관계 요인은 주요 부담으로 보이지 않으며 편하게 이야기할 사람을 한 명 정해보면 좋습니다.',
      중: '학교·가족·또래 관계에서 받은 부담을 정리할 시간이 필요합니다.',
      상: '관계 갈등이 학업과 진로 선택에 영향을 줄 수 있어 상담 연결을 먼저 권장합니다.',
    },
    economy: {
      하: '현재 경제 요인은 주요 부담요인으로 보이지 않습니다.',
      중: '학습과 일정을 병행할 수 있도록 교통비·학습비·시간표 지원 정보를 확인해보세요.',
      상: '생계와 학업을 함께 고려한 자립지원, 직업훈련, 시간제 학습계획이 필요합니다.',
    },
    support: {
      하: '필요한 정보는 기본 안내와 체크리스트로도 정리할 수 있습니다.',
      중: '가까운 지원기관과 상담자 연결이 필요합니다.',
      상: '혼자 찾기 어려운 지원을 기관과 함께 연결해 단계별 계획을 만드는 것이 좋습니다.',
    },
  };
  return descriptions[id][severity];
}

export function analyzeAnswers(answers: number[], options?: { region?: string; generatedAt?: string }): AnalysisResult {
  const safeAnswers = surveyQuestions.map((_, index) => Math.max(0, Math.min(3, Number(answers[index] ?? 0))));
  const isDefault = JSON.stringify(safeAnswers) === JSON.stringify(defaultDemoAnswers);

  const factors = factorMetas.map((meta) => {
    const rawScore = surveyQuestions.reduce((sum, question, index) => question.factorId === meta.id ? sum + safeAnswers[index] : sum, 0);
    const rawPercent = Math.round((rawScore / 9) * 100);
    const severity = getSeverity(rawScore);
    const displayPercent = isDefault ? defaultDisplayPercent[meta.id] : rawPercent;
    return {
      id: meta.id,
      label: meta.label,
      rawScore,
      rawPercent,
      displayPercent,
      severity,
      color: meta.color,
      description: factorDescription(meta.id, severity),
    } satisfies FactorResult;
  });

  const topFactors = [...factors].sort((a, b) => b.rawScore - a.rawScore).slice(0, 2);
  const factorMap = Object.fromEntries(factors.map((factor) => [factor.id, factor])) as Record<FactorId, FactorResult>;
  const needsImmediateSupport = factorMap.emotion.severity === '상' || factors.some((factor) => factor.severity === '상');

  const typeParts: string[] = [];
  if (factorMap.academic.rawScore >= 4 && factorMap.support.rawScore >= 4) typeParts.push('검정고시 준비형');
  if (factorMap.career.rawScore >= 4 && (factorMap.academic.rawScore >= 4 || factorMap.support.rawScore >= 4)) typeParts.push('진로탐색 병행형');
  if (factorMap.emotion.rawScore >= 7 && typeParts.length === 0) typeParts.push('심리회복 우선형');
  if (topFactors.some((factor) => factor.id === 'relation') && typeParts.length < 2) typeParts.push('관계회복 지원형');
  if (factorMap.economy.rawScore >= 7 && (factorMap.academic.rawScore >= 4 || factorMap.career.rawScore >= 4)) typeParts.push('생계·직업 병행형');
  if (factorMap.support.rawScore >= 7 && typeParts.length < 2) typeParts.push('지원연결 필요형');
  if (typeParts.length === 0) typeParts.push('지원연결 필요형');

  const hasHigh = factors.some((factor) => factor.severity === '상');
  const mediumCount = factors.filter((factor) => factor.severity === '중').length;
  const overallSeverity: AnalysisResult['overallSeverity'] = hasHigh && mediumCount >= 2 ? '중간' : hasHigh ? '높음' : mediumCount >= 2 ? '중간' : '낮음';

  const finalType = typeParts.slice(0, 2).join(' + ');
  const aiSummary = needsImmediateSupport
    ? '현재 사용자는 학력 취득과 진로탐색을 준비할 수 있지만, 심리·정서 부담이 크게 나타났습니다. 바로 학습량을 늘리기보다 상담 연결과 짧은 회복 루틴을 먼저 두고, 이후 검정고시 학습지원과 진로상담으로 확장하는 경로를 권장합니다.'
    : '현재 응답은 학업·진로 계획을 차분히 정리하면 다음 단계를 만들 수 있는 상태로 보입니다. 가까운 상담자와 함께 체크리스트를 확인해보세요.';

  return {
    userAlias: '김리로드',
    region: options?.region ?? '전북 전주시',
    finalType,
    overallSeverity,
    factors,
    topFactors,
    needsImmediateSupport,
    aiSummary,
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
  };
}

export function loadResult(): AnalysisResult {
  if (typeof localStorage === 'undefined') return analyzeAnswers(defaultDemoAnswers);
  const stored = localStorage.getItem(STORAGE_KEYS.result);
  if (!stored) return analyzeAnswers(defaultDemoAnswers);
  try {
    return JSON.parse(stored) as AnalysisResult;
  } catch {
    return analyzeAnswers(defaultDemoAnswers);
  }
}

export function clearDemoStateKeys(storage: Pick<Storage, 'removeItem'> = localStorage) {
  storage.removeItem(STORAGE_KEYS.answers);
  storage.removeItem(STORAGE_KEYS.result);
  storage.removeItem(STORAGE_KEYS.region);
}
