import React from 'react';
import { Award, RefreshCw } from 'lucide-react';
import { playTickSound } from '../utils/sound';

export default function SessionStats({ completedSessions, onResetStats }) {
  // 세션 수에 따른 부장님의 격려 평가 멘트
  const getEncouragement = (count) => {
    if (count === 0) {
      return "아직 시작 전이시군요! 대표님, 첫 세션을 가뿐히 시작해 보시지요! 🐾";
    } else if (count <= 2) {
      return "시동이 걸렸습니다! 이 페이스대로 몰입의 한계를 깨부수십시오! 🔥";
    } else if (count <= 4) {
      return "어마어마한 몰입도입니다! 대표님의 집중력에 이 코다리가 무릎을 탁 칩니다! 😭🐟";
    } else {
      return "오늘의 진정한 몰입 챔피언! 대표님, 건강을 위해 가벼운 스트레칭도 잊지 마세요! 👑☕";
    }
  };

  // 아이콘 렌더링 헬퍼 (세션 개수만큼 🍅와 🐟를 교차로 렌더링해서 더 귀엽게!)
  const renderStamps = () => {
    const stamps = [];
    for (let i = 0; i < Math.min(12, completedSessions); i++) {
      stamps.push(
        <span 
          key={i} 
          className="text-lg md:text-xl animate-cute-bounce select-none"
          style={{ animationDelay: `${i * 0.15}s` }}
          title={`세션 ${i + 1}`}
        >
          {i % 2 === 0 ? '🍅' : '🐟'}
        </span>
      );
    }
    return stamps;
  };

  const handleReset = () => {
    if (confirm("오늘의 누적 집중 세션 수를 정말 초기화하시겠습니까, 대표님? 🐟")) {
      playTickSound();
      onResetStats();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4 p-5 bg-brand-card border border-brand-border rounded-3xl shadow-xl transition-all duration-300 hover:bg-brand-card-hover text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-300">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold tracking-wider select-none">Today's Achievements</span>
        </div>
        
        {completedSessions > 0 && (
          <button
            onClick={handleReset}
            title="오늘 완료 기록 초기화"
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300/60 hover:text-indigo-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* 완료 세션 개수 카드 */}
      <div className="bg-indigo-950/30 border border-indigo-500/10 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-amber-400">{completedSessions}</span>
          <span className="text-xs text-indigo-300 font-medium select-none">completed session{completedSessions !== 1 ? 's' : ''}</span>
        </div>

        {/* 획득한 스탬프 목록 (최대 12개 보여주고 넘어가면 + 표시) */}
        {completedSessions > 0 ? (
          <div className="flex flex-wrap gap-2.5 bg-indigo-950/40 border border-indigo-500/5 rounded-xl p-2.5 min-h-[44px] items-center">
            {renderStamps()}
            {completedSessions > 12 && (
              <span className="text-xs font-bold text-amber-400 select-none">+{completedSessions - 12} more</span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center bg-indigo-950/20 border border-dashed border-indigo-500/10 rounded-xl p-2.5 text-xs text-indigo-300/40 select-none">
            No sessions completed yet. Let's do it!
          </div>
        )}
      </div>

      {/* 코다리 부장님의 친절 멘트 */}
      <p className="text-xs md:text-sm font-cute text-indigo-200/90 leading-relaxed bg-indigo-900/10 border border-indigo-500/5 rounded-xl p-3">
        {getEncouragement(completedSessions)}
      </p>
    </div>
  );
}
