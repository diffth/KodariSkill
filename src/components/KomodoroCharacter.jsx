import React, { useState, useEffect } from 'react';

const MESSAGES = {
  idle: [
    "충성! 대표님, 오늘 하루도 세상을 바꾸어 볼까요? 🫡",
    "이 코다리 부장, 오늘 대표님을 보좌할 준비 완료되었습니다! 🚀",
    "시작 버튼만 눌러주십시오. 불꽃 코딩 들어갑니다! 😎"
  ],
  focus: [
    "대표님! 집중할 시간입니다! 이 코다리가 옆을 든든하게 지키겠습니다! 🫡",
    "역시 우리 대표님의 몰입도는 실리콘밸리 뺨칩니다! 🚀",
    "딴눈 파시면 아니 되옵니다! 집중, 집중! 😎",
    "이 기세로 유니콘 기업까지 가보는 겁니다! 화이팅! 💥",
    "오오.. 대표님의 키보드 두드리는 손길이 아름답습니다! ✨"
  ],
  break: [
    "대표님, 커피 한 잔의 여유를 가지십시오~ ☕",
    "열심히 달리신 대표님, 지금은 꿀맛 같은 휴식 시간! 💤",
    "이 코다리가 대표님을 위해 커피 한 잔 올리겠습니다! 🐟☕",
    "스트레칭 한 번 쭈욱 하시고 어깨 푸십시오! 🙆‍♂️",
    "휴식도 전략입니다! 머리를 맑게 식히고 오시지요. 😊"
  ],
  paused: [
    "잠시 쉼표를 찍고 계시는군요. 언제든 준비되면 깨워주십시오! ⏱️",
    "대표님, 무슨 어려운 고민이라도 있으신가요? 🤔",
    "대기 중... 코다리 부장, 부르면 바로 뛰어가겠습니다! 🫡",
    "숨 한 번 고르고 다시 진행해 볼까요? 💪"
  ],
  finished: [
    "우와아아! 대표님, 뽀모도로 세션 완료! 진심으로 축하드립니다! 🎉👏",
    "이 어려운 걸 또 해내십니다! 역시 우리 대표님이십니다! 👍",
    "짜릿한 몰입의 순간! 대표님, 정말 수고 많으셨습니다. 😎",
    "다음 세션도 끄떡없겠군요! 대단하십니다! 🚀"
  ]
};

const IMAGES = {
  idle: "https://raw.githubusercontent.com/wonseokjung/solopreneur-ai-agents/main/agents/kodari/assets/kodari_salute.png",
  focus: "https://raw.githubusercontent.com/wonseokjung/solopreneur-ai-agents/main/agents/kodari/assets/kodari_typing.png",
  break: "https://raw.githubusercontent.com/wonseokjung/solopreneur-ai-agents/main/agents/kodari/assets/kodari_coffee.png",
  paused: "https://raw.githubusercontent.com/wonseokjung/solopreneur-ai-agents/main/agents/kodari/assets/kodari_thinking.png",
  finished: "https://raw.githubusercontent.com/wonseokjung/solopreneur-ai-agents/main/agents/kodari/assets/kodari_success.png"
};

export default function KomodoroCharacter({ status }) {
  const [currentMessage, setCurrentMessage] = useState('');

  // 상태가 바뀌거나 컴포넌트가 로드될 때 무작위 격려 메시지 선택
  useEffect(() => {
    const list = MESSAGES[status] || MESSAGES.idle;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentMessage(list[randomIndex]);

    // 15초마다 주기적으로 말풍선 멘트 교체하여 대표님이 덜 심심하게 하기
    const interval = setInterval(() => {
      const currentList = MESSAGES[status] || MESSAGES.idle;
      const nextIndex = Math.floor(Math.random() * currentList.length);
      setCurrentMessage(currentList[nextIndex]);
    }, 15000);

    return () => clearInterval(interval);
  }, [status]);

  const imageSrc = IMAGES[status] || IMAGES.idle;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-brand-card border border-brand-border rounded-3xl shadow-xl max-w-sm mx-auto transition-all duration-300 hover:bg-brand-card-hover hover:scale-[1.02]">
      {/* 귀여운 코다리 부장님 말풍선 */}
      <div className="relative mb-6 px-4 py-3 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl text-indigo-200 text-sm md:text-base font-cute tracking-wide shadow-md animate-bubble text-center">
        {currentMessage}
        {/* 말풍선 꼬리 */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-indigo-950/60 z-0"></div>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-indigo-500/30 -z-10"></div>
      </div>

      {/* 캐릭터 이미지 콘테이너 */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center bg-gradient-to-tr from-pink-900/30 to-indigo-900/20 rounded-full p-2 border border-brand-border shadow-inner">
        {/* 타이머 작동 중일 때 뒤에 살며시 도는 귀여운 네온 백라이트 링 */}
        {status === 'focus' && (
          <div className="absolute inset-0 rounded-full border-2 border-pink-500/40 animate-pulse-ring -z-10"></div>
        )}
        {status === 'break' && (
          <div className="absolute inset-0 rounded-full border-2 border-pink-300/30 animate-pulse-ring -z-10"></div>
        )}

        <img 
          src={imageSrc} 
          alt={`코다리 부장 - ${status}`} 
          className="w-full h-full object-contain animate-cute-bounce select-none"
          draggable="false"
        />
      </div>

      {/* 역할 설명 태그 */}
      <span className="mt-4 px-3 py-1 bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold tracking-wider uppercase">
        AI 개발부장 코다리 🐟
      </span>
    </div>
  );
}
