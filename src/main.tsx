import React from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, YAxis,
} from 'recharts';
import {
  ArrowRight, Bot, Building2, CheckCircle2, ChevronDown, ClipboardList,
  Download, FileText, GraduationCap, Home, MapPin, Menu, Phone,
  PieChart as PieIcon, RefreshCw, Route, Search, Settings, Share2, ShieldCheck, Sparkles, Target, X,
} from 'lucide-react';
import { analyzeAnswers, clearDemoStateKeys, defaultDemoAnswers, loadResult, severityTone, STORAGE_KEYS, type AnalysisResult } from './lib/analysis';
import { buildRoadmapModel } from './lib/roadmap';
import { factorMetas, scaleOptions, surveyQuestions, type Severity } from './data/survey';
import { getCentersByRegion, getHighSupportContacts, parseRegionKey, regionOptions, type RegionKey, type SupportCenter } from './data/centers';
import './styles.css';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function usePath() {
  const [path, setPath] = React.useState(window.location.pathname);
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function Button({ children, variant = 'primary', className, onClick, type = 'button' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'soft' | 'danger'; className?: string; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button type={type} onClick={onClick} className={classNames('btn', `btn-${variant}`, className)}>{children}</button>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.section whileHover={{ y: -3 }} transition={{ duration: 0.18 }} className={classNames('app-card', className)}>{children}</motion.section>;
}

function LogoMark({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <span className={classNames('grid shrink-0 place-items-center rounded-2xl bg-white/80 p-1.5 shadow-sm ring-1 ring-blue-100', className)}>
      <img src="/logos/re-road-school-logo-transparent.png" alt="RE路School 로고" className="h-full w-full object-contain" />
    </span>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const timer = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
      {message}
    </motion.div>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-left">
          <LogoMark className="h-11 w-11" />
          <span><strong className="block text-xl font-black tracking-tight">RE<span className="text-blue-600">路</span>School</strong><small className="text-xs font-bold text-slate-500">AI 복귀·진로 경로 설계</small></span>
        </button>
        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 md:flex">
          <button onClick={() => navigate('/#intro')}>서비스 소개</button>
          <button onClick={() => navigate('/survey')}>AI 진단</button>
          <button onClick={() => navigate('/centers')}>지원기관</button>
          <button onClick={() => navigate('/report')}>리포트 예시</button>
        </nav>
        <Button onClick={() => navigate('/survey')} className="hidden sm:inline-flex">AI 진단 시작하기</Button>
        <button className="md:hidden"><Menu /></button>
      </div>
    </header>
  );
}

function LandingPage() {
  const stats = [
    ['2024 전체 학업중단률', '1.1%'], ['2024 고등학교 학업중단률', '2.1%'], ['2024 특성화고 학업중단률', '4.2%'],
    ['고등학교 시기 중단', '67.2%'], ['검정고시 준비 계획', '70.7%'], ['센터 정보 미제공', '45.3%'],
  ];
  const values = [
    { icon: <PieIcon />, title: '요인 분석', text: '학업·진로·심리·관계·경제·지원수요를 6개 축으로 분석합니다.' },
    { icon: <Target />, title: '심각도 분류', text: '상·중·하 수준에 따라 상담 연결 기준과 다음 행동을 제안합니다.' },
    { icon: <Building2 />, title: '기관 연결', text: '꿈드림센터, 청소년상담복지센터, 학습·직업훈련기관을 추천합니다.' },
  ];
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eaf1ff,transparent_35%),#f7f9fc]">
      <TopNav />
      <motion.main initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-7xl px-5 py-12">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="pill mb-5"><Sparkles size={16} /> 청소년 친화 AI 자기진단 데모</span>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-6xl">학교를 떠난 순간에도,<br /><span className="gradient-text">배움의 길은 다시 열린다.</span></h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">RE路School은 3~5분 자기진단을 통해 학업중단 요인을 분석하고, 나에게 맞는 복귀·진로·상담 경로를 추천하는 AI 플랫폼입니다.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate('/survey')}>AI 진단 시작하기 <ArrowRight size={18} /></Button>
              <Button variant="secondary" onClick={() => {
                localStorage.setItem(STORAGE_KEYS.result, JSON.stringify(analyzeAnswers(defaultDemoAnswers)));
                navigate('/result');
              }}>결과 화면 미리보기</Button>
            </div>
          </div>
          <Card className="relative overflow-hidden p-0">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <div className="relative p-6 pt-16">
              <div className="rounded-[28px] bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-bold text-slate-500">김리로드 님</p><h3 className="text-2xl font-black text-slate-950">진로탐색 병행형</h3></div>
                  <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-500">종합 중간</span>
                </div>
                <div className="mt-6 h-64">
                  <ResponsiveContainer>
                    <RadarChart data={factorMetas.map((meta) => ({ factor: meta.shortLabel, value: analyzeAnswers(defaultDemoAnswers).factors.find((item) => item.id === meta.id)?.displayPercent }))}>
                      <PolarGrid stroke="#dbe4f0" />
                      <PolarAngleAxis dataKey="factor" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Radar dataKey="value" stroke="#3B6FF5" fill="#3B6FF5" fillOpacity={0.28} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {['상담 우선', '검정고시 계획', '지역기관 연결'].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm font-extrabold text-slate-700">{item}</div>)}
                </div>
              </div>
            </div>
          </Card>
        </section>
        <section id="intro" className="mt-16 grid gap-5 md:grid-cols-3">
          {values.map((value) => <Card key={value.title} className="p-6"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">{value.icon}</div><h3 className="text-xl font-black text-slate-950">{value.title}</h3><p className="mt-3 font-semibold leading-7 text-slate-600">{value.text}</p></Card>)}
        </section>
        <section className="mt-10 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <Card className="p-6"><h2 className="text-2xl font-black text-slate-950">공공데이터 기반 문제 인식</h2><p className="mt-3 font-semibold text-slate-600">학업중단 청소년은 하나의 집단이 아니며, 중단 이유와 필요한 지원이 다릅니다.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{stats.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-500">{label}</p><strong className="mt-1 block text-3xl font-black text-blue-600">{value}</strong></div>)}</div></Card>
          <Card className="p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 text-green-500" size={34} /><div><h2 className="text-2xl font-black text-slate-950">윤리 안내</h2><ul className="mt-4 space-y-3 font-semibold leading-7 text-slate-600"><li>RE路School은 학생을 평가하거나 낙인찍는 서비스가 아닙니다.</li><li>개인 이름, 학교명, 성적, 생활기록부 등 민감정보를 요구하지 않습니다.</li><li>결과는 상담과 의사결정을 돕는 참고자료입니다.</li></ul></div></div></Card>
        </section>
      </motion.main>
    </div>
  );
}

function readStoredAnswers(): (number | null)[] {
  const empty = Array(surveyQuestions.length).fill(null) as (number | null)[];
  const stored = localStorage.getItem(STORAGE_KEYS.answers);
  if (!stored) return empty;
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed) || parsed.length !== surveyQuestions.length) return empty;
    return parsed.map((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3 ? answer : null) as (number | null)[];
  } catch {
    localStorage.removeItem(STORAGE_KEYS.answers);
    return empty;
  }
}

function SurveyPage() {
  const storedRegion = localStorage.getItem(STORAGE_KEYS.region);
  const [answers, setAnswers] = React.useState<(number | null)[]>(readStoredAnswers);
  const [index, setIndex] = React.useState(0);
  const [submitNotice, setSubmitNotice] = React.useState('');
  const [selectedRegion, setSelectedRegion] = React.useState(storedRegion ?? '전북');
  const [regionConfirmed, setRegionConfirmed] = React.useState(Boolean(storedRegion));
  const question = surveyQuestions[index];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const currentAnswer = answers[index];
  const allAnswered = answeredCount === surveyQuestions.length;
  const progress = Math.round(((index + 1) / surveyQuestions.length) * 100);
  const confirmRegion = () => {
    localStorage.setItem(STORAGE_KEYS.region, selectedRegion);
    setRegionConfirmed(true);
  };
  const selectAnswer = (value: number) => {
    const next = [...answers];
    next[index] = value;
    setSubmitNotice('');
    setAnswers(next);
    localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(next));
  };
  const complete = () => {
    if (!allAnswered) {
      setSubmitNotice(`아직 ${surveyQuestions.length - answeredCount}개 문항이 남아 있어요. 모든 문항에 답한 뒤 분석을 시작할 수 있습니다.`);
      const firstMissing = answers.findIndex((answer) => answer === null);
      if (firstMissing >= 0) setIndex(firstMissing);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.region, selectedRegion);
    const numericAnswers = answers.map((answer) => answer ?? 0);
    localStorage.setItem(STORAGE_KEYS.result, JSON.stringify(analyzeAnswers(numericAnswers, { region: selectedRegion })));
    navigate('/analyzing');
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <motion.div initial="initial" animate="animate" variants={pageVariants}>
          {!regionConfirmed ? (
            <Card className="p-7 md:p-10">
              <span className="pill"><MapPin size={16} /> 지역 먼저 선택</span>
              <h1 className="mt-5 text-3xl font-black tracking-[-0.03em] text-slate-950">지역을 먼저 선택해주세요.</h1>
              <p className="mt-3 font-semibold leading-7 text-slate-600">심각도 상 요인이 나오면 선택한 지역의 청소년상담복지센터와 1388 상담 연결을 바로 보여드릴게요.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {regionOptions.map((region) => <button key={region.key} onClick={() => setSelectedRegion(region.key)} className={classNames('rounded-2xl border p-4 text-left font-black transition hover:-translate-y-0.5 hover:shadow-lg', selectedRegion === region.key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700')}>{region.label}</button>)}
              </div>
              <Button className="mt-8" onClick={confirmRegion}>이 지역으로 설문 시작하기 <ArrowRight size={18} /></Button>
              <p className="mt-4 text-xs font-bold leading-5 text-slate-400">지역은 가까운 상담·지원기관을 추천하기 위한 정보이며, 이름·학교명·성적 등 민감정보는 묻지 않습니다.</p>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between"><span className="pill"><ClipboardList size={16} /> 정답은 없어요</span><span className="text-sm font-black text-slate-500">{index + 1}/18 · 응답 {answeredCount}개</span></div>
              <div className="mb-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm ring-1 ring-slate-100"><span>선택 지역: <b className="text-blue-600">{selectedRegion}</b></span><button className="text-blue-600" onClick={() => setRegionConfirmed(false)}>지역 변경</button></div>
              <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" animate={{ width: `${progress}%` }} /></div>
              <Card className="p-7 md:p-10">
                <p className="text-sm font-black text-blue-600">{question.factorLabel}</p>
                <h1 className="mt-4 text-2xl font-black leading-snug tracking-[-0.03em] text-slate-950 md:text-3xl">{question.text}</h1>
                <p className="mt-3 font-semibold text-slate-500">지금 내 상황에 가장 가까운 답을 선택해주세요.</p>
                <div className="mt-8 grid gap-3">
                  {scaleOptions.map((option) => <button key={option.value} onClick={() => selectAnswer(option.value)} className={classNames('rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg', currentAnswer === option.value ? 'border-blue-500 bg-blue-50 shadow-blue-100' : 'border-slate-200 bg-white')}><span className="flex items-center justify-between"><strong className="text-lg text-slate-900">{option.value}점 · {option.label}</strong>{currentAnswer === option.value && <CheckCircle2 className="text-blue-600" />}</span><small className="mt-1 block font-bold text-slate-500">{option.helper}</small></button>)}
                </div>
                {submitNotice && <p className="mt-5 rounded-2xl bg-orange-50 p-4 text-sm font-black text-orange-600">{submitNotice}</p>}
                <div className="mt-8 flex justify-between"><Button variant="secondary" onClick={() => setIndex(Math.max(0, index - 1))}>이전</Button>{index === surveyQuestions.length - 1 ? <button type="button" onClick={complete} aria-disabled={!allAnswered} className="btn btn-primary">AI 분석 시작하기 <Sparkles size={18} /></button> : <Button onClick={() => setIndex(Math.min(surveyQuestions.length - 1, index + 1))}>다음 <ArrowRight size={18} /></Button>}</div>
              </Card>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function AnalyzingPage() {
  const messages = ['설문 응답을 정리하고 있어요.', '학업중단 요인 6개 축을 분석하고 있어요.', '심각도를 상·중·하로 분류하고 있어요.', '가까운 지원기관과 연결 경로를 찾고 있어요.', '나에게 맞는 복귀·진로 로드맵을 완성했어요.'];
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const interval = window.setInterval(() => setStep((value) => Math.min(messages.length - 1, value + 1)), 750);
    const timer = window.setTimeout(() => navigate('/result'), 3900);
    return () => { window.clearInterval(interval); window.clearTimeout(timer); };
  }, []);
  return <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_center,#eaf1ff,transparent_40%),#f7f9fc]"><Card className="w-[min(92vw,560px)] p-10 text-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-blue-500 to-purple-500 text-white"><Bot size={36} /></motion.div><h1 className="mt-7 text-2xl font-black text-slate-950">AI가 학업중단 요인 6개 축을 분석하고 있어요.</h1><AnimatePresence mode="wait"><motion.p key={messages[step]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 text-lg font-bold text-slate-600">{messages[step]}</motion.p></AnimatePresence><div className="mt-8 grid gap-2">{messages.map((message, i) => <div key={message} className={classNames('h-2 rounded-full transition', i <= step ? 'bg-blue-500' : 'bg-slate-200')} />)}</div></Card></div>;
}

const sideItems = [
  ['/', Home, '홈'], ['/result', PieIcon, '분석 결과'], ['/roadmap', Route, '나의 로드맵'], ['/centers', Building2, '지원기관 연결'], ['/report', FileText, '상담 리포트'], ['/insights', BarChartIcon, '데이터 인사이트'], ['/settings', Settings, '설정'],
] as const;
function BarChartIcon(props: { size?: number }) { return <PieIcon {...props} />; }

function DashboardShell({ children, active = '/result' }: { children: React.ReactNode; active?: string }) {
  return <div className="dashboard-shell"><aside className="sidebar"><button onClick={() => navigate('/')} className="mb-9 flex items-center gap-2 px-2 text-left"><LogoMark className="h-10 w-10" /><span><strong className="block text-xl font-black">RE<span className="text-blue-600">路</span>School</strong><small className="text-xs font-bold text-slate-500">AI 경로 설계</small></span></button><nav className="space-y-2">{sideItems.map(([path, Icon, label]) => <button key={path} onClick={() => path === '/settings' ? undefined : navigate(path)} className={classNames('side-link', active === path && 'active')}><Icon size={18} /> {label}</button>)}</nav><div className="mt-auto rounded-3xl bg-blue-50 p-4"><Bot className="text-blue-600" /><p className="mt-3 text-sm font-black text-slate-900">궁금한 점이 있나요?</p><p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI 상담봇에게 물어보세요.</p><Button variant="soft" className="mt-3 w-full justify-center py-2 text-xs">대화하기</Button></div></aside><main className="min-w-0 flex-1">{children}</main></div>;
}

function DashboardHeader({ result, onToast }: { result: AnalysisResult; onToast: (message: string) => void }) {
  return <div className="dashboard-header"><div><p className="font-black text-blue-600">분석 완료</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">{result.userAlias} 님, 분석 결과를 확인해볼까요?</h1><p className="mt-2 font-semibold text-slate-500">AI가 당신의 응답을 바탕으로 가장 적합한 학업·진로 경로를 추천했어요.</p></div><div className="flex flex-wrap gap-3"><Button variant="secondary" onClick={() => navigate('/report')}><Share2 size={17} /> 상담자에게 공유하기</Button><Button onClick={() => onToast('리포트가 저장되었습니다')}><Download size={17} /> PDF 리포트 만들기</Button></div></div>;
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const tone = severityTone(severity);
  return <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: tone.bg, color: tone.color }}>{severity}</span>;
}

function Gauge({ value }: { value: number }) {
  const data = [{ name: 'value', value }, { name: 'rest', value: 100 - value }];
  return <ResponsiveContainer width="100%" height={120}><PieChart><Pie data={data} startAngle={180} endAngle={0} innerRadius={44} outerRadius={64} dataKey="value" stroke="none"><Cell fill="#FF9F43" /><Cell fill="#E5E7EB" /></Pie></PieChart></ResponsiveContainer>;
}

function ResultPage({ onToast }: { onToast: (message: string) => void }) {
  const [result] = React.useState(loadResult());
  const [selectedCenter, setSelectedCenter] = React.useState<SupportCenter | null>(null);
  const regionKey = parseRegionKey(result.region);
  const recommendedCenters = getCentersByRegion(regionKey).slice(0, 4);
  const highContacts = getHighSupportContacts(regionKey);
  const radarData = result.factors.map((factor) => ({ factor: factor.label, value: factor.displayPercent }));
  return <DashboardShell active="/result"><DashboardHeader result={result} onToast={onToast} /><div className="dashboard-content"><section className="grid gap-5 xl:grid-cols-3"><Card className="p-6"><GraduationCap className="text-blue-600" /><p className="mt-4 text-sm font-bold text-slate-500">당신의 유형</p><h2 className="mt-1 text-2xl font-black text-slate-950">{result.finalType}</h2><p className="mt-3 font-semibold leading-7 text-slate-600">학력취득과 진로탐색을 함께 준비하면 좋은 유형이에요.</p></Card><Card className="p-6"><p className="text-sm font-bold text-slate-500">종합 심각도</p><h2 className="mt-1 text-3xl font-black text-orange-500">{result.overallSeverity}</h2><Gauge value={result.overallSeverity === '높음' ? 88 : result.overallSeverity === '중간' ? 62 : 28} /><p className="text-sm font-bold text-slate-600">학교 선생님 또는 상담자와 함께 계획을 세우면 도움이 되는 상태입니다.</p></Card><Card className="p-6"><p className="text-sm font-bold text-slate-500">분석 기반</p><div className="mt-4 space-y-3 text-sm font-extrabold text-slate-700"><p>설문 응답: 18문항</p><p>분석 요인: 6개</p><p>지역 인프라: {result.region}</p><p>추천기관: {recommendedCenters.length}곳</p></div></Card></section>{result.needsImmediateSupport && <Card className="mt-5 border-red-100 bg-red-50/80 p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-black text-red-500">심리·정서 상담 우선 권장</p><h2 className="mt-1 text-xl font-black text-slate-950">학습계획은 상담 연결과 함께 천천히 시작하는 것이 좋습니다.</h2><p className="mt-2 font-semibold text-slate-600">아래 연락처는 현재 지역을 먼저 보여주고, 이후 24시간 1388 상담을 함께 안내합니다.</p></div><div className="grid gap-2 sm:grid-cols-2 lg:min-w-[520px]">{highContacts.slice(0, 4).map((center) => <a href={`tel:${center.phone.replace(/[^0-9]/g, '')}`} key={center.id} className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-700 shadow-sm"><Phone size={15} className="mb-1 text-red-500" />{center.name}<br /><span className="text-blue-600">{center.phone}</span></a>)}</div></div></Card>}<section className="mt-5 grid gap-5 xl:grid-cols-[.95fr_1.05fr]"><Card className="p-6"><h2 className="text-xl font-black text-slate-950">학업중단 요인 분석</h2><div className="mt-4 h-80"><ResponsiveContainer><RadarChart data={radarData}><PolarGrid stroke="#dbe4f0" /><PolarAngleAxis dataKey="factor" tick={{ fill: '#64748b', fontSize: 12 }} /><Radar dataKey="value" stroke="#3B6FF5" fill="#3B6FF5" fillOpacity={0.3} /></RadarChart></ResponsiveContainer></div></Card><Card className="p-6"><h2 className="text-xl font-black text-slate-950">요인별 상세</h2><div className="mt-4 space-y-3">{result.factors.map((factor) => <div key={factor.id} className="rounded-2xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"><div className="flex items-center justify-between"><strong className="text-slate-900">{factor.label}</strong><SeverityBadge severity={factor.severity} /></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${factor.displayPercent}%`, background: factor.color }} /></div><p className="mt-2 text-sm font-bold text-slate-500">시각화 지표 {factor.displayPercent}% · 원점수 {factor.rawScore}/9 · {factor.description}</p></div>)}</div></Card></section><RoadmapPreview result={result} /><PriorityCards result={result} /><section className="mt-5"><h2 className="mb-4 text-2xl font-black text-slate-950">추천 지원기관</h2><div className="grid gap-4 xl:grid-cols-4">{recommendedCenters.map((center) => <CenterCard key={center.id} center={center} onDetail={() => setSelectedCenter(center)} />)}</div></section><EthicsNotice /> </div><CenterModal center={selectedCenter} onClose={() => setSelectedCenter(null)} onToast={onToast} /></DashboardShell>;
}

function RoadmapPreview({ result }: { result: AnalysisResult }) {
  const roadmap = buildRoadmapModel(result);
  return <Card className="mt-5 overflow-hidden p-6"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><p className="text-sm font-black text-blue-600">설문 결과 기반 4주 미리보기</p><h2 className="mt-1 text-2xl font-black text-slate-950">{roadmap.centerLabel}부터 시작하는 맞춤 로드맵</h2><p className="mt-2 font-semibold leading-7 text-slate-500">설문 결과로 선정된 경로만 4주 단위로 압축해 보여드립니다.</p></div><Button variant="secondary" onClick={() => navigate('/roadmap')}>계단형 로드맵 보기</Button></div><div className="mt-6 grid gap-4 xl:grid-cols-4">{roadmap.previewWeeks.map((week, index) => <div key={week.week} className={classNames('rounded-3xl p-5 ring-1 ring-inset transition hover:-translate-y-1 hover:shadow-lg', index === 0 ? 'bg-blue-50 ring-blue-100' : 'bg-slate-50 ring-slate-100')}><span className="text-sm font-black text-blue-600">{week.week}</span><h3 className="mt-1 font-black text-slate-950">{week.title}</h3><ul className="mt-3 space-y-2 text-sm font-bold text-slate-600">{week.items.map((item) => <li key={item}>• {item}</li>)}</ul></div>)}</div></Card>;
}

function PriorityCards({ result }: { result: AnalysisResult }) {
  const sorted = [...result.factors].sort((a, b) => b.rawScore - a.rawScore).slice(0, 4);
  return <section className="mt-5 grid gap-4 xl:grid-cols-4">{sorted.map((factor, index) => <Card key={factor.id} className="p-5"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{index === 0 ? '최우선' : `${index + 1}순위`}</span><h3 className="mt-4 text-lg font-black text-slate-950">{factor.label} 지원</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{factor.description}</p><p className="mt-3 text-sm font-black text-blue-600">추천 연결: {factor.id === 'emotion' ? '청소년상담복지센터 · 1388' : factor.id === 'academic' ? '꿈드림 검정고시반' : factor.id === 'career' ? '진로상담 · 직업체험' : '멘토링 · 상담 프로그램'}</p></Card>)}</section>;
}

function CenterCard({ center, onDetail }: { center: SupportCenter; onDetail: () => void }) {
  return <Card className="p-5"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">{center.type}</span><h3 className="mt-4 min-h-14 text-lg font-black leading-snug text-slate-950">{center.name}</h3><p className="mt-2 flex items-center gap-1 text-sm font-bold text-slate-500"><MapPin size={15} /> {center.distance}</p><p className="mt-3 text-sm font-bold leading-6 text-slate-600">{center.services.slice(0, 4).join(', ')}</p><p className="mt-2 text-sm font-black text-slate-800">{center.phone}</p><div className="mt-4 flex gap-2"><Button variant="secondary" className="px-3 py-2 text-xs" onClick={onDetail}>상세보기</Button><Button className="px-3 py-2 text-xs">상담 예약</Button></div></Card>;
}

function CenterModal({ center, onClose, onToast }: { center: SupportCenter | null; onClose: () => void; onToast: (message: string) => void }) {
  return <AnimatePresence>{center && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" onClick={onClose}><motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }} className="max-h-[88vh] w-[min(720px,96vw)] overflow-auto rounded-[30px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">{center.type}</span><h2 className="mt-3 text-2xl font-black text-slate-950">{center.name}</h2></div><button onClick={onClose} className="rounded-full bg-slate-100 p-2"><X /></button></div><p className="mt-5 rounded-2xl bg-slate-50 p-4 font-bold leading-7 text-slate-600">추천 이유: {center.reason}</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><InfoBlock title="제공 서비스" text={center.services.join(' · ')} /><InfoBlock title="운영 시간" text={center.hours} /><InfoBlock title="전화번호" text={center.phone} /><InfoBlock title="주소" text={center.address} /></div><p className="mt-4 text-xs font-bold text-slate-400">출처: <a className="text-blue-600 underline" href={center.sourceUrl} target="_blank" rel="noreferrer">{center.sourceLabel}</a>{center.representativeDemo ? ' · 지역 대표 예시' : ''}</p><div className="mt-6 flex flex-wrap gap-3"><Button><Phone size={17} /> 전화 상담하기</Button><Button variant="secondary" onClick={() => onToast('방문 상담 예약 요청이 저장되었습니다')}>방문 상담 예약</Button><Button variant="secondary" onClick={() => navigate('/report')}>리포트 공유하기</Button></div></motion.div></motion.div>}</AnimatePresence>;
}
function InfoBlock({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl border border-slate-100 p-4"><p className="text-xs font-black text-slate-400">{title}</p><p className="mt-1 font-bold leading-6 text-slate-700">{text}</p></div>; }

function EthicsNotice() { return <Card className="mt-5 border-blue-100 bg-blue-50/60 p-5"><p className="text-sm font-bold leading-7 text-slate-700">본 결과는 사용자의 자기진단 응답을 바탕으로 생성된 참고자료입니다. 최종 판단이나 진단이 아니며, 심리적 어려움이 크거나 도움이 급히 필요하다고 느껴질 경우 청소년상담 1388 또는 가까운 전문기관과 상담하세요.</p></Card>; }

function RoadmapPage() {
  const result = loadResult();
  const roadmap = buildRoadmapModel(result);
  return <DashboardShell active="/roadmap"><div className="dashboard-content"><section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-2xl"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15" /><div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/10" /><span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black">{result.finalType} 맞춤 계단형 로드맵</span><h1 className="relative mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em]">{roadmap.headline}</h1><p className="relative mt-4 max-w-3xl text-lg font-bold leading-8 text-blue-50">{roadmap.summary}</p></section><Card className="relative mt-6 overflow-hidden p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-sm font-black text-blue-600">설문 결과 선정 로드맵</p><h2 className="mt-1 text-2xl font-black text-slate-950">{roadmap.selectedPath.title}</h2><p className="mt-2 max-w-3xl font-semibold leading-7 text-slate-600">{roadmap.selectedPath.text}</p></div><span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-600">{roadmap.selectedPath.priorityLabel}</span></div><div className="roadmap-staircase mt-8">{roadmap.staircaseSteps.map((step, index) => <motion.div key={step.step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className={classNames('stair-step', `stair-step-${roadmap.selectedPath.tone}`, `stair-offset-${index}`)}><div className="stair-number">{step.step}</div><div><h3 className="text-xl font-black text-slate-950">{step.title}</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-500">{step.description}</p><ul className="mt-4 grid gap-2 md:grid-cols-3">{step.actions.map((action) => <li key={action} className="rounded-2xl bg-white/80 px-3 py-2 text-sm font-black text-slate-700 shadow-sm">{action}</li>)}</ul></div></motion.div>)}</div></Card><div className="mt-6 grid gap-5 xl:grid-cols-[.9fr_1.1fr]"><Card className="p-6"><h2 className="text-2xl font-black text-slate-950">이번 주 체크포인트</h2><p className="mt-2 font-semibold text-slate-500">큰 결정을 바로 내리지 말고, 선정된 로드맵의 첫 단계부터 작게 확인해보는 순서입니다.</p><div className="mt-5 grid gap-3">{roadmap.checkpoints.map((check) => <label key={check} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 font-bold text-slate-700"><input type="checkbox" className="h-5 w-5 accent-blue-600" /> {check}</label>)}</div></Card><Card className="p-6"><h2 className="text-2xl font-black text-slate-950">상담자와 확인할 질문</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{roadmap.questions.map((question) => <div key={question} className="rounded-3xl border border-blue-100 bg-blue-50/60 p-4 font-bold leading-7 text-slate-700">{question}</div>)}</div><Button className="mt-5" onClick={() => navigate('/report')}>상담 리포트와 함께 보기 <ArrowRight size={17} /></Button></Card></div></div></DashboardShell>;
}

export function centerMatchesSeverity(center: SupportCenter, severity: string) {
  if (severity === '전체') return true;
  if (severity === '상') return center.type.includes('상담') || center.type.includes('전문') || center.services.some((service) => service.includes('위기') || service.includes('상담'));
  if (severity === '중') return center.services.some((service) => service.includes('학습') || service.includes('진로') || service.includes('검정고시'));
  return center.services.some((service) => service.includes('정보') || service.includes('학습') || service.includes('진로')) || center.type.includes('꿈드림');
}

function CentersPage({ onToast }: { onToast: (message: string) => void }) {
  const [region, setRegion] = React.useState<RegionKey>('전북');
  const [type, setType] = React.useState('전체');
  const [severity, setSeverity] = React.useState('전체');
  const [selected, setSelected] = React.useState<SupportCenter | null>(null);
  const regionCenters = getCentersByRegion(region);
  const typeFiltered = regionCenters.filter((center) => type === '전체' || center.services.join('').includes(type.replace('지원', '')) || center.type.includes(type.replace('지원', '')));
  const visible = typeFiltered.filter((center) => centerMatchesSeverity(center, severity));
  const hasActiveFilter = type !== '전체' || severity !== '전체';
  return <DashboardShell active="/centers"><div className="dashboard-content"><h1 className="text-3xl font-black text-slate-950">혼자 해결하지 않아도 괜찮아요.</h1><p className="mt-2 font-semibold text-slate-500">지금 상황에 맞는 기관을 연결해드릴게요. 지역별 대표 예시를 먼저 보여드립니다.</p><Card className="mt-6 p-5"><div className="grid gap-3 lg:grid-cols-3"><Select label="지역 선택" value={region} onChange={(value) => setRegion(value as RegionKey)} options={regionOptions.map((item) => item.key)} /><Select label="지원 유형" value={type} onChange={setType} options={['전체', '상담지원', '학습지원', '진로지원', '경제·자립지원', '대안교육', '검정고시', '위기지원']} /><Select label="심각도 기준" value={severity} onChange={setSeverity} options={['전체', '상', '중', '하']} /></div></Card><div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]"><div className="grid gap-4 md:grid-cols-2">{visible.length > 0 ? visible.map((center) => <CenterCard key={center.id} center={center} onDetail={() => setSelected(center)} />) : <Card className="p-8 md:col-span-2"><Search className="text-blue-600" size={34} /><h2 className="mt-4 text-xl font-black text-slate-950">현재 필터와 정확히 맞는 대표 예시가 없습니다.</h2><p className="mt-2 font-semibold leading-7 text-slate-600">지역을 유지한 채 지원 유형이나 심각도 기준을 넓혀보세요. 도움이 급하다면 청소년상담 1388을 이용할 수 있습니다.</p><Button className="mt-4" onClick={() => { setType('전체'); setSeverity('전체'); }}>필터 초기화</Button></Card>}</div><Card className="relative min-h-[420px] overflow-hidden p-6"><h2 className="text-xl font-black text-slate-950">지도 데모 영역</h2><p className="mt-2 text-sm font-bold text-slate-500">선택한 지역의 대표 기관 위치를 데모로 표시합니다.</p><div className="map-demo mt-5">{visible.map((center, index) => <button key={center.id} onClick={() => setSelected(center)} className="map-pin" style={{ left: `${25 + (index * 23) % 55}%`, top: `${30 + (index * 19) % 45}%` }}><MapPin size={22} /></button>)}</div><p className="mt-4 text-xs font-bold text-slate-400">{hasActiveFilter ? `${severity} 기준과 ${type} 조건에 맞는 대표 예시 ${visible.length}곳을 보여줍니다.` : '실제 지도 API 없이 만든 시연용 지도 박스입니다.'}</p></Card></div></div><CenterModal center={selected} onClose={() => setSelected(null)} onToast={onToast} /></DashboardShell>;
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-xs font-black text-slate-500">{label}</span><span className="relative block"><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400" /></span></label>; }

function ReportPage({ onToast }: { onToast: (message: string) => void }) {
  const result = loadResult();
  return <DashboardShell active="/report"><div className="dashboard-content"><Card className="mx-auto max-w-5xl p-8"><div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between"><div><p className="font-black text-blue-600">AI 자기진단 상담 리포트</p><h1 className="mt-2 text-3xl font-black text-slate-950">이 리포트는 상담자와 함께 계획을 세우기 위한 참고자료입니다.</h1></div><FileText className="text-blue-600" size={44} /></div><div className="mt-6 grid gap-3 md:grid-cols-5">{[['이름 또는 별칭', result.userAlias], ['지역', result.region], ['완료일', '2026년 5월'], ['종합 심각도', result.overallSeverity], ['주요 유형', result.finalType]].map(([k, v]) => <div key={k} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-400">{k}</p><p className="mt-1 text-sm font-black text-slate-800">{v}</p></div>)}</div><div className="mt-8 overflow-hidden rounded-3xl border border-slate-100"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">요인</th><th className="p-4 text-right">시각화 지표</th><th className="p-4">심각도</th><th className="p-4">권장 대응</th></tr></thead><tbody>{result.factors.map((factor) => <tr key={factor.id} className="border-t border-slate-100"><td className="p-4 font-black">{factor.label}</td><td className="p-4 text-right font-black">{factor.displayPercent}%<span className="block text-xs text-slate-400">원점수 {factor.rawScore}/9</span></td><td className="p-4"><SeverityBadge severity={factor.severity} /></td><td className="p-4 font-semibold text-slate-600">{factor.description}</td></tr>)}</tbody></table></div><p className="mt-6 rounded-3xl bg-blue-50 p-5 font-bold leading-8 text-slate-700">{result.aiSummary}</p><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => onToast('리포트가 저장되었습니다')}><Download size={17} /> PDF로 저장</Button><Button variant="secondary" onClick={() => onToast('상담자 공유 링크가 준비되었습니다')}><Share2 size={17} /> 상담자에게 공유</Button><Button variant="secondary" onClick={() => { clearDemoStateKeys(); navigate('/survey'); }}><RefreshCw size={17} /> 다시 진단하기</Button></div></Card></div></DashboardShell>;
}

function InsightsPage() {
  const reasonData = [{ name: '심리·정신적 문제', value: 32.4 }, { name: '원하는 것을 배우기 위해', value: 25.2 }, { name: '부모님의 권유', value: 22.4 }, { name: '학교 분위기 불일치', value: 18.2 }, { name: '시간을 자유롭게 쓰고 싶음', value: 17.9 }, { name: '특기 활용', value: 17.7 }, { name: '친구 문제', value: 16.6 }];
  const insights = ['학업중단 청소년은 하나의 집단이 아니다.', '복학만이 유일한 해법은 아니다.', '지원 미스매치가 존재한다.', '지역별 지원기관 접근성이 중요하다.'];
  return <DashboardShell active="/insights"><div className="dashboard-content"><h1 className="text-3xl font-black text-slate-950">데이터 분석 인사이트</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{[['전체 학업중단률', '1.1%'], ['고등학교 학업중단률', '2.1%'], ['특성화고 학업중단률', '4.2%']].map(([label, value]) => <Card key={label} className="p-6"><p className="font-bold text-slate-500">{label}</p><strong className="mt-2 block text-4xl font-black text-blue-600">{value}</strong></Card>)}</div><Card className="mt-5 p-6"><h2 className="text-xl font-black">학교 밖 청소년 특성</h2><div className="mt-4 grid gap-4 md:grid-cols-4">{[['고등학교 시기 중단', '67.2%'], ['검정고시 준비 계획', '70.7%'], ['진로계획 방법 모름', '42.4%'], ['센터 정보 미제공', '45.3%']].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-bold text-slate-500">{label}</p><p className="text-2xl font-black text-slate-950">{value}</p></div>)}</div></Card><Card className="mt-5 p-6"><h2 className="text-xl font-black">학업중단 이유</h2><div className="mt-4 h-80"><ResponsiveContainer><BarChart data={reasonData} layout="vertical" margin={{ left: 90 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="value" fill="#3B6FF5" radius={[0, 10, 10, 0]} /></BarChart></ResponsiveContainer></div></Card><div className="mt-5 grid gap-4 md:grid-cols-2">{insights.map((item, index) => <Card key={item} className="p-6"><h3 className="text-xl font-black text-slate-950">{index + 1}. {item}</h3><p className="mt-3 font-semibold leading-7 text-slate-600">{index === 0 ? '중단 이유와 필요한 지원이 다르기 때문에 개인별 경로 설계가 필요하다.' : index === 1 ? '검정고시, 대안교육, 직업훈련, 진로전환 등 다양한 복귀 경로가 필요하다.' : index === 2 ? '필요한 지원과 실제 이용 가능한 지원 사이의 간격을 줄여야 한다.' : '같은 유형이라도 거주 지역에 따라 현실적인 연결 방식이 달라진다.'}</p></Card>)}</div></div></DashboardShell>;
}

function App() {
  const path = usePath();
  const [toast, setToast] = React.useState('');
  let page: React.ReactNode;
  if (path === '/survey') page = <SurveyPage />;
  else if (path === '/analyzing') page = <AnalyzingPage />;
  else if (path === '/result') page = <ResultPage onToast={setToast} />;
  else if (path === '/roadmap') page = <RoadmapPage />;
  else if (path === '/centers') page = <CentersPage onToast={setToast} />;
  else if (path === '/report') page = <ReportPage onToast={setToast} />;
  else if (path === '/insights') page = <InsightsPage />;
  else page = <LandingPage />;
  return <><AnimatePresence mode="wait">{page}</AnimatePresence><AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast('')} />}</AnimatePresence></>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
