import React from 'react';
import { Play, Pause, RotateCcw, Flame, Coffee, Plus, Minus } from 'lucide-react';
import { playTickSound, playStartSound, playPauseSound } from '../utils/sound';

export default function TimerControls({ 
  isActive, 
  onStartPause, 
  onReset, 
  isBreak, 
  onModeSwitch,
  focusMinutes,
  setFocusMinutes,
  breakMinutes,
  setBreakMinutes,
  disabledSettings
}) {

  const handleStartPause = () => {
    if (isActive) {
      playPauseSound();
    } else {
      playStartSound();
    }
    onStartPause();
  };

  const handleReset = () => {
    playTickSound();
    onReset();
  };

  const handleModeSwitch = (mode) => {
    playTickSound();
    onModeSwitch(mode);
  };

  const adjustMinutes = (type, amount) => {
    playTickSound();
    if (type === 'focus') {
      const nextVal = Math.max(5, Math.min(120, focusMinutes + amount));
      setFocusMinutes(nextVal);
    } else {
      const nextVal = Math.max(1, Math.min(60, breakMinutes + amount));
      setBreakMinutes(nextVal);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-6 p-6 bg-brand-card border border-brand-border rounded-3xl shadow-xl transition-all duration-300 hover:bg-brand-card-hover">
      
      {/* 1. 모드 즉시 전환 탭 */}
      <div className="grid grid-cols-2 gap-2 bg-indigo-950/40 p-1.5 rounded-2xl border border-indigo-500/10">
        <button
          onClick={() => handleModeSwitch('focus')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
            !isBreak 
              ? 'bg-emerald-500 text-brand-dark shadow-md scale-[1.02]' 
              : 'text-indigo-300/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-4 h-4" />
          Focus Session
        </button>
        <button
          onClick={() => handleModeSwitch('break')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
            isBreak 
              ? 'bg-rose-500 text-brand-dark shadow-md scale-[1.02]' 
              : 'text-indigo-300/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Break Time
        </button>
      </div>

      {/* 2. 메인 컨트롤 버튼 (시작, 일시정지, 초기화) */}
      <div className="flex items-center justify-center gap-4">
        {/* 초기화 버튼 */}
        <button
          onClick={handleReset}
          title="타이머 초기화"
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-900/40 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* 시작 / 일시정지 버튼 */}
        <button
          onClick={handleStartPause}
          className={`flex items-center justify-center px-8 py-3.5 rounded-2xl font-bold text-base md:text-lg tracking-wider text-brand-dark shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
            isActive
              ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/10'
              : isBreak 
                ? 'bg-rose-400 hover:bg-rose-300 shadow-rose-500/10'
                : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/10'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2 fill-current" />
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2 fill-current" />
              START
            </>
          )}
        </button>
      </div>

      {/* 3. 시간 설정 (타이머가 정지되었을 때만 변경 가능하도록 유도) */}
      <div className="border-t border-brand-border/60 pt-4 flex flex-col gap-4">
        <span className="text-xs font-bold text-indigo-300/40 tracking-wider text-left uppercase select-none">
          Settings {disabledSettings && <span className="text-amber-400/70 lowercase font-normal">(timer is active)</span>}
        </span>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 집중 시간 조절 */}
          <div className={`flex flex-col gap-1.5 ${disabledSettings ? 'opacity-40 pointer-events-none' : ''}`}>
            <span className="text-xs text-indigo-200/80 text-left font-medium select-none">Focus Min</span>
            <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-500/10 rounded-xl px-2 py-1">
              <button 
                onClick={() => adjustMinutes('focus', -5)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-indigo-300 hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-emerald-400 text-sm">{focusMinutes}m</span>
              <button 
                onClick={() => adjustMinutes('focus', 5)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-indigo-300 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 휴식 시간 조절 */}
          <div className={`flex flex-col gap-1.5 ${disabledSettings ? 'opacity-40 pointer-events-none' : ''}`}>
            <span className="text-xs text-indigo-200/80 text-left font-medium select-none">Break Min</span>
            <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-500/10 rounded-xl px-2 py-1">
              <button 
                onClick={() => adjustMinutes('break', -1)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-indigo-300 hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-rose-400 text-sm">{breakMinutes}m</span>
              <button 
                onClick={() => adjustMinutes('break', 1)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-indigo-300 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
