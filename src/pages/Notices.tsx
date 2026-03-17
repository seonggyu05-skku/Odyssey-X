import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NOTICES = [
  { 
    id: 1, 
    title: "[안내] Odyssey-X 1기 Moderator(Staff) 공개 모집", 
    date: "2026.03.11", 
    tag: "모집",
    important: true,
    content: (
      <div className="space-y-10 text-zinc-300 leading-relaxed pb-20">
        <div className="space-y-4">
          <p className="text-lg font-bold text-white">✨ Global Accelerating Program, Odyssey-X에서 운영 인력(Staff)을 모집합니다.</p>
          <p>글로벌 창업 생태계의 중심에서 실전 운영 경험을 쌓고 싶은 분들의 많은 지원 바랍니다😊</p>
          <p className="text-white font-black italic underline decoration-white/20 underline-offset-4">✅ 프로그램 참가자 모집이 아닌, "Staff" 모집입니다.</p>
        </div>

        <div className="space-y-6">
          <h4 className="text-white text-xl font-black uppercase tracking-tight">🚀 Odyssey-X: Global Accelerating Program 소개</h4>
          <p>
            한국외대 창업지원단과 글로벌 기업 Rakuten Symphony가 협력하여 예비 글로벌 창업가를 육성하는 8주간의 여정, 'Odyssey-X'를 시작합니다.
          </p>
          <p>
            단순한 교육을 넘어 싱가포르, 베트남, 일본 등 실제 글로벌 진출을 끝까지 지원하는 차별화된 프로그램입니다. 이 거대한 여정을 함께 이끌어갈 Moderator를 모집합니다. 실제 기업에서 종사하시는 분들과 함께 직무를 수행하기에, 실무 경험이 필요하신 분들에게 권장합니다!
          </p>
        </div>

        <div className="p-8 bg-zinc-900/30 border border-zinc-800 space-y-4">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">[Odyssey-X 프로그램 개요]</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="text-zinc-500 mr-4">일정 :</span> 2026.05.02 - 06.27 매주 토요일 (8주간)</li>
            <li><span className="text-zinc-500 mr-4">구성 :</span> 8주 교육 및 멘토링 + Final Demo Day</li>
            <li><span className="text-zinc-500 mr-4">활동 :</span> 한국외국어대학교 글로벌캠퍼스/서울캠퍼스</li>
            <li><span className="text-zinc-500 mr-4">규모 :</span> 선정된 10개 팀 (약 50명)</li>
            <li><span className="text-zinc-500 mr-4">상금 :</span> 총 700만 원</li>
            <li><span className="text-zinc-500 mr-4">주최 :</span> 한국외대 창업지원단, G-RISE 사업단, Rakuten Symphony</li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-white text-xl font-black text-center py-4 border-y border-zinc-900">✨Moderator 모집 안내✨</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">[모집 인원]</span>
              <p className="text-white font-bold">0명</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">[활동 기간]</span>
              <p className="text-white font-bold">2026.04.01~2026.06.30 (3개월)</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">[활동 안내]</span>
              <p className="text-white font-bold">참가자 관리 및 프로그램 현장 진행</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">[활동 혜택]</span>
              <p className="text-white font-bold">Rakuten Symphony 공식 활동 증명서 발급</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">[지원 자격]</span>
            <div className="space-y-2 text-white font-bold">
              <p>✅책임감 있고 성실하게 행사를 운영하실 분</p>
              <p>✅인적 자원 관리, 행사 기획 및 진행에 경험이 있는 분</p>
            </div>
          </div>

          <div className="p-6 border-l-2 border-zinc-800 bg-zinc-900/10 space-y-2 text-sm italic text-zinc-500">
            <p>Moderator 활동 시, Odyssey-X 프로그램 참가는 불가능합니다.</p>
            <p>지원 인원 초과 시 별도의 면접이 진행될 수 있습니다.</p>
          </div>

          <div className="pt-8 space-y-4">
            <div className="inline-block px-4 py-2 bg-white text-black font-black uppercase text-xs tracking-tighter italic">
              🚨마감 기한🚨
            </div>
            <p className="text-2xl font-black text-white italic underline underline-offset-8">3월 25일(수) 23시 59분까지</p>
          </div>

          <div className="pt-12 flex flex-col md:flex-row md:items-center items-start gap-6 md:gap-10">
            <p className="text-white font-bold whitespace-nowrap">📥 지원 방법: 지원 폼 작성 및 제출</p>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSfNUGbP8wYi8s4dAQFjqAt_UW4BxEb5D5OSl3Bimd5YdlSs4A/viewform?usp=sharing&ouid=113411499367210129465" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit inline-flex items-center gap-3 px-8 py-2 bg-white text-black font-black uppercase text-[11px] tracking-widest hover:bg-black hover:text-white border border-transparent hover:border-white transition-all group shrink-0"
            >
              지원 폼 작성하기
              <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "[안내] Odyssey-매칭데이✨ 열정은 있는데 아이템이 없는 '외대구성원'을 찾습니다!",
    date: "2026.03.12",
    tag: "안내",
    important: false,
    content: (
      <div className="space-y-10 text-zinc-300 leading-relaxed pb-20">
        <div className="space-y-4">
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">(외대구성원용)</p>
          <h3 className="text-2xl font-black text-white italic">[Odyssey-X]</h3>
          <p className="text-lg font-bold text-white">🚀열정은 있는데 아이템이 없다면? <br />로켓에 탑승할 '외대구성원'을 찾습니다!</p>
        </div>

        <div className="space-y-6">
          <p>
            기획, 프론트엔드/백엔드 개발, 디자인, 마케팅 등 뛰어난 역량과 열정을 가지고 있지만, <br />
            아직 구체적인 프로덕트나 함께할 팀이 없어 창업 도전을 망설이고 계신가요?
          </p>
          <p>
            Odyssey-X에서는 훌륭한 프로덕트와 실행력을 갖춘 창업팀들이 여러분과 함께할 날을 기다리고 있습니다! 
          </p>
          <p className="text-white font-bold">
            아이디어를 가진 팀은 '외대구성원 영입'이 필수이므로, 역량 있는 외대구성원 팀원을 간절히 찾고 있습니다. <br />
            Matching Day'에 참여하여, 직접 여러 팀의 비전을 들어보고 여러분의 역량을 마음껏 펼칠 수 있는 최고의 팀을 만나보세요.🤝
          </p>
        </div>

        <div className="p-8 bg-zinc-900/30 border border-zinc-800 space-y-4 font-bold">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">[행사 안내]</h4>
          <ul className="space-y-3 text-sm">
            <li><span className="text-zinc-500 mr-4 italic">📆 일시:</span> 2026년 3월 25일 (수) 19:00 ~ 22:00</li>
            <li><span className="text-zinc-500 mr-4 italic">🛜 장소:</span> ZEP (온라인 메타버스 플랫폼, 링크 추후 안내)</li>
            <li><span className="text-zinc-500 mr-4 italic">👨‍🚀 참가 대상:</span> 창업팀 찾는 외대구성원 누구나 (직무 무관)</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">[주요 프로그램]</h4>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>대표 참가자 1분 피칭(선택)</li>
            <li>팀원 참가자 자기 PR 30초 피칭(선택)</li>
            <li>6개 산업 분야(AI, 커머스 등) 및 직무별 방(Room) 자율 네트워킹</li>
          </ul>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <h4 className="text-white font-black italic">🎤 팀원 참가자 30초 자기 PR 피칭</h4>
          <p className="text-sm">
            여러분의 역량과 열정을 창업팀 대표자들에게 직접 알리고 싶다면 '30초 자기 PR 피칭'에 도전해 보세요! 거창한 발표가 아니어도 좋습니다. 
            매칭데이 오프닝 시간(19:00~19:20)에 현장에서 즉석으로 신청을 받으니, 마이크를 켜고 여러분을 어필해 보세요. 더 좋은 팀으로부터 스카우트 제의를 받을 확률이 올라갑니다!
          </p>
        </div>

        <div className="pt-12 space-y-8">
          <p className="text-white font-bold">✅참가 방법: 외대구성원 참가 신청 폼 작성</p>
          
          <div className="space-y-6">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">📥 지원하기</span>
            <a 
              href="https://tally.so/r/gDAbRM" 
              target="_blank"
              rel="noopener noreferrer"
              className="ml-0 md:ml-6 inline-flex items-center gap-3 px-8 py-2 bg-white text-black font-black uppercase text-[11px] tracking-widest hover:bg-black hover:text-white border border-transparent hover:border-white transition-all group shrink-0 w-fit"
            >
              Apply
              <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </div>

          <p className="text-xl font-black text-white italic underline underline-offset-8 decoration-white/20">✨지금 바로 매칭데이에 참가하여 완벽한 팀빌딩을 완성해 보세요!</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "[안내] Odyssey-매칭데이✨ 좋은 아이디어는 있는데, 함께할 '외대 구성원' 팀원이 없다면?",
    date: "2026.03.12",
    tag: "안내",
    important: false,
    content: (
      <div className="space-y-10 text-zinc-300 leading-relaxed pb-20">
        <div className="space-y-4">
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">(외대생 없는 팀용)</p>
          <h3 className="text-2xl font-black text-white italic">[Odyssey-X]</h3>
          <p className="text-lg font-bold text-white">🚀좋은 아이디어는 있는데, 함께할 '외대 구성원' 팀원이 없다면?</p>
        </div>

        <div className="space-y-6">
          <p>
            Odyssey-X 프로그램에 지원해 주신 <br />
            예비 글로벌 창업팀 여러분 환영합니다!✨
          </p>
          <p>
            본 프로그램은 '외대 구성원(HUFS) 팀원 포함'이 필수요건 입니다. 하지만 현재 팀 내에 외대 구성원 팀원이 없더라도 걱정하지 마세요. 신청서를 제출하신 대표자분들을 위해, 외대 구성원 예비 팀원들을 만나 팀빌딩을 완성할 수 있는 <br />
            <span className="text-white font-bold italic underline decoration-1 underline-offset-4">'Matching Day'를 개최합니다.🎉</span>
          </p>
        </div>

        <div className="p-8 bg-zinc-900/30 border border-zinc-800 space-y-4 font-bold">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">[행사 안내]</h4>
          <ul className="space-y-3 text-sm">
            <li><span className="text-zinc-500 mr-4 italic">📆 일시:</span> 2026년 3월 25일 (수) 19:00 ~ 22:00</li>
            <li><span className="text-zinc-500 mr-4 italic">🛜 장소:</span> ZEP (온라인 메타버스 플랫폼, 링크 추후 안내)</li>
            <li><span className="text-zinc-500 mr-4 italic">👨‍🚀 참가 대상:</span>
              <ul className="mt-2 space-y-1 ml-4 list-disc list-outside text-zinc-300">
                <li>외대 구성원 팀원이 없는 예비 창업팀</li>
                <li>창업팀 대표자 및 합류를 희망하는 외대 구성원</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">[주요 프로그램]</h4>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>대표 참가자 1분 피칭(선택)</li>
            <li>팀원 참가자 자기 PR 30초 피칭(선택)</li>
            <li>6개 산업 분야(AI, 커머스 등) 및 직무별 방(Room) 자율 네트워킹</li>
          </ul>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <h4 className="text-white font-black italic">🎤 대표 참가자 1분 피칭</h4>
          <p className="text-sm">
            매칭데이 당일, 외대구성원들에게 우리 팀의 비전과 아이템을 적극적으로 어필하고 싶다면 '1분 팀 피칭'에 참여해 보세요. 피칭은 완전한 자율 참여이며, 당일 오프닝 시간(19:00~19:20)에 중앙 라운지에서 즉흥적으로 신청을 받을 예정입니다. 부담 없이 가벼운 마음으로 팀을 소개할 수 있는 기회를 놓치지 마세요!
          </p>
        </div>

        <div className="pt-12 space-y-8">
          <p className="text-white font-bold">✅참가 방법: 외대구성원 참가 신청 폼 작성</p>
          
          <div className="space-y-6">
            <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">📥 지원하기</span>
            <a 
              href="https://tally.so/r/yPyXW6" 
              target="_blank"
              rel="noopener noreferrer"
              className="ml-0 md:ml-6 inline-flex items-center gap-3 px-8 py-2 bg-white text-black font-black uppercase text-[11px] tracking-widest hover:bg-black hover:text-white border border-transparent hover:border-white transition-all group shrink-0 w-fit"
            >
              Apply
              <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </div>

          <p className="text-xl font-black text-white italic underline underline-offset-8 decoration-white/20">✨지금 바로 매칭데이에 참가하여 완벽한 팀빌딩을 완성해 보세요!</p>
        </div>
      </div>
    )
  }
];

const Notices: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const selectedId = id ? parseInt(id) : null;
  const selectedNotice = NOTICES.find(n => n.id === selectedId);
  const currentIndex = NOTICES.findIndex(n => n.id === selectedId);
  
  const prevNotice = currentIndex > 0 ? NOTICES[currentIndex - 1] : null;
  const nextNotice = currentIndex < NOTICES.length - 1 ? NOTICES[currentIndex + 1] : null;

  const handleSelectNotice = (noticeId: number | null) => {
    if (noticeId === null) {
      navigate('/1_apply/notices');
    } else {
      navigate(`/1_apply/notices/${noticeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-[100] px-8 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="h-8 cursor-pointer" onClick={() => navigate('/1_apply')}>
          <img src="/odyssey.png" alt="Odyssey Logo" className="h-full w-auto brightness-0 invert" />
        </div>
        <button 
          onClick={() => selectedId ? handleSelectNotice(null) : navigate('/1_apply')}
          className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-zinc-400 transition-colors"
        >
          {selectedId ? 'Back to List' : 'Back to Apply'}
        </button>
      </header>

      {/* Content */}
      <main className="pt-40 px-8 lg:px-20 max-w-4xl mx-auto space-y-12 pb-40">
        <AnimatePresence mode="wait">
          {!selectedId ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">공지사항</h1>
                <div className="h-[1px] w-full bg-zinc-900"></div>
              </div>

              <div className="space-y-0 divide-y-2 divide-white/10 border-y-2 border-white/10">
                {NOTICES.map((notice) => (
                  <div 
                    key={notice.id} 
                    onClick={() => handleSelectNotice(notice.id)}
                    className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/30 transition-all px-4 -mx-4"
                  >
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-xs text-zinc-600">0{notice.id}</span>
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-3">
                          {notice.important && (
                            <span className="px-1.5 py-0.5 bg-white text-black text-[8px] font-black uppercase">Important</span>
                          )}
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{notice.tag}</span>
                        </div>
                        <h3 className="text-base md:text-xl font-bold group-hover:underline decoration-1 underline-offset-4 md:whitespace-nowrap truncate">{notice.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <span className="font-mono text-sm text-zinc-500">{notice.date}</span>
                      <svg className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Notice Detail Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {selectedNotice?.important && (
                    <span className="px-1.5 py-0.5 bg-white text-black text-[8px] font-black uppercase">Important</span>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{selectedNotice?.tag}</span>
                  <span className="font-mono text-xs text-zinc-600 ml-auto">{selectedNotice?.date}</span>
                </div>
                <h2 className="text-xl md:text-4xl font-black tracking-tight leading-tight">{selectedNotice?.title || "Not Found"}</h2>
                <div className="h-[1px] w-full bg-zinc-900"></div>
              </div>

              {/* Notice Content */}
              <div className="min-h-[300px]">
                {selectedNotice ? selectedNotice.content : (
                  <div className="flex flex-col items-center justify-center pt-20 space-y-6">
                    <p className="text-zinc-500 font-black uppercase tracking-[0.3em]">Notice not found.</p>
                    <button 
                      onClick={() => handleSelectNotice(null)}
                      className="px-8 py-3 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Return to List
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              {selectedNotice && (
                <div className="pt-20 space-y-12">
                  <div className="h-[2px] w-full bg-white/20"></div>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      {prevNotice && (
                        <button 
                          onClick={() => handleSelectNotice(prevNotice.id)}
                          className="w-full md:w-auto flex flex-col items-start gap-1 p-4 border border-zinc-800 bg-white/5 hover:bg-white/10 hover:border-zinc-600 transition-all group"
                        >
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">Previous</span>
                          <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors truncate max-w-xs">{prevNotice.title}</span>
                        </button>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleSelectNotice(null)}
                      className="flex-none px-10 py-3 border border-white bg-white text-black hover:bg-black hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all self-center"
                    >
                      List
                    </button>

                    <div className="flex-1 flex justify-end">
                      {nextNotice && (
                        <button 
                          onClick={() => handleSelectNotice(nextNotice.id)}
                          className="w-full md:w-auto flex flex-col items-end gap-1 p-4 border border-zinc-800 bg-white/5 hover:bg-white/10 hover:border-zinc-600 transition-all group text-right"
                        >
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">Next</span>
                          <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors truncate max-w-xs">{nextNotice.title}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-20 px-8 lg:px-20 border-t border-zinc-900 mt-40">
        <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.4em]">© 2026 Odyssey-X. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Notices;
