import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import HeroGlobe from '../components/HeroGlobe';

const NoticePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastHiddenTime = localStorage.getItem('hideNoticePopup');
    if (lastHiddenTime) {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - parseInt(lastHiddenTime) < oneDay) {
        return;
      }
    }
    // Small delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dontShowToday) {
      localStorage.setItem('hideNoticePopup', new Date().getTime().toString());
    }
    setIsVisible(false);
  };

  const handlePopupClick = () => {
    navigate('/1_apply/notices/1');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-10 right-10 z-[200] w-[320px] md:w-[400px] bg-white text-black shadow-2xl overflow-hidden"
          onClick={handlePopupClick}
        >
          {/* Header */}
          <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Notice</span>
            <button 
              onClick={handleClose}
              className="hover:scale-110 transition-transform p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Content Preview */}
          <div className="p-8 space-y-4 cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-black text-white text-[8px] font-black uppercase">Important</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">모집</span>
            </div>
            <h3 className="text-xl font-black leading-tight group-hover:underline underline-offset-4 decoration-1">[안내] Odyssey-X 1기 Moderator(Staff) 공개 모집</h3>
            <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
              ✨Global Accelerating Program, Odyssey-X에서 같이 일할 "Staff"을 모집 중입니다! 
              글로벌 창업 생태계의 중심에서 실전 운영 경험을 쌓고 싶은 분들의 많은 지원 바랍니다.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold gap-2">
              Learn More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </div>
          </div>

          {/* Footer Checkbox */}
          <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-100 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <input 
              type="checkbox" 
              id="dontShow" 
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              className="w-4 height-4 accent-black cursor-pointer"
            />
            <label htmlFor="dontShow" className="text-[11px] font-bold text-zinc-500 cursor-pointer select-none">
              오늘 하루 그만보기
            </label>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TimelineItem = ({ item, type }: { item: any, type: 'sprint1' | 'sprint2' }) => {
  return (
    <div 
      className={`flex-none ${type === 'sprint1' ? 'w-64 md:w-80' : 'w-64 md:w-80'} border-r border-white/5 p-8 md:p-12 transition-all duration-300 bg-white/10 text-white hover:bg-white hover:text-black active:bg-white active:text-black cursor-pointer group`}
    >
      {type === 'sprint1' ? (
        <span className="block font-mono text-xs mb-8 md:mb-10 font-black italic group-hover:opacity-100">{item.d}</span>
      ) : (
        <div className="flex justify-between items-start mb-8 md:mb-10">
          <span className="font-mono text-xs font-black italic uppercase tracking-widest group-hover:opacity-100">{item.w}</span>
          <span className="text-xs font-bold group-hover:opacity-100">{item.d}</span>
        </div>
      )}
      <h4 className="text-lg md:text-2xl font-black leading-tight tracking-tighter">{item.s}</h4>
    </div>
  );
};

const Apply: React.FC = () => {

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openComposition, setOpenComposition] = useState<'mentors' | 'benefits' | 'schedule'>('mentors');

  // Page-wide scroll progress for HeroGlobe
  const { scrollYProgress } = useScroll();
  const globeOpacity = useTransform(scrollYProgress, [0, 0.15], [0.6, 0]);

  // 타임라인 관련 Ref 및 상태
  const sprint1Ref = useRef<HTMLDivElement>(null);
  const sprint2Ref = useRef<HTMLDivElement>(null);
  const [s1ManualProgress, setS1ManualProgress] = useState(0);
  const [s2ManualProgress, setS2ManualProgress] = useState(0);

  const { scrollYProgress: s1ScrollProgress } = useScroll({
    target: sprint1Ref,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: s2ScrollProgress } = useScroll({
    target: sprint2Ref,
    offset: ["start end", "end start"]
  });

  // 수동 스크롤 위치를 프로그레스로 변환하는 함수
  const handleManualScroll = (ref: React.RefObject<HTMLDivElement | null>, setProgress: (val: number) => void) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setProgress(isNaN(progress) ? 0 : progress);
    }
  };

  // 수직 스크롤에 따른 미세한 '드리프트' 효과
  const s1Drift = useSpring(useTransform(s1ScrollProgress, [0, 1], [50, -50]), { stiffness: 50, damping: 20 });
  const s2Drift = useSpring(useTransform(s2ScrollProgress, [0, 1], [80, -80]), { stiffness: 50, damping: 20 });

  // 수동 스크롤을 위한 유틸리티 함수
  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Grab to Scroll (데스크탑 마우스 드래그) 구현
  const setupGrabScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current) return;
      isDown = true;
      ref.current.classList.add('active');
      startX = e.pageX - ref.current.offsetLeft;
      scrollLeft = ref.current.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 2;
      ref.current.scrollLeft = scrollLeft - walk;
    };

    const el = ref.current;
    if (el) {
      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('mouseleave', onMouseLeave);
      el.addEventListener('mouseup', onMouseUp);
      el.addEventListener('mousemove', onMouseMove);
      return () => {
        el.removeEventListener('mousedown', onMouseDown);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.removeEventListener('mouseup', onMouseUp);
        el.removeEventListener('mousemove', onMouseMove);
      };
    }
  };

  useEffect(() => {
    const cleanup1 = setupGrabScroll(sprint1Ref);
    const cleanup2 = setupGrabScroll(sprint2Ref);

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black scroll-smooth overflow-x-hidden word-keep-all">
      <NoticePopup />
      {/* HEADER: Glass UI Minimalist */}
      <header className="fixed top-0 w-full z-[100] px-6 py-3 md:px-8 md:py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="h-6 md:h-8 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <img src="/odyssey.png" alt="Odyssey Logo" className="h-full w-auto brightness-0 invert" />
        </div>
        <nav className="flex gap-3 md:gap-10 text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.3em]">
          <a href="/1_apply/notices" className="hover:text-zinc-400 transition-colors">공지사항</a>
          <a href="#section-1" className="hover:text-zinc-400 transition-colors hidden sm:block">Intro</a>
          <a href="#section-prize" className="hover:text-zinc-400 transition-colors hidden sm:block">Prize</a>
          <a href="#section-partners" className="hover:text-zinc-400 transition-colors">Partners</a>
          <a href="#section-4" className="hover:text-zinc-400 transition-colors">Timeline</a>
          <a href="#section-8" className="hover:text-zinc-400 transition-colors underline underline-offset-8 decoration-1">Apply</a>
        </nav>
      </header>

      {/* HERO: Aggressive Typography */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 lg:px-20 border-b border-zinc-900 pb-20">
        {/* GLOBE IS NOW CONSTRAINED TO THE HERO SECTION */}
        <motion.div 
          style={{ opacity: globeOpacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <HeroGlobe />
        </motion.div>

        <div className="relative z-10 pt-10 md:pt-36">
          <div className="flex items-center gap-4 md:gap-6 md:mt-10 mb-12 lg:mb-20 py-4 overflow-visible">
            <img src="/New_Hufs_logo.png" alt="HUFS" className="h-[40px] lg:h-[60px] w-auto block object-contain overflow-visible" style={{ filter: 'brightness(0) invert(1)' }} />
            <span className="text-white font-black text-xl md:text-2xl tracking-tighter italic">x</span>
            <img src="/rakuten.png" alt="Rakuten" className="h-7 lg:h-11 w-auto block object-contain overflow-visible brightness-0 invert opacity-90" />
            <span className="text-zinc-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] ml-2 md:ml-4 font-black">Presents</span>
          </div>
          
          <div className="mb-10 md:mb-12 mt-8 md:mt-0 -ml-1 md:-ml-4">
            <img src="/odyssey.png" alt="Odyssey" className="w-[70vw] lg:w-[45vw] brightness-0 invert" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-4 md:space-y-6">
              <p className="text-xl md:text-4xl font-light leading-[1.4] tracking-tight max-w-3xl">
                미지의 목표 "X"를 향한 가장 <span className="font-black italic">창업가다운 모험</span><br className="hidden md:block" />
                <span className="block mt-4 md:mt-6">8주 후 당신의 팀은 투자자 앞에 서게 됩니다</span>
              </p>
            </div>
                      <div className="lg:col-span-5 lg:text-right">
                        <p className="text-zinc-200 font-black font-mono text-sm md:text-lg uppercase tracking-[0.4em] mb-4 md:mb-6">1기 참가팀 모집</p>
                        <a href="#section-8" className="inline-block px-8 py-4 md:px-10 md:py-5 bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest hover:bg-zinc-200 transition-all">
                          Apply Now
                        </a>
                      </div>
            
          </div>
        </div>
      </section>

      {/* PROGRAM INTRO: Non-Box Layout */}
      <section id="section-1" className="py-20 md:py-32 px-6 lg:px-20 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
          {/* Top Part: Title and Main Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
                스타트업을 <span className="text-zinc-500 font-bold">'진짜로'</span> 해보고 싶은 팀을 위한 8주 BATCH
              </h2>
            </div>
            <div className="lg:col-span-5 space-y-4 md:space-y-6 text-zinc-400 font-medium text-base md:text-lg leading-relaxed lg:max-w-md lg:ml-auto">
              <p className="text-white font-black italic underline underline-offset-8 decoration-1">
                단순히 기획서만 내고 끝나는 공모전이 아닙니다.
              </p>
              <p>
                Odyssey-X는 한국외국어대학교와 Rakuten Symphony가 주최하는 실전 배치형 창업 육성 프로그램입니다.
              </p>
              <p>
                '한 방'을 목표하는 팀보다, 8주 동안 고객을 만나고 퍼포먼스를 증명할 수 있는 팀을 찾습니다.
              </p>
            </div>
          </div>

          {/* Bottom Part: 01, 02, 03 Horizontal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pt-10 md:pt-12 border-t border-zinc-900">
            <div className="space-y-6 pb-4 border-b border-zinc-800">
              <span className="text-3xl md:text-4xl font-black italic block text-white">01.</span>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">MVP 개발 집중</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">기획-구현-배포-회고 사이클을 최소 3회 반복하며 시장에서 검증된 제품을 개발합니다.</p>
              </div>
            </div>
            <div className="space-y-6 pb-4 border-b border-zinc-800">
              <span className="text-3xl md:text-4xl font-black italic block text-white">02.</span>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">Cross-Campus 팀빌딩</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">소속 대학을 넘어선 최고의 기획력과 개발/디자인 역량을 결합한 최적의 팀빌딩을 지원합니다.</p>
              </div>
            </div>
            <div className="space-y-6 pb-4 border-b border-zinc-800">
              <span className="text-3xl md:text-4xl font-black italic block text-white">03.</span>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">총 700만 원 규모 지원</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">최고 훈격의 총장상 수여 및 창업 지원금 선정의 기회를 제공합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECRUITMENT GROUPS: Stark Two-Column Layout */}
      <section id="section-2" className="py-20 md:py-32 px-6 lg:px-20 border-b border-black bg-white text-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <h4 className="text-2xl md:text-5xl font-black uppercase tracking-tighter italic">글로벌 IR Pitching을<br className="hidden lg:block" /> 향한 여정</h4>
            <p className="font-black text-lg md:text-2xl tracking-tight leading-none text-black">
              다음 두 그룹의 <span className="underline underline-offset-8 decoration-black/20">참가자를 모집합니다.</span>
            </p>
          </div>

          <div className="lg:col-span-7 space-y-10 md:space-y-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Group A</span>
                <h5 className="text-xl md:text-2xl font-bold italic">프로덕트 또는 아이디어를 가진 예비 청년 창업팀</h5>
                <p className="text-[10px] md:text-xs text-zinc-500 font-medium">(대학 제한 없음)</p>
              </div>
              <div className="space-y-2 pt-6 md:pt-8 border-t border-black/10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Group B</span>
                <h5 className="text-xl md:text-2xl font-bold italic">프로덕트 미보유 예비 팀원 참가자</h5>
                <p className="text-[10px] md:text-xs text-zinc-500 font-medium">(한국외대 재/휴학생 및 졸업생, 대학원생, 교직원 참여 가능)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ODYSSEY INFO & BENEFITS: Stark Editorial Black Section */}
      <section id="section-3" className="py-20 md:py-32 px-6 lg:px-20 border-b border-zinc-900 bg-black text-white">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
          
          {/* 3. 오디세이 정보 */}
          <div className="space-y-12 md:space-y-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8 border-b border-zinc-800 pb-10 md:pb-12">
              <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter">Odyssey-X 정보</h3>
              <div className="text-left lg:text-right space-y-1">
                <p className="text-white text-sm md:text-base font-bold tracking-tight">프로그램 진행 기간: 2026.05.02(토) - 2026.06.20(토)</p>
                <p className="text-zinc-600 text-xs md:text-sm font-medium">Final Demo Day: 2026.06.27(토)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { 
                  title: "Global 트랙", 
                  sub: "(글로벌 시장 진출/4명의 전문 멘토님의 강연)",
                  number: "01",
                  desc: "Rakuten Symphony 및 글로벌 멘토들과 함께 일본/동남아 등 글로벌 진출 가설을 세우고 스케일업 전략을 점검받습니다. 세계로 가는 스타트업 항해의 기초 체력을 다집니다."
                },
                { 
                  title: "Product 트랙", 
                  sub: "(개발자 없이 제품 만들기)",
                  number: "02",
                  desc: "비전공자 팀의 진입 장벽을 없앴습니다. 노코드(No-code) 툴을 활용해 실제 작동하는 MVP를 만듭니다. 서류상의 코드 리뷰가 아닌, 세션 현장에서 불시 점검(Live Edit)을 통해 기술과 실행력을 검증합니다."
                },
                { 
                  title: "Business Model 트랙", 
                  sub: "(시장에서 검증하기)",
                  number: "03",
                  desc: "실질적인 시장 검증을 지향합니다. 실제 동일 시장 종사자를 만나고, 목표 고객 50명 이상으로부터 피드백을 받아 비즈니스 모델을 검증합니다. 탄탄한 데이터를 기반으로 투자자를 설득할 수 있는 IR Deck을 완성합니다."
                }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="p-6 md:p-10 space-y-4 md:space-y-8 bg-zinc-900/30 border border-zinc-800 rounded-none hover:bg-zinc-900/80 transition-all duration-500 group relative"
                >
                  <div className="space-y-4">
                    <div className="text-white text-3xl md:text-5xl font-black italic transition-all duration-500">
                      {item.number}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg md:text-xl font-black tracking-tight uppercase italic transition-all">{item.title}</h4>
                      <span className="text-zinc-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] block">{item.sub}</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs md:text-sm leading-relaxed transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 오디세이 혜택 */}
          <div id="section-prize" className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 pt-20 md:pt-32 border-t border-zinc-900">
            <div className="lg:col-span-5 flex flex-row lg:flex-col justify-between items-start lg:items-start gap-6 md:gap-8">
              <h3 className="text-2xl md:text-4xl lg:text-6xl font-black uppercase tracking-tighter shrink-0">Odyssey-X 혜택</h3>
              <div className="inline-block p-4 lg:p-8 bg-white text-black">
                <span className="block text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-1 lg:mb-2 opacity-50">Total Prize Pool</span>
                <span className="text-lg lg:text-4xl font-black tracking-tighter italic">700만원 상당</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10 md:space-y-12">
              <div className="space-y-6 md:space-y-8">
                <h4 className="text-lg md:text-xl font-black uppercase tracking-widest text-zinc-700 flex items-center gap-4">
                  상금 및 훈격 <div className="h-[1px] flex-grow bg-zinc-900"></div>
                </h4>
                <div className="space-y-5 md:space-y-6 divide-y divide-zinc-900">
                  {[
                    { label: "🥇 대상 (1팀)", val: "한국외대 총장상 + 500만 원" },
                    { label: "🥈 최우수상 (1팀)", val: "부총장상 + 100만 원" },
                    { label: "🥉 우수상 (2팀)", val: "단장상 + 각 50만 원" }
                  ].map((award, i) => (
                    <div key={i} className="pt-5 md:pt-6 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                      <span className="text-base md:text-lg font-bold italic">{award.label}</span>
                      <span className="text-zinc-400 font-medium text-xs md:text-base">{award.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8 pt-10 md:pt-12 border-t border-zinc-900">
                <div className="space-y-1 md:space-y-2">
                  <span className="text-zinc-600 font-mono text-[9px] md:text-[10px] uppercase tracking-widest block italic">Bonus</span>
                  <p className="font-bold text-xs md:text-base">부상: Rakuten Symphony 활동증명서</p>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <span className="text-zinc-600 font-mono text-[9px] md:text-[10px] uppercase tracking-widest block italic">Access</span>
                  <p className="font-bold text-xs md:text-base">24시간 코워킹스페이스 제공</p>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <span className="text-zinc-600 font-mono text-[9px] md:text-[10px] uppercase tracking-widest block italic">Certification</span>
                  <p className="font-bold text-xs md:text-base">Odyssey 배치 수료증</p>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <span className="text-zinc-600 font-mono text-[9px] md:text-[10px] uppercase tracking-widest block italic">Benefit</span>
                  <p className="font-bold text-xs md:text-base">Odyssey-X Alumni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS & SPONSORS: Stark White Section */}
      <section id="section-partners" className="py-20 md:py-32 px-6 lg:px-20 border-b border-black bg-white text-black text-center">
        <div className="max-w-4xl mx-auto space-y-24 md:space-y-40">
          
          {/* 오디세이 주최 */}
          <div className="space-y-10 md:space-y-12">
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Odyssey-X 주최</h3>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-16 md:gap-32 mt-6">
              <div className="space-y-3 md:space-y-4">
                <img src="/rakuten.png" alt="Rakuten" className="h-[70px] md:h-[84px] w-auto mx-auto [filter:brightness(0)_saturate(100%)_invert(17%)_sepia(88%)_stronger-red-filter]" style={{ filter: 'invert(15%) sepia(95%) saturate(6932%) hue-rotate(354deg) brightness(93%) contrast(105%)' }} />
              </div>
              <div className="space-y-3 md:space-y-4">
                <img src="/hufs_logo.png" alt="HUFS" className="h-[60px] md:h-[72px] w-auto mx-auto" />
              </div>
            </div>
          </div>

          {/* 오디세이 파트너 및 스폰서사 */}
          <div className="space-y-16 md:space-y-20 pt-20 md:pt-32 border-t border-black/10">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none">Partners & Sponsors</h3>
            </div>
            
            <div className="space-y-20 md:space-y-24">
              <div className="space-y-8 md:space-y-10">
                <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.5em] text-zinc-400 underline decoration-zinc-100 underline-offset-8">파트너사</h4>
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-x-12 md:gap-x-20 gap-y-6 md:gap-y-8 pt-4 md:pt-8">
                  <img src="/Alicorn.jpeg" alt="Alicorn" className="h-[36px] md:h-[54px] w-auto transition-all duration-300" />
                  <img src="/shinhanfuturelabslogo.png" alt="Shinhan" className="h-6 md:h-10 w-auto transition-all duration-300" />
                  <img src="/Jones_and_Rocket.png" alt="Jones and Rocket" className="h-[86px] md:h-[138px] w-auto transition-all duration-300" />
                </div>
              </div>

              <div className="space-y-8 md:space-y-10">
                <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.5em] text-zinc-400 underline decoration-zinc-100 underline-offset-8">스폰서사</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
                  <div className="space-y-3 md:space-y-4 pt-4">
                    <p className="text-[27px] md:text-[36px] font-black" style={{ fontFamily: 'Arial, sans-serif' }}>G-RISE</p>
                    <p className="text-lg md:text-xl font-bold italic">정부 RISE 사업단</p>
                    <p className="text-[10px] md:text-xs text-zinc-400 font-bold">(상금 지원)</p>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <img src="/rakuten.png" alt="Rakuten" className="h-[52px] md:h-[73px] w-auto mx-auto" style={{ filter: 'invert(15%) sepia(95%) saturate(6932%) hue-rotate(354deg) brightness(93%) contrast(105%)' }} />
                    <p className="text-[10px] md:text-xs text-zinc-400 font-bold">(운영자금지원)</p>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <img src="/Alicorn.jpeg" alt="Alicorn" className="h-[36px] md:h-[54px] w-auto transition-all duration-300 mx-auto" />
                    <p className="text-[10px] md:text-xs text-zinc-400 font-bold">(공간 지원)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE: Architectural Sprint Layout */}
      <section id="section-4" className="py-20 md:py-32 border-b border-zinc-900 overflow-hidden bg-black text-white">
        <div className="px-6 lg:px-20 space-y-20 md:space-y-32">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
            <h2 className="text-4xl md:text-[8vw] font-black uppercase leading-[0.8] tracking-tighter">Timeline</h2>
            <div className="text-left lg:text-right space-y-1">
              <p className="font-mono text-zinc-500 text-[10px] tracking-widest uppercase">Batch #1 / 2026</p>
              <p className="text-lg md:text-xl font-bold tracking-tight">2026.05.02 - 06.27</p>
            </div>
          </div>

          {/* SPRINT #1: EMBARK */}
          <div className="space-y-6 md:space-y-8 relative">
            <div className="flex justify-between items-end">
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-zinc-400">
                  <span className="text-white">Sprint #1:</span> Embark
                </h3>
                <p className="text-zinc-500 text-sm font-medium italic">모집 및 팀 빌딩 (2026.03 ~ 04.29)</p>
              </div>
              {/* Navigation Buttons */}
              <div className="flex gap-2 mb-1">
                <button onClick={() => scroll(sprint1Ref, 'left')} className="p-2 md:p-3 border border-zinc-800 hover:bg-white hover:text-black transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button onClick={() => scroll(sprint1Ref, 'right')} className="p-2 md:p-3 border border-zinc-800 hover:bg-white hover:text-black transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
            
            <div 
              ref={sprint1Ref}
              onScroll={() => handleManualScroll(sprint1Ref, setS1ManualProgress)}
              className="relative border-y border-zinc-900 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
            >
              <motion.div 
                style={{ x: s1Drift }}
                className="flex gap-0 min-w-max"
              >
                {[
                  { d: "03.11", s: "지원 접수 시작" },                  { d: "03.25", s: "매칭데이 (팀 빌딩)" },
                  { d: "04.09", s: "최종 마감" },
                  { d: "04.14", s: "서류 심사" },
                  { d: "04.15", s: "1차 합격자 발표" },
                  { d: "04.21", s: "심층심사(멘토단)" },
                  { d: "04.22", s: "최종 선발 발표" },
                  { d: "04.29", s: "네트워킹 파티" }
                ].map((item, i) => (
                  <TimelineItem key={i} item={item} type="sprint1" />
                ))}
              </motion.div>
            </div>
            {/* Slide Bar Indicator */}
            <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                animate={{ scaleX: s1ManualProgress }}
                className="h-full bg-white origin-left"
              />
            </div>
          </div>

          {/* SPRINT #2: EXPEDITION */}
          <div className="space-y-6 md:space-y-8 relative">
            <div className="flex justify-between items-end">
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-zinc-400">
                  <span className="text-white">Sprint #2:</span> Expedition
                </h3>
                <p className="text-zinc-500 text-sm font-medium italic">8주간의 몰입 (2026.05.02 ~ 06.27)</p>
              </div>
              {/* Navigation Buttons */}
              <div className="flex gap-2 mb-1">
                <button onClick={() => scroll(sprint2Ref, 'left')} className="p-2 md:p-3 border border-zinc-800 hover:bg-white hover:text-black transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button onClick={() => scroll(sprint2Ref, 'right')} className="p-2 md:p-3 border border-zinc-800 hover:bg-white hover:text-black transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div 
              ref={sprint2Ref}
              onScroll={() => handleManualScroll(sprint2Ref, setS2ManualProgress)}
              className="relative border-y border-zinc-900 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
            >
              <motion.div 
                style={{ x: s2Drift }}
                className="flex gap-0 min-w-max"
              >
                {[
                  { w: "W1", d: "05.02", s: "Kick-off" },
                  { w: "W2", d: "05.09", s: "MVP Theory" },
                  { w: "W3", d: "05.16", s: "Product Clinic" },
                  { w: "W4", d: "05.23", s: "Global Mindset" },
                  { w: "W5", d: "05.30", s: "Scale-up Clinic" },
                  { w: "W6", d: "06.06", s: "Pitching Skill (BM)" },
                  { w: "W7", d: "06.13", s: "Pitching Skill (IR)" },
                  { w: "W8", d: "06.20", s: "Rehearsal" },
                  { w: "W9", d: "06.27", s: "🏆 Grand Demo Day" }
                ].map((item, i) => (
                  <TimelineItem key={i} item={item} type="sprint2" />
                ))}
              </motion.div>
            </div>
            {/* Slide Bar Indicator */}
            <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                animate={{ scaleX: s2ManualProgress }}
                className="h-full bg-white origin-left"
              />
            </div>
          </div>

          {/* SPRINT #3: BEYOND ODYSSEY */}
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-zinc-400">
                <span className="text-white">Sprint #3:</span> Beyond Odyssey
              </h3>
              <p className="text-zinc-500 text-sm font-medium italic">Alumni 활동 (2026.06.27 이후)</p>
            </div>
            <div className="pt-8 md:pt-12 border-t border-zinc-900 max-w-3xl">
              <div className="flex gap-6 md:gap-8 items-start">
                <span className="text-3xl md:text-4xl font-black italic text-zinc-800 shrink-0">06.27~</span>
                <div className="space-y-2">
                  <h4 className="text-lg md:text-xl font-bold italic">지속적인 성장을 위한 네트워킹 활동</h4>
                  <p className="text-zinc-500 text-xs md:text-base leading-relaxed font-medium">Odyssey-X Alumni 활동</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 md:pt-4 opacity-30 text-[10px] md:text-xs font-medium italic">
            ※ 상기 일정은 일부 변동 가능성 있으며, 변동시 별도안내 예정
          </div>
        </div>
      </section>

      {/* PROGRAM COMPOSITION: Stark White Section */}
      <section id="section-composition" className="py-16 md:py-24 px-6 lg:px-20 border-b border-black bg-white text-black">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter">프로그램 구성 상세 소개</h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Toggle Tabs */}
            <div className="flex border-b border-black max-w-2xl mx-auto">
              {['mentors', 'benefits', 'schedule'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setOpenComposition(tab as any)}
                  className={`flex-1 py-3 md:py-4 text-[9px] md:text-sm font-black uppercase tracking-widest transition-all ${openComposition === tab ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
                >
                  {tab === 'mentors' ? '1기 멘토링' : tab === 'benefits' ? '1기 Benefit' : '1기 선발 일정'}
                </button>
              ))}
            </div>

            {/* Content Area with Animation */}
            <div className="min-h-[250px] md:min-h-[300px] relative">
              {openComposition === 'mentors' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 md:py-12"
                >
                  <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {[
                      { position: "Rakuten Symphony 임원", name: "손승현(RYAN)", image: "/Ryan_pic.jpeg" },
                      { position: "jones & rocket investment 공동창업자 및 대표이사", name: "원정욱", image: "/jones&rocket_ceo.jpg" },
                      { position: "알리콘 주식회사 대표이사", name: "조민희", image: "/alicorn_cofounder_ceo.jpg" },
                      { position: "SHINHAN BANK JAPAN 부장", name: "김영민", image: "/shinhan_future_labs_manager.jpg" }
                    ].map((mentor, i) => (
                      <div key={i} className="w-[calc(50%-12px)] md:w-32 lg:w-40 space-y-3 group text-center">
                        <div className="aspect-[3/4] bg-zinc-100 grayscale group-hover:grayscale-0 transition-all duration-500 relative overflow-hidden border border-zinc-200">
                          {mentor.image ? (
                            <img 
                              src={mentor.image} 
                              alt={mentor.name} 
                              className="absolute inset-0 w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M19 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black tracking-widest text-zinc-400 leading-tight min-h-[2.5em] flex items-center justify-center">{mentor.position}</p>
                          <h4 className="text-xs font-black uppercase tracking-tighter">{mentor.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {openComposition === 'benefits' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 md:space-y-8 py-4 flex justify-center"
                >
                  <div className="space-y-5 md:space-y-6 w-full max-w-xl">
                    {[
                      { label: "Core", text: "글로벌 IR 역량 강화" },
                      { label: "Support", text: "총 상금 700만원" },
                      { label: "Access", text: "Alicorn 코워킹스페이스" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <span className="text-zinc-400 font-mono text-[9px] md:text-[10px] uppercase tracking-widest block">{item.label}</span>
                        <p className="text-lg md:text-2xl font-black italic underline decoration-zinc-200 underline-offset-4 leading-tight">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {openComposition === 'schedule' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 md:space-y-6 py-4 flex justify-center"
                >
                  <div className="space-y-3 md:space-y-4 text-base md:text-xl font-bold tracking-tight w-full max-w-xl">
                    <p><span className="text-zinc-400 mr-3 md:mr-4 font-mono text-xs md:text-sm">01</span> 지원 마감: 2026.04.09(목)</p>
                    <p><span className="text-zinc-400 mr-3 md:mr-4 font-mono text-xs md:text-sm">02</span> 서류 심사: 2026.04.14(화)</p>
                    <p><span className="text-zinc-400 mr-3 md:mr-4 font-mono text-xs md:text-sm">03</span> 1차 합격자 발표: 2026.04.15(수)</p>
                    <p><span className="text-zinc-400 mr-3 md:mr-4 font-mono text-xs md:text-sm">04</span> 심층심사(멘토단): 2026.04.21(화)</p>
                    <p className="pt-4 border-t border-zinc-100 text-black font-black italic"><span className="text-zinc-400 mr-3 md:mr-4 font-mono text-xs md:text-sm not-italic">FIN</span> 최종 선발팀 발표: 2026.04.22(토)</p>
                    <p className="pt-6 opacity-40 text-[9px] md:text-[10px] font-bold italic">※ 상기 일정은 일부 변동 가능성 있으며, 변동시 별도안내 예정</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SELECTION: Brutalist List */}
      <section id="section-6" className="py-20 md:py-32 px-6 lg:px-20 border-b border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 md:mb-12 leading-none">Selection<br />Schedule</h2>
          </div>

          <div className="lg:col-span-7 space-y-0 divide-y divide-zinc-900 border-y border-zinc-900">
          {[
            { s: "매칭 데이 지원 마감", d: "03.24(화)", active: false },
            { s: "매칭 데이", d: "03.25(수)", active: false },
            { s: "1기 지원 마감", d: "04.09(목)", active: true },
            { s: "1차 발표", d: "04.15(수)", active: false },
            { s: "심층 심사", d: "04.21(화)", active: false },
            { s: "최종 발표", d: "04.22(토)", active: false }          ].map((item, i) => (
            <div key={i} className={`py-6 md:py-10 flex justify-between items-center group ${item.active ? 'text-white' : 'text-zinc-400 hover:text-white'} transition-colors cursor-default`}>
              <div className="flex items-center gap-4 md:gap-8">
                <span className="text-[10px] md:text-xs opacity-50 font-black">0{i+1}</span>
                <h4 className="text-xl md:text-3xl font-black uppercase tracking-tighter">{item.s}</h4>
              </div>
              <span className="font-mono text-sm md:text-lg tracking-tighter shrink-0">{item.d}</span>
            </div>
          ))}
          <div className="py-6 opacity-30 text-[10px] md:text-xs font-medium italic">
            ※ 상기 일정은 일부 변동 가능성 있으며, 변동시 별도안내 예정
          </div>
        </div>
      </div>
    </section>

      {/* APPLICATION FORM: Stark UI */}
      <section id="section-8" className="relative z-10 py-20 md:py-32 bg-white text-black px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 space-y-10 md:space-y-12">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">Apply<br />Right<br />Now.</h2>
            <div className="space-y-3 md:space-y-4 text-zinc-500 font-medium text-sm md:text-base">
              <p>글로벌 진출 희망 예비 창업팀</p>
              <p>한국외대 구성원 1인 이상 필수</p>
              <p className="font-black text-black underline decoration-2">마감: 2026.04.09(목) 23:59</p>
              <div className="pt-4 border-t border-black/5 space-y-1">
                <p className="text-xs md:text-sm font-bold text-zinc-800">※한국외대 구성원 미보유 팀 또는 개인(한국외대)인 경우 매칭데이 참여 필수</p>
                <p className="text-xs md:text-sm font-bold text-zinc-800 whitespace-nowrap">※대상 분야 : 플랫폼/소프트웨어/어플리케이션 등 IT 서비스 관련 전 분야 (제조업 등 불가)</p>
              </div>
            </div>
          </div>

          {/* Right Column: Two Application Boxes */}
          <div className="lg:col-span-7 space-y-4 md:space-y-5 text-left">
            {/* Box 1: Founder */}
            <div className="p-8 md:p-10 border-[4px] border-black flex flex-col justify-between space-y-8 hover:bg-zinc-50/50 transition-colors">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight underline decoration-4 decoration-black/10 underline-offset-8">창업팀 대표자용</h3>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mt-2">Group A</span>
                </div>
                <div className="text-sm md:text-base font-bold leading-relaxed text-zinc-800 space-y-4">
                  <p>프로덕트 또는 아이디어를 가진 예비 청년 창업팀 (대학 제한 없음).</p>
                  <p>아이디어, 혹은 사업계획서가 있는 팀의 대표자라면 아래 링크를 통해 지원할 수 있습니다.</p>
                  
                  <a
                    href="/odyssey_x_business_plan_v1.docx"
                    download="Odyssey-X 1기 사업계획서 양식.docx"
                    className="inline-flex items-center gap-3 py-3 px-6 border-2 border-black font-black uppercase tracking-tighter text-sm hover:bg-black hover:text-white transition-all group"
                  >
                    사업계획서 양식 <span className="opacity-50 group-hover:translate-y-1 transition-transform not-italic text-xs">↓</span>
                  </a>                  <p className="text-xs md:text-sm font-medium text-zinc-500 italic pt-2">
                    (※ 팀 내 외대생이 없어도 지원 가능, 지원 후 매칭데이에서 영입)
                  </p>
                  <p className="text-[10px] md:text-xs text-zinc-500 italic">
                    매칭 데이 참여가 필요할 경우 03.24 (화) 23:59까지 지원서를 제출하여 주시기 바랍니다.
                  </p>
                </div>
              </div>
              <a
                href="https://forms.gle/1nDHqxtaYzUe1Nvw6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center py-4 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black border-2 border-black transition-all"
              >
                Apply
              </a>
              </div>

              {/* Separator OR */}
              <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
              <div className="relative px-4 bg-white text-zinc-400 font-mono text-xs md:text-sm font-black uppercase tracking-widest">Or</div>
              </div>

              {/* Box 2: Team Member */}
              <div className="p-8 md:p-10 border-[4px] border-black flex flex-col justify-between space-y-8 hover:bg-zinc-50/50 transition-colors">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight underline decoration-4 decoration-black/10 underline-offset-8">예비 팀원용 (개인)</h3>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mt-2">Group B</span>
                </div>
                <div className="text-sm md:text-base font-bold leading-relaxed text-zinc-800 space-y-4">
                  <p>본인의 역량 (기획/개발/디자인)으로 우수한 창업팀에 합류하고 싶은 외대인이라면 아래 링크를 통해 지원할 수 있습니다.</p>
                  <p className="text-xs md:text-sm font-medium text-zinc-500 italic pt-2">
                    (※ 한국외대 재/휴학생 및 졸업생, 대학원생, 교직원 전용)
                  </p>
                  <p className="text-[10px] md:text-xs text-zinc-500 italic">
                    매칭 데이 참여를 위해 03.24 (화) 23:59까지 지원서를 제출하여 주시기 바랍니다.
                  </p>
                </div>
              </div>
              <a
                href="https://forms.gle/hdCtDKNbNjCjJsxc6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center py-4 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black border-2 border-black transition-all"
              >
                Apply
              </a>            </div>
          </div>
        </div>
      </section>

      {/* FAQ: Clean Lines */}
      <section id="section-9" className="py-20 md:py-32 px-6 lg:px-20 border-b border-zinc-900 bg-black">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center italic">FAQ</h2>
          <div className="divide-y divide-zinc-900 border-y border-zinc-900">
            {[
              { 
                q: "개발자나 디자이너가 없는 아이디어 기획 팀인데 지원 가능한가요?", 
                a: "네, 가능합니다! Product 트랙에서 노코드(No-code) 툴을 활용해 MVP를 개발하는 과정을 지원합니다. 또한 사전 매칭데이를 통해 타 대학 개발자/디자이너와 팀빌딩을 할 수 있습니다." 
              },
              { 
                q: "타 대학 학생도 지원할 수 있나요?", 
                a: "지원 가능합니다. 단, 프로그램 규정상 팀 내에 한국외대 구성원(재휴학생, 15학번 이후 졸업생 등) 1인 이상이 필수로 포함되어야 합니다. 현재 팀에 외대생이 없다면 매칭데이에 필수로 참석하여 팀원을 구하셔야 합니다." 
              },
              { 
                q: "이미 정부지원사업(예창패 등)을 준비 중이거나 사업자 등록을 한 팀도 되나요?", 
                a: "네, 강력히 환영합니다. 시드(Seed) 라운드 이하의 초기 스타트업이라면 누구나 지원 가능합니다." 
              }
            ].map((faq, i) => (
              <div key={i} className="group">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full py-8 md:py-10 text-left flex justify-between items-center group-hover:text-zinc-400 transition-colors"
                >
                  <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">{faq.q}</span>
                  <span className={`text-2xl md:text-3xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-60 mb-8 md:mb-10' : 'max-h-0'}`}>
                  <p className="text-zinc-500 text-xs md:text-base font-medium leading-relaxed max-w-2xl">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER: Raw Architectural */}
      <footer className="py-16 md:py-20 px-6 lg:px-20 bg-black space-y-16 md:space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start border-t border-zinc-900 pt-16 md:pt-20">
          <div className="lg:col-span-6">
            <span className="text-black text-[10px]">오디세이 화이팅</span>
          </div>
          <div className="lg:col-span-6 lg:text-right space-y-6 md:space-y-8">
            <p className="text-zinc-500 font-mono text-[9px] md:text-[10px] uppercase tracking-widest">Connect with us</p>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-start lg:justify-end gap-5 md:gap-6 pt-2 md:pt-4">
                <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest border-b border-transparent group-hover:border-white">IG</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest border-b border-transparent group-hover:border-white">LI</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 md:pt-20 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-zinc-500 text-center md:text-left">
          <p>&copy; 2026 Odyssey-X. All rights reserved.</p>
          <div className="flex items-center gap-4 grayscale opacity-60">
            <img src="/hufs_logo.png" alt="HUFS" className="h-3 md:h-4 w-auto invert" />
            <span>×</span>
            <img src="/rakuten.png" alt="Rakuten" className="h-3 md:h-4 w-auto invert" />
          </div>
        </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
        .word-keep-all { word-break: keep-all; }
      `}</style>
    </div>
  );
};

export default Apply;
