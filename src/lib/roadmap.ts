import type { AnalysisResult } from './analysis';
import type { FactorId } from '../data/survey';

export interface RoadmapPath {
  id: 'recovery' | 'exam' | 'alternative' | 'work' | 'portfolio' | 'career';
  factorId: FactorId | 'mixed';
  title: string;
  tone: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  icon: string;
  text: string;
  steps: string[];
  priorityLabel: string;
}

export interface RoadmapWeek {
  week: string;
  title: string;
  items: string[];
}

export interface RoadmapStep {
  step: string;
  title: string;
  description: string;
  actions: string[];
}

export interface RoadmapModel {
  headline: string;
  summary: string;
  centerLabel: string;
  centerDescription: string;
  selectedPath: RoadmapPath;
  previewWeeks: RoadmapWeek[];
  staircaseSteps: RoadmapStep[];
  checkpoints: string[];
  questions: string[];
}

const basePaths: RoadmapPath[] = [
  { id: 'recovery', factorId: 'emotion', title: '심리회복·상담 우선', tone: 'red', icon: '💬', text: '정서 부담이 클 때 학습량보다 회복 루틴과 상담 연결을 먼저 두는 경로', steps: ['1388 또는 지역 상담 연결', '1주 회복 루틴', '학습 재시작 시점 조율'], priorityLabel: '선택지' },
  { id: 'exam', factorId: 'academic', title: '검정고시 기반 학력회복', tone: 'blue', icon: '📘', text: '과목 진단 → 짧은 루틴 → 모의고사 → 시험 접수까지 학습 회복을 중심으로 잡는 경로', steps: ['기초 과목 확인', '취약 과목 2개 선정', '꿈드림 학습지원 연결'], priorityLabel: '선택지' },
  { id: 'alternative', factorId: 'relation', title: '대안교육·복교 탐색', tone: 'purple', icon: '🏫', text: '학교 관계의 부담을 정리하며 대안학교, 위탁교육, 복교 가능성을 비교해보는 경로', steps: ['관계 부담 정리', '대안교육 정보 확인', '복교 조건과 부담 비교'], priorityLabel: '선택지' },
  { id: 'work', factorId: 'economy', title: '일경험·자립 병행', tone: 'green', icon: '🧭', text: '생계와 학습을 함께 고려해 시간제 학습과 자립지원을 결합하는 경로', steps: ['생활시간표 만들기', '자립지원 정보 확인', '직업상담 연결'], priorityLabel: '선택지' },
  { id: 'portfolio', factorId: 'career', title: '포트폴리오·창작 프로젝트', tone: 'orange', icon: '🎨', text: '관심 분야 결과물을 만들며 진로 가능성을 탐색하는 경로', steps: ['관심 분야 3개 정리', '작은 프로젝트 시작', '멘토 피드백 받기'], priorityLabel: '선택지' },
  { id: 'career', factorId: 'support', title: '지원기관 동행 설계', tone: 'blue', icon: '🤝', text: '혼자 계획하기보다 상담자와 학습·진로·생활 지원을 묶어 설계하는 경로', steps: ['가까운 센터 확인', '상담 예약', '4주 실행표 만들기'], priorityLabel: '선택지' },
];


const previewWeeksByPath: Record<RoadmapPath['id'], RoadmapWeek[]> = {
  recovery: [
    { week: '1주차', title: '회복 신호 확인', items: ['무리하지 않는 하루 루틴 적기', '힘든 시간대와 도움받을 사람 정리', '지역 상담 연결 후보 2곳 확인'] },
    { week: '2주차', title: '상담 연결과 안전한 시작', items: ['청소년상담 1388 또는 지역센터 문의', '상담자에게 리포트 공유', '하루 10분 가벼운 학습만 시도'] },
    { week: '3주차', title: '짧은 학습 루틴 회복', items: ['가장 부담 적은 과목 1개 선택', '주 3회 20분 루틴 만들기', '진로 관심 분야를 부담 없이 기록'] },
    { week: '4주차', title: '다음 경로 함께 고르기', items: ['검정고시·대안교육·진로탐색 비교', '상담자와 다음 달 목표 1개 확정', '필요하면 상담 주기 유지'] },
  ],
  exam: [
    { week: '1주차', title: '학력회복 출발점 찾기', items: ['검정고시 과목과 일정 확인', '최근 학습 공백 기간 정리', '기초 수준을 과목별로 표시'] },
    { week: '2주차', title: '취약 과목 좁히기', items: ['취약 과목 2개 선정', '온라인 강의 또는 문제집 시작', '하루 30분 학습 시간 확보'] },
    { week: '3주차', title: '학습지원 연결', items: ['꿈드림 검정고시반 문의', '멘토링 또는 스터디 후보 확인', '상담 리포트 저장'] },
    { week: '4주차', title: '시험 준비 구조 만들기', items: ['기초문제 또는 모의고사 풀이', '학습량을 무리 없이 조정', '다음 달 과목별 목표 확정'] },
  ],
  alternative: [
    { week: '1주차', title: '관계 부담 정리', items: ['힘들었던 관계 상황을 안전하게 기록', '만나도 괜찮은 어른 1명 정하기', '복교가 부담스러운 이유 분리'] },
    { week: '2주차', title: '다른 배움터 탐색', items: ['대안교육기관·위탁교육 정보 확인', '복교 조건과 대안교육 장단점 비교', '가족 또는 상담자와 선택지 공유'] },
    { week: '3주차', title: '작은 방문·상담', items: ['기관 상담 또는 전화 문의', '프로그램 분위기와 이동거리 확인', '또래·멘토 프로그램 살펴보기'] },
    { week: '4주차', title: '안전한 연결 방식 선택', items: ['복교·대안교육·검정고시 중 부담 낮은 경로 표시', '필요한 관계 지원 정리', '다음 달 체험 또는 상담 일정 잡기'] },
  ],
  work: [
    { week: '1주차', title: '생활·일정 현실 점검', items: ['일·학습 가능 시간대 표시', '교통비·학습비 부담 정리', '당장 필요한 자립지원 목록 작성'] },
    { week: '2주차', title: '자립지원 연결', items: ['고용복지+센터 또는 자립지원 문의', '직업상담에서 희망 조건 공유', '무리 없는 주간 시간표 만들기'] },
    { week: '3주차', title: '시간제 학습 병행', items: ['검정고시 또는 온라인 학습 20분 루틴', '일경험과 충돌하는 시간 조정', '지원금·교통비 정보 확인'] },
    { week: '4주차', title: '일경험 이후 선택지 비교', items: ['직업훈련·검정고시·자립 프로그램 비교', '몸과 마음에 무리 없는 속도 점검', '다음 달 병행 계획 확정'] },
  ],
  portfolio: [
    { week: '1주차', title: '관심 분야 지도 만들기', items: ['좋아하는 일 3개와 싫은 일 3개 적기', '관심 분야 영상·글 3개 모으기', '작은 결과물 주제 하나 고르기'] },
    { week: '2주차', title: '작은 프로젝트 시작', items: ['그림·영상·코딩·요리 등 결과물 초안 만들기', '하루 30분 작업 시간 정하기', '참고할 멘토나 커뮤니티 찾기'] },
    { week: '3주차', title: '피드백 받기', items: ['작은 결과물을 상담자나 멘토에게 공유', '관련 직업과 필요한 학습 확인', '포트폴리오 폴더 만들기'] },
    { week: '4주차', title: '진로 실험 확장', items: ['직업체험 또는 훈련기관 문의', '학력회복과 프로젝트 병행 가능성 비교', '다음 프로젝트 주제 정하기'] },
  ],
  career: [
    { week: '1주차', title: '도움 요청 창구 정하기', items: ['가까운 지원기관 2곳 저장', '상담·학습·진로 중 필요한 도움 표시', '상담 예약 가능 시간 확인'] },
    { week: '2주차', title: '상담자와 목표 나누기', items: ['AI 리포트 공유', '가장 어려운 요인 2개 설명', '혼자 할 일과 함께 할 일 분리'] },
    { week: '3주차', title: '프로그램 연결', items: ['학습지원 또는 진로 프로그램 신청', '필요하면 상담지원도 함께 연결', '참여 전 부담 요소 정리'] },
    { week: '4주차', title: '개인 로드맵 재조정', items: ['해본 것과 어려웠던 것 표시', '다음 달 경로 2가지를 비교', '상담자와 실행표 업데이트'] },
  ],
};

function priorityWeight(result: AnalysisResult, path: RoadmapPath) {
  if (path.factorId === 'mixed') return 0;
  const factor = result.factors.find((item) => item.id === path.factorId);
  if (!factor) return 0;
  const severityBoost = factor.severity === '상' ? 30 : factor.severity === '중' ? 12 : 0;
  return factor.rawScore * 10 + severityBoost;
}

export function buildRoadmapModel(result: AnalysisResult): RoadmapModel {
  const sorted = [...basePaths].sort((a, b) => priorityWeight(result, b) - priorityWeight(result, a));
  const top = { ...sorted[0], priorityLabel: '설문 결과 선정' };
  const headlineByPath: Record<RoadmapPath['id'], string> = {
    recovery: '회복을 먼저 두고 여러 갈래 중 나에게 맞는 방향을 고르는 지도',
    exam: '여러 갈래 중 나에게 맞는 방향을 고르는 지도',
    alternative: '관계 부담을 정리하며 대안교육·복교를 비교하는 구조도',
    work: '일경험·자립과 학습을 병행하는 구조도',
    portfolio: '관심 분야를 프로젝트로 확인하는 구조도',
    career: '지원기관과 함께 여러 경로를 설계하는 구조도',
  };
  return {
    headline: headlineByPath[top.id],
    summary: `${result.finalType} 결과에서 가장 우선순위가 높은 ${top.title} 로드맵만 계단형으로 보여드려요. 각 단계는 바로 결정하라는 뜻이 아니라 상담자와 함께 속도를 조절하기 위한 안내입니다.`,
    centerLabel: top.title,
    centerDescription: top.text,
    selectedPath: top,
    previewWeeks: previewWeeksByPath[top.id],
    staircaseSteps: previewWeeksByPath[top.id].map((week, index) => ({
      step: `${index + 1}단계`,
      title: week.title,
      description: `${week.week}에 집중할 핵심 단계입니다. ${top.title} 경로에 맞춰 무리하지 않는 순서로 진행합니다.`,
      actions: week.items,
    })),
    checkpoints: ['오늘 상태 한 문장으로 정리하기', '가장 부담되는 요인 2개 고르기', `${top.title}에 필요한 첫 행동 1개 정하기`, '상담자에게 공유할 리포트 저장하기'],
    questions: ['지금은 회복이 먼저인가, 바로 시작 가능한 작은 행동이 있는가?', '이 단계의 속도가 부담스럽다면 무엇을 줄일 수 있을까?', '가족·상담자·기관 중 누구와 먼저 공유할까?', '이번 주에 30분 안에 해볼 수 있는 행동은 무엇일까?'],
  };
}
