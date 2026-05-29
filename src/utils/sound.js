// Web Audio API를 사용한 귀여운 효과음 유틸리티
// 별도의 외부 오디오 리소스 없이 브라우저 자체 오실레이터를 사용하여 실시간으로 주파수를 생성해 연주합니다.

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// 귀여운 비프음 연주 헬퍼 함수
const playTone = (frequency, type, duration, startTimeOffset = 0, volume = 0.1) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTimeOffset);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime + startTimeOffset);
  // 소리가 끝날 때 뚝 끊기지 않도록 부드럽게 감쇠(Fade out)
  gainNode.gain.exponentialRampToValueAtTime(
    0.00001,
    ctx.currentTime + startTimeOffset + duration
  );

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime + startTimeOffset);
  osc.stop(ctx.currentTime + startTimeOffset + duration);
};

// 1. 완료 알림음: "도-미-솔-도" 경쾌하게 올라가는 아르페지오 (C5 -> E5 -> G5 -> C6)
export const playSuccessSound = () => {
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      playTone(freq, 'sine', 0.4, index * 0.1, 0.15);
    });
  } catch (e) {
    console.error('사운드 재생 에러:', e);
  }
};

// 2. 시작음: "도-미-솔" 뾰로롱 올라가는 소리 (triangle 타입으로 더 부드럽고 귀엽게)
export const playStartSound = () => {
  try {
    const notes = [261.63, 329.63, 392.00]; // C4, E4, G4
    notes.forEach((freq, index) => {
      playTone(freq, 'triangle', 0.25, index * 0.08, 0.12);
    });
  } catch (e) {
    console.error('사운드 재생 에러:', e);
  }
};

// 3. 일시정지음: "솔-미" 뽀롱 내려가는 소리
export const playPauseSound = () => {
  try {
    const notes = [392.00, 329.63]; // G4, E4
    notes.forEach((freq, index) => {
      playTone(freq, 'triangle', 0.25, index * 0.08, 0.12);
    });
  } catch (e) {
    console.error('사운드 재생 에러:', e);
  }
};

// 4. 일반 클릭음: 짧고 가벼운 "틱" 소리 (sine 타입)
export const playTickSound = () => {
  try {
    playTone(880, 'sine', 0.08, 0, 0.08); // A5 note, 아주 짧게
  } catch (e) {
    console.error('사운드 재생 에러:', e);
  }
};
