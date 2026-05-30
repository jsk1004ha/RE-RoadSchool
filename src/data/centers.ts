export type RegionKey = '서울' | '경기' | '인천' | '전북' | '부산' | '대구' | '광주' | '대전' | '강원' | '충청' | '전라' | '경상' | '제주';

export interface SupportCenter {
  id: string;
  regionKey: RegionKey | '전국';
  name: string;
  type: string;
  phone: string;
  address: string;
  distance: string;
  services: string[];
  recommendedFor: string;
  sourceLabel: string;
  sourceUrl: string;
  representativeDemo: boolean;
  hours: string;
  reason: string;
  lat?: number;
  lng?: number;
}

const pdfSource = 'https://www.1388.go.kr/files/isry_backend/U16/MAIN/2026/2/5/2026-02-05_f9a6b92f-52db-4c42-9891-4bc7c924ee45.pdf';

const counselingSource = 'https://m.korea.kr/briefing/pressReleaseView.do?newsId=156716848';
const regionalCounselingInfo: Array<[RegionKey, string, string]> = [
  ['서울', '서울 지역 청소년상담복지센터 1388 연결', '02-1388'],
  ['경기', '경기 지역 청소년상담복지센터 1388 연결', '031-1388'],
  ['인천', '인천 지역 청소년상담복지센터 1388 연결', '032-1388'],
  ['전북', '전북 지역 청소년상담복지센터 1388 연결', '063-1388'],
  ['부산', '부산 지역 청소년상담복지센터 1388 연결', '051-1388'],
  ['대구', '대구 지역 청소년상담복지센터 1388 연결', '053-1388'],
  ['광주', '광주 지역 청소년상담복지센터 1388 연결', '062-1388'],
  ['대전', '대전 지역 청소년상담복지센터 1388 연결', '042-1388'],
  ['강원', '강원 지역 청소년상담복지센터 1388 연결', '033-1388'],
  ['충청', '충청 지역 청소년상담복지센터 1388 연결', '043-1388 / 041-1388'],
  ['전라', '전라 지역 청소년상담복지센터 1388 연결', '061-1388 / 063-1388'],
  ['경상', '경상 지역 청소년상담복지센터 1388 연결', '054-1388 / 055-1388'],
  ['제주', '제주 지역 청소년상담복지센터 1388 연결', '064-1388'],
];

const regionalCounselingCenters: SupportCenter[] = regionalCounselingInfo.map(([regionKey, name, phone]) => ({
  id: `${regionKey}-youth-counseling-1388`,
  regionKey,
  name,
  type: '청소년상담복지센터',
  phone,
  address: `${regionKey} 지역 청소년상담복지센터 또는 가까운 시·군·구 센터 연계`,
  distance: '지역 연결',
  services: ['청소년상담', '위기상담', '심리·정서 지원', '지역 상담소 연결'],
  recommendedFor: '심리·정서 요인이 높거나 바로 상담 연결이 필요한 청소년',
  sourceLabel: '청소년상담1388 지역번호+1388 안내',
  sourceUrl: counselingSource,
  representativeDemo: true,
  hours: '365일 24시간 전화상담(지역번호+1388)',
  reason: '심각도 상 요인이 확인될 때 선택 지역의 청소년상담복지센터와 1388 상담망으로 바로 연결하기 위해 추천됩니다.',
}));

export const regionOptions: { key: RegionKey; label: string }[] = [
  { key: '서울', label: '서울' },
  { key: '경기', label: '경기' },
  { key: '인천', label: '인천' },
  { key: '전북', label: '전북' },
  { key: '부산', label: '부산' },
  { key: '대구', label: '대구' },
  { key: '광주', label: '광주' },
  { key: '대전', label: '대전' },
  { key: '강원', label: '강원' },
  { key: '충청', label: '충청' },
  { key: '전라', label: '전라' },
  { key: '경상', label: '경상' },
  { key: '제주', label: '제주' },
];

const dreamServices = ['상담', '학습지원', '진로지원', '자립지원', '검정고시 지원'];

export const supportCenters: SupportCenter[] = [
  ...regionalCounselingCenters,
  {
    id: 'jeonju-youth-1388', regionKey: '전북', name: '전주시청소년상담복지센터 / 전주시학교밖청소년지원센터', type: '상담지원·꿈드림센터', phone: '063-236-1388', address: '전북 전주시 완산구 용머리로 94, 좋은빌딩 3층', distance: '1.2km', services: ['상담', '학습지원', '자립지원', '검정고시 지원'], recommendedFor: '심리·정서 지원과 학업복귀 상담이 함께 필요한 청소년', sourceLabel: '전북특별자치도청소년상담복지센터 지역센터 목록', sourceUrl: 'https://www.jb1388.kr/schoolmap', representativeDemo: false, hours: '평일 09:00~18:00', reason: '사용자의 학업관련·지원수요 점수가 중간 이상이며 상담 연결이 함께 필요하기 때문에 추천되었습니다.',
  },
  {
    id: 'jeonbuk-dream', regionKey: '전북', name: '전북특별자치도청소년지원센터 꿈드림', type: '꿈드림센터', phone: '063-273-1388', address: '전북특별자치도 전주시 덕진구 팔달로 350, 2층', distance: '2.1km', services: dreamServices, recommendedFor: '검정고시·학업복귀·진로탐색 지원이 필요한 청소년', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: false, hours: '평일 09:00~18:00', reason: '전북 지역 학교 밖 청소년의 학업복귀와 사회진입을 지원하는 광역 꿈드림센터입니다.',
  },
  {
    id: 'jeonju-mind', regionKey: '전북', name: '전주시정신건강복지센터', type: '전문 상담기관', phone: '063-273-6995~6', address: '전북 전주시 덕진구 벚꽃로 55 별관2, 2층', distance: '2.8km', services: ['정신건강 상담', '위기상담', '지역기관 연계'], recommendedFor: '심리·정서 부담이 크게 나타난 경우', sourceLabel: '전주시정신건강복지센터', sourceUrl: 'https://jjmind.com/sub.php?menukey=11', representativeDemo: false, hours: '평일 09:00~18:00', reason: '심리·정서 요인이 높게 나타난 경우 전문 상담기관 연결을 먼저 고려할 수 있습니다.',
  },
  { id: 'seoul-dream', regionKey: '서울', name: '서울특별시 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '02-2285-1318', address: '서울특별시 중구 을지로 11길 23', distance: '지역 중심', services: dreamServices, recommendedFor: '서울 지역 학습·진로·상담 연결', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '서울 지역 대표 꿈드림센터로 학습과 상담 연결을 시작하기 좋습니다.' },
  { id: 'gyeonggi-dream', regionKey: '경기', name: '경기도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '031-253-1519', address: '경기도 수원시 영통구 광교로 156 광교비즈니스센터 105호', distance: '지역 중심', services: dreamServices, recommendedFor: '경기 지역 학업복귀·사회진입 지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '경기 지역에서 검정고시와 진로지원 정보를 연결할 수 있는 대표 센터입니다.' },
  { id: 'incheon-dream', regionKey: '인천', name: '인천광역시 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '032-721-2330', address: '인천광역시 동구 박문로 1 가톨릭청소년센터 1층 꿈드림사무실', distance: '지역 중심', services: dreamServices, recommendedFor: '인천 지역 상담·교육·자립지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '인천 지역에서 초기 상담과 맞춤 지원을 확인할 수 있는 대표 센터입니다.' },
  { id: 'busan-dream', regionKey: '부산', name: '부산광역시 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '051-304-1318', address: '부산광역시 부산진구 서전로43, 6층', distance: '지역 중심', services: dreamServices, recommendedFor: '부산 지역 학업·진로 지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '부산 지역 학교 밖 청소년의 상담과 진로지원을 연결합니다.' },
  { id: 'daegu-dream', regionKey: '대구', name: '대구광역시 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '053-431-1388', address: '대구광역시 남구 명덕로 34길 16, 2층', distance: '지역 중심', services: dreamServices, recommendedFor: '대구 지역 검정고시·진로상담', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '대구 지역에서 학습지원과 상담 프로그램을 함께 확인할 수 있습니다.' },
  { id: 'gwangju-dream', regionKey: '광주', name: '광주광역시 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '062-376-1324', address: '광주광역시 서구 학생독립로 37, 광주시청소년수련원 D동 2층', distance: '지역 중심', services: dreamServices, recommendedFor: '광주 지역 상담·학습·진로지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '광주 지역 학업복귀와 진로탐색 지원을 연결합니다.' },
  { id: 'daejeon-dream', regionKey: '대전', name: '대전광역시 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '042-222-1388', address: '대전광역시 동구 대전천동로 508 6층', distance: '지역 중심', services: dreamServices, recommendedFor: '대전 지역 초기상담·학습지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '대전 지역에서 상담과 학습지원 프로그램으로 연결할 수 있습니다.' },
  { id: 'gangwon-dream', regionKey: '강원', name: '강원특별자치도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '033-257-9805', address: '강원도 춘천시 중앙로 14, 1층', distance: '지역 중심', services: dreamServices, recommendedFor: '강원 지역 학업복귀·상담지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '강원 지역에서 가까운 꿈드림 프로그램을 찾는 시작점입니다.' },
  { id: 'chungbuk-dream', regionKey: '충청', name: '충청북도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '043-257-0105', address: '충청북도 청주시 상당구 대성로 103', distance: '지역 중심', services: dreamServices, recommendedFor: '충청권 학습·상담 연결', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '충청권에서 학업복귀 상담을 시작할 수 있는 대표 센터입니다.' },
  { id: 'chungnam-dream', regionKey: '충청', name: '충청남도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '041-554-1380', address: '충청남도 천안시 서북구 두정로 181, 3층', distance: '지역 중심', services: dreamServices, recommendedFor: '충남 지역 진로·자립지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '충남 지역에서 진로와 자립지원 정보를 함께 확인할 수 있습니다.' },
  { id: 'jeonnam-dream', regionKey: '전라', name: '전라남도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '061-242-7474', address: '전라남도 목포시 용당로 304, 전남청소년미래재단 2층', distance: '지역 중심', services: dreamServices, recommendedFor: '전라권 상담·학습지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '전라권에서 검정고시와 상담 연결을 시작하기 좋은 대표 센터입니다.' },
  { id: 'jeolla-jeonbuk-dream', regionKey: '전라', name: '전북특별자치도청소년지원센터 꿈드림', type: '꿈드림센터', phone: '063-273-1388', address: '전북특별자치도 전주시 덕진구 팔달로 350, 2층', distance: '지역 중심', services: dreamServices, recommendedFor: '전북 지역 학습·진로지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '전라권 필터에서도 전북 대표 센터 정보를 함께 제공합니다.' },
  { id: 'gyeongbuk-dream', regionKey: '경상', name: '경상북도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '054-850-1003', address: '경상북도 안동시 축제장길 20', distance: '지역 중심', services: dreamServices, recommendedFor: '경상권 상담·학업복귀', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '경북 지역에서 학업복귀와 진로지원 상담을 연결합니다.' },
  { id: 'gyeongnam-dream', regionKey: '경상', name: '경상남도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '055-711-1336', address: '경상남도 창원시 의창구 사림로 45번길 59 경남대표도서관 청소년관 3,4층', distance: '지역 중심', services: dreamServices, recommendedFor: '경상권 진로·자립지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '경남 지역의 진로·자립 프로그램 정보를 확인할 수 있습니다.' },
  { id: 'jeju-dream', regionKey: '제주', name: '제주특별자치도 학교밖청소년지원센터 꿈드림', type: '꿈드림센터', phone: '064-759-9982', address: '제주특별자치도 제주시 고마로 152, 2층', distance: '지역 중심', services: dreamServices, recommendedFor: '제주 지역 상담·학습지원', sourceLabel: '청소년1388 학교밖청소년지원센터 안내', sourceUrl: pdfSource, representativeDemo: true, hours: '평일 09:00~18:00', reason: '제주 지역에서 상담과 학습지원 연결을 시작할 수 있습니다.' },
  { id: 'national-1388', regionKey: '전국', name: '청소년상담1388', type: '24시간 상담', phone: '1388 / 휴대전화 지역번호+1388', address: '전화·문자·카카오톡·웹채팅 상담', distance: '언제나', services: ['24시간 전화상담', '문자상담', '카카오톡 상담', '웹채팅'], recommendedFor: '지금 바로 누군가와 이야기하고 싶을 때', sourceLabel: '대한민국 정책브리핑 청소년상담1388 안내', sourceUrl: 'https://m.korea.kr/briefing/pressReleaseView.do?newsId=156716848', representativeDemo: false, hours: '365일 24시간', reason: '시간과 지역에 관계없이 청소년이 원하는 방식으로 상담을 시작할 수 있는 국가 상담 채널입니다.' },
];

export function getCentersByRegion(regionKey: RegionKey): SupportCenter[] {
  return supportCenters.filter((center) => center.regionKey === regionKey);
}

export function getHighSupportContacts(regionKey: RegionKey): SupportCenter[] {
  const regional = supportCenters.filter((center) => center.regionKey === regionKey && ['상담지원·꿈드림센터', '전문 상담기관', '꿈드림센터'].includes(center.type));
  const national = supportCenters.filter((center) => center.id === 'national-1388');
  return [...regional, ...national];
}

export function parseRegionKey(region: string): RegionKey {
  if (region.includes('서울')) return '서울';
  if (region.includes('경기')) return '경기';
  if (region.includes('인천')) return '인천';
  if (region.includes('부산')) return '부산';
  if (region.includes('대구')) return '대구';
  if (region.includes('광주')) return '광주';
  if (region.includes('대전')) return '대전';
  if (region.includes('강원')) return '강원';
  if (region.includes('충')) return '충청';
  if (region.includes('전북')) return '전북';
  if (region.includes('전')) return '전라';
  if (region.includes('경상') || region.includes('경북') || region.includes('경남')) return '경상';
  if (region.includes('제주')) return '제주';
  return '전북';
}
