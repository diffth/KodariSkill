import React from 'react';

export default function TimerDisplay({ timeLeft, totalTime, isBreak }) {
  // 분:초 포맷 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 원형 프로그레스 바 계산용 (반지름 r=120, 둘레 C = 2 * PI * r = 753.98)
  const radius = 120;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // 모드별 색상 맵핑
  const strokeColorClass = isBreak 
    ? "url(#breakGradient)" 
    : "url(#focusGradient)";
    
  const textThemeClass = isBreak 
    ? "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" 
    : "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]";

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 mx-auto transition-transform duration-300 hover:scale-[1.01]">
      {/* SVG 원형 프로그레스 바 */}
      <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 280 280">
        <defs>
          {/* 포커스 모드용 그라디언트 */}
          <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* 휴식 모드용 그라디언트 */}
          <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* 배경 원 (투명한 인디고) */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          className="stroke-indigo-950/40 fill-none"
          strokeWidth={strokeWidth}
        />

        {/* 진행율을 나타내는 원 */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke={strokeColorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* 내부 타이머 텍스트 및 모드 설명 */}
      <div className="absolute flex flex-col items-center justify-center">
        {/* 현재 모드 태그 */}
        <span className={`text-xs md:text-sm font-bold tracking-widest uppercase mb-1 px-3 py-0.5 rounded-full border bg-brand-dark/80 backdrop-blur-sm select-none ${
          isBreak 
            ? "text-rose-400 border-rose-500/30" 
            : "text-emerald-400 border-emerald-500/30"
        }`}>
          {isBreak ? '☕ Break Time' : '🚀 Focus Time'}
        </span>
        
        {/* 타이머 대형 폰트 */}
        <span className={`text-5xl md:text-6xl font-bold font-mono tracking-tighter ${textThemeClass}`}>
          {formatTime(timeLeft)}
        </span>
        
        {/* 진행 퍼센트 */}
        <span className="text-[10px] md:text-xs text-indigo-300/60 mt-1 select-none font-medium">
          {Math.round(progress * 100)}% Completed
        </span>
      </div>
    </div>
  );
}
