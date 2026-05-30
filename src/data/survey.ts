export type FactorId = 'academic' | 'career' | 'emotion' | 'relation' | 'economy' | 'support';
export type Severity = '하' | '중' | '상';

export interface FactorMeta {
  id: FactorId;
  label: string;
  shortLabel: string;
  color: string;
  softColor: string;
  description: string;
}

export interface SurveyQuestion {
  id: number;
  factorId: FactorId;
  factorLabel: string;
  text: string;
}

export const factorMetas: FactorMeta[] = [
  { id: 'academic', label: '학업관련', shortLabel: '학업', color: '#3B6FF5', softColor: '#EAF1FF', description: '검정고시, 복학, 대안교육 등 학습 재시작 경로를 함께 정리합니다.' },
  { id: 'career', label: '진로관련', shortLabel: '진로', color: '#7C5CFF', softColor: '#EFEAFF', description: '관심 분야와 현실적인 진로 선택지를 이어보는 탐색이 필요합니다.' },
  { id: 'emotion', label: '심리/정서', shortLabel: '정서', color: '#FF5A6E', softColor: '#FFECEF', description: '회복과 상담 연결을 먼저 살피며 부담을 낮춘 계획이 필요합니다.' },
  { id: 'relation', label: '관계', shortLabel: '관계', color: '#8B95A1', softColor: '#F1F5F9', description: '가족, 또래, 학교 관계에서 받은 부담을 안전하게 정리합니다.' },
  { id: 'economy', label: '경제', shortLabel: '경제', color: '#3CCB7F', softColor: '#E8F8EF', description: '학습과 생계, 일 경험을 병행할 수 있는 현실적인 경로를 봅니다.' },
  { id: 'support', label: '지원 수요', shortLabel: '지원', color: '#FF9F43', softColor: '#FFF3E0', description: '가까운 기관과 상담자, 프로그램을 연결하는 도움이 필요합니다.' },
];

export const surveyQuestions: SurveyQuestion[] = [
  { id: 1, factorId: 'academic', factorLabel: '학업관련 요인', text: '최근 공부를 다시 시작하려고 해도 어디서부터 해야 할지 막막하다.' },
  { id: 2, factorId: 'academic', factorLabel: '학업관련 요인', text: '수업이나 학습 내용을 따라가기 어렵다고 느낀 적이 많다.' },
  { id: 3, factorId: 'academic', factorLabel: '학업관련 요인', text: '검정고시, 복학, 대안교육 중 어떤 학습경로가 맞는지 잘 모르겠다.' },
  { id: 4, factorId: 'career', factorLabel: '진로관련 요인', text: '앞으로 어떤 진로나 직업을 선택해야 할지 잘 모르겠다.' },
  { id: 5, factorId: 'career', factorLabel: '진로관련 요인', text: '내가 좋아하는 일과 현실적인 진로를 연결하기 어렵다.' },
  { id: 6, factorId: 'career', factorLabel: '진로관련 요인', text: '학교를 그만둔 이후의 계획이 아직 구체적이지 않다.' },
  { id: 7, factorId: 'emotion', factorLabel: '심리/정서 요인', text: '최근 무기력하거나 아무것도 시작하기 어렵다고 느낀다.' },
  { id: 8, factorId: 'emotion', factorLabel: '심리/정서 요인', text: '불안, 우울, 스트레스 때문에 학습이나 진로 준비가 어렵다.' },
  { id: 9, factorId: 'emotion', factorLabel: '심리/정서 요인', text: '혼자 감당하기 어렵다고 느끼는 날이 자주 있다.' },
  { id: 10, factorId: 'relation', factorLabel: '관계 요인', text: '학교생활에서 친구, 선생님, 가족과의 관계가 힘들었던 경험이 있다.' },
  { id: 11, factorId: 'relation', factorLabel: '관계 요인', text: '지금 내 상황을 편하게 이야기할 사람이 부족하다고 느낀다.' },
  { id: 12, factorId: 'relation', factorLabel: '관계 요인', text: '주변 사람들과의 갈등 때문에 학업이나 진로를 생각하기 어렵다.' },
  { id: 13, factorId: 'economy', factorLabel: '경제 요인', text: '경제적인 이유로 공부보다 일이나 생계를 먼저 생각해야 한다.' },
  { id: 14, factorId: 'economy', factorLabel: '경제 요인', text: '학습비, 교통비, 생활비 때문에 지원이 필요하다고 느낀다.' },
  { id: 15, factorId: 'economy', factorLabel: '경제 요인', text: '학업과 아르바이트 또는 일을 병행해야 할 가능성이 크다.' },
  { id: 16, factorId: 'support', factorLabel: '지원 수요 요인', text: '상담, 학습지원, 진로지원 중 어떤 도움을 받아야 할지 잘 모르겠다.' },
  { id: 17, factorId: 'support', factorLabel: '지원 수요 요인', text: '가까운 지원기관이나 프로그램 정보를 찾기 어렵다.' },
  { id: 18, factorId: 'support', factorLabel: '지원 수요 요인', text: '혼자 계획을 세우기보다 누군가와 함께 로드맵을 만들고 싶다.' },
];

export const scaleOptions = [
  { value: 0, label: '전혀 그렇지 않다', helper: '지금은 거의 해당하지 않아요' },
  { value: 1, label: '조금 그렇다', helper: '가끔 그렇게 느껴요' },
  { value: 2, label: '꽤 그렇다', helper: '자주 떠오르는 편이에요' },
  { value: 3, label: '매우 그렇다', helper: '지금 가장 크게 느껴져요' },
];
