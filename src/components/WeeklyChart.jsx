import React from 'react';
import { BarChart3, Trash2, Sparkles } from 'lucide-react';
import { playTickSound } from '../utils/sound';

export default function WeeklyChart({ weeklyStats, onResetWeekly, onAddDummyStats }) {
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 이번 주 총 집중 시간 (분) 계산
  const totalMinutes = Object.values(weeklyStats).reduce((sum, min) => sum + min, 0);

  // 분 단위를 "X시간 Y분" 형태로 포맷팅
  const formatTotalTime = (totalMin) => {
    if (totalMin === 0) return '0분';
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hrs === 0) return `${mins}분`;
    return `${hrs}시간 ${mins}분`;
  };

  // 막대그래프의 최대값 계산 (높이 비율 100% 기준점 설정, 최소 60분으로 설정해 그래프가 너무 튀지 않게 조절)
  const maxMinutes = Math.max(60, ...Object.values(weeklyStats));

  const handleReset = () => {
    if (confirm("이번 주의 주간 집중 통계를 모두 리셋하시겠습니까, 대표님? 📊")) {
      playTickSound();
      onResetWeekly();
    }
  };

  const handleAddDummy = () => {
    playTickSound();
    onAddDummyStats();
  };

  return (
    <div className="w-full bg-brand-card border border-brand-border rounded-[32px] p-6 shadow-xl transition-all duration-300 hover:bg-brand-card-hover text-left flex flex-col gap-6">
      
      {/* 타이틀 및 액션 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-pink-400">
          <BarChart3 className="w-5 h-5" />
          <h3 className="text-base font-bold tracking-wider select-none">Weekly Focus Statistics</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* 테스트 더미데이터 주입 버튼 */}
          <button
            onClick={handleAddDummy}
            title="테스트용 랜덤 시간 데이터 추가"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-300 hover:text-white rounded-xl text-[11px] font-semibold transition-all duration-300 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Add Test Stats
          </button>
          
          {/* 주간 데이터 초기화 */}
          {totalMinutes > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/10 text-rose-300 hover:text-rose-200 rounded-xl text-[11px] font-semibold transition-all duration-300 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Weekly
            </button>
          )}
        </div>
      </div>

      {/* 요약 대시보드 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-indigo-950/20 border border-indigo-500/5 rounded-2xl p-4">
        <div className="flex flex-col gap-1 md:col-span-1 border-b md:border-b-0 md:border-r border-brand-border/60 pb-3 md:pb-0 md:pr-4">
          <span className="text-xs text-indigo-300/50 font-semibold select-none">이번 주 총 몰입 시간</span>
          <span className="text-2xl font-black text-pink-400 font-mono tracking-tight">
            {formatTotalTime(totalMinutes)}
          </span>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2 md:pl-2">
          <span className="text-xs text-indigo-300/50 font-semibold select-none">코다리 부장의 주간 피드백</span>
          <p className="text-xs md:text-sm font-cute text-indigo-200/90 leading-relaxed">
            {totalMinutes === 0 
              ? "아직 이번 주 집중 기록이 없습니다. 대표님, 첫 막대를 시원하게 올려보시지요! 📈"
              : totalMinutes < 120
                ? "작은 몰입이 모여 거대한 성공이 됩니다! 기세를 올려 핫핑크 막대를 무럭무럭 키워보십시오! 🔥"
                : totalMinutes < 300
                  ? "대표님의 이번 주 집중력이 대단합니다! 이미 훌륭한 수준이지만, 조금만 더 달려볼까요? 😎🚀"
                  : "와.. 대표님은 괴물 집중력의 소유자이십니다! 👑 번아웃이 오지 않게 꼭 쉬엄쉬엄 가십시오! 🫡☕"
            }
          </p>
        </div>
      </div>

      {/* 바 차트 본체 */}
      <div className="relative pt-6 px-2">
        {/* 그래프 축선 가이드 */}
        <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none select-none">
          <div className="w-full border-t border-brand-border/30 border-dashed"></div>
          <div className="w-full border-t border-brand-border/30 border-dashed"></div>
          <div className="w-full border-t border-brand-border/30 border-dashed"></div>
        </div>

        {/* 요일별 막대 정렬 */}
        <div className="relative z-10 flex justify-between items-end h-44 md:h-52 px-2 md:px-4">
          {days.map((day) => {
            const minutes = weeklyStats[day] || 0;
            // 막대 높이 백분율 계산 (최소 4% 보장하여 0분이어도 실루엣이 보이게 함)
            const heightPercent = minutes > 0 ? `${(minutes / maxMinutes) * 100}%` : '4%';

            return (
              <div key={day} className="group relative flex flex-col items-center w-8 sm:w-12">
                
                {/* 툴팁 (마우스 호버 시 뿅 나타남) */}
                <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                  <div className="bg-indigo-950 border border-pink-500/40 rounded-xl px-2.5 py-1.5 shadow-xl text-center">
                    <span className="block text-[10px] text-pink-300 font-bold font-mono">{day}요일</span>
                    <span className="block text-xs text-white font-extrabold font-mono whitespace-nowrap">{minutes}분 몰입!</span>
                  </div>
                  {/* 툴팁 꼬리 */}
                  <div className="w-2 h-2 bg-indigo-950 border-r border-b border-pink-500/40 rotate-45 -mt-1"></div>
                </div>

                {/* 막대 기둥 */}
                <div 
                  style={{ height: heightPercent }}
                  className="w-4 sm:w-6 rounded-t-full bg-gradient-to-t from-pink-600 via-pink-500 to-rose-400 border-t border-pink-300/30 shadow-[0_0_12px_rgba(236,72,153,0.15)] transition-all duration-700 ease-out hover:scale-x-110 hover:brightness-110 cursor-pointer"
                >
                  {/* 일정 시간 이상일 때 막대 안에 수치 표시 */}
                  {minutes >= 20 && (
                    <span className="hidden sm:block text-[8px] font-bold font-mono text-white text-center w-full pt-1.5 select-none">
                      {minutes}
                    </span>
                  )}
                </div>

                {/* 하단 요일 라벨 */}
                <span className="mt-2 text-xs font-cute text-indigo-300/70 font-semibold group-hover:text-pink-400 transition-colors select-none">
                  {day}
                </span>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
