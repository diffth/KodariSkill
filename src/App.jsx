import React, { useState, useEffect, useRef } from 'react';
import KomodoroCharacter from './components/KomodoroCharacter';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import SessionStats from './components/SessionStats';
import { playSuccessSound, playTickSound } from './utils/sound';

export default function App() {
  // 1. 기본 타이머 설정 시간 (분 단위)
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  // 2. 타이머 작동 상태
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // 3. 누적 집중 세션 통계 (로컬 스토리지 연동)
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem('komodoro_completed_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });

  // 백그라운드 오차 보정용 Ref
  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // 설정 시간이 바뀔 때 타이머가 작동 중이 아니면 timeLeft 업데이트
  useEffect(() => {
    if (!isActive) {
      setTimeLeft((isBreak ? breakMinutes : focusMinutes) * 60);
    }
  }, [focusMinutes, breakMinutes, isBreak, isActive]);

  // 로컬스토리지 완료 세션 업데이트
  useEffect(() => {
    localStorage.setItem('komodoro_completed_sessions', completedSessions.toString());
  }, [completedSessions]);

  // 타이머 핵심 틱(Tick) 및 백그라운드 탭 오차 보정 로직
  useEffect(() => {
    if (isActive) {
      // 1. 타이머 종료 시점 타임스탬프 계산 및 저장
      endTimeRef.current = Date.now() + timeLeft * 1000;

      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        
        setTimeLeft(remaining);

        // 타이머가 0초에 도달했을 때
        if (remaining === 0) {
          clearInterval(intervalRef.current);
          setIsActive(false);
          playSuccessSound();

          // 모드 전환 및 세션 적립
          if (!isBreak) {
            setCompletedSessions((prev) => prev + 1);
            setIsBreak(true);
            setTimeLeft(breakMinutes * 60);
          } else {
            setIsBreak(false);
            setTimeLeft(focusMinutes * 60);
          }
        }
      }, 200); // 200ms 마다 갱신하여 1초 미만 오차 최소화
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isBreak, focusMinutes, breakMinutes]);

  // 브라우저 탭 타이틀에 남은 시간 및 상태 표시
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (isActive) {
      document.title = `[${timeStr}] ${isBreak ? 'Break' : 'Focus'} | Komodoro 🍅`;
    } else {
      document.title = `Komodoro Timer 🍅`;
    }
  }, [timeLeft, isActive, isBreak]);

  // 시작 / 일시정지 제어
  const handleStartPause = () => {
    setIsActive((prev) => !prev);
  };

  // 초기화 제어
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft((isBreak ? breakMinutes : focusMinutes) * 60);
  };

  // 모드 즉시 전환
  const handleModeSwitch = (mode) => {
    setIsActive(false);
    if (mode === 'focus') {
      setIsBreak(false);
      setTimeLeft(focusMinutes * 60);
    } else {
      setIsBreak(true);
      setTimeLeft(breakMinutes * 60);
    }
  };

  // 오늘 완료 기록 초기화
  const handleResetStats = () => {
    setCompletedSessions(0);
  };

  // 코다리 캐릭터에게 전달할 현재 상태값 계산
  const getCharacterStatus = () => {
    if (timeLeft === 0) return 'finished';
    if (!isActive && timeLeft < (isBreak ? breakMinutes : focusMinutes) * 60) {
      return 'paused';
    }
    if (isActive) {
      return isBreak ? 'break' : 'focus';
    }
    return 'idle'; // 대기 상태
  };

  // 타이머의 총 시간 계산 (진행률 표시용)
  const totalTime = (isBreak ? breakMinutes : focusMinutes) * 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-8 md:py-12 select-none">
      
      {/* 헤더 영역 */}
      <header className="flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍅</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400">
            Komodoro
          </h1>
        </div>
        <p className="text-sm text-indigo-300/60 font-medium">
          대표님의 몰입을 돕는 귀여운 뽀모도로 비서
        </p>
      </header>

      {/* 메인 콘텐츠 영역 (캐릭터 + 타이머 + 컨트롤 + 통계) */}
      <main className="w-full max-w-4xl flex flex-col lg:flex-row items-stretch justify-center gap-8 my-8">
        
        {/* 왼쪽 섹션: 캐릭터 & 오늘 통계 */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <KomodoroCharacter status={getCharacterStatus()} />
          <SessionStats 
            completedSessions={completedSessions} 
            onResetStats={handleResetStats} 
          />
        </div>

        {/* 오른쪽 섹션: 타이머 원형 바 & 컨트롤 */}
        <div className="flex-1 flex flex-col gap-6 justify-center items-center bg-indigo-950/10 border border-indigo-500/5 rounded-[36px] p-6 backdrop-blur-md">
          <TimerDisplay 
            timeLeft={timeLeft} 
            totalTime={totalTime} 
            isBreak={isBreak} 
          />
          <TimerControls 
            isActive={isActive} 
            onStartPause={handleStartPause} 
            onReset={handleReset} 
            isBreak={isBreak} 
            onModeSwitch={handleModeSwitch}
            focusMinutes={focusMinutes}
            setFocusMinutes={setFocusMinutes}
            breakMinutes={breakMinutes}
            setBreakMinutes={setBreakMinutes}
            disabledSettings={isActive}
          />
        </div>

      </main>

      {/* 푸터 영역 */}
      <footer className="text-center text-xs text-indigo-400/30 font-medium">
        &copy; {new Date().getFullYear()} Komodoro Timer. Created with 🐟 by Kodari.
      </footer>

    </div>
  );
}
