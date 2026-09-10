import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#2563EB', '#60A5FA', '#93C5FD'] // Blue
  });
  fire(0.2, {
    spread: 60,
    colors: ['#EA580C', '#FB923C', '#FDBA74'] // Orange
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#10B981', '#34D399', '#06B6D4'] // Eco Green & Cyan
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}

export function fireScorePop(x?: number, y?: number) {
  confetti({
    particleCount: 25,
    spread: 40,
    startVelocity: 20,
    origin: {
      x: x !== undefined ? x / window.innerWidth : 0.5,
      y: y !== undefined ? y / window.innerHeight : 0.3
    },
    colors: ['#10B981', '#3B82F6', '#F59E0B']
  });
}
