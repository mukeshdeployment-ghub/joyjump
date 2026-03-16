// Confetti and celebration helpers
// Uses canvas-confetti (loaded lazily)

export async function fireConfetti(type = 'standard') {
  if (typeof window === 'undefined') return
  const confetti = (await import('canvas-confetti')).default

  const configs = {
    standard: {
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F4A261', '#FFD700', '#74C0FC', '#52B788', '#B197FC'],
    },
    stars: {
      particleCount: 60,
      spread: 90,
      origin: { y: 0.7 },
      shapes: ['star'],
      colors: ['#FFD700', '#FFE066', '#FF70A6'],
    },
    side: async () => {
      const end = Date.now() + 1500
      const colors = ['#F4A261', '#74C0FC', '#52B788']
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
      return
    },
  }

  if (type === 'side') {
    await configs.side()
  } else {
    confetti(configs[type] || configs.standard)
  }
}

export function playSound(type) {
  // Sound effect URLs — these are free sounds from freesound.org equivalents
  // Replace with your actual sound files in /public/sounds/
  const sounds = {
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/wrong.mp3',
    reward: '/sounds/reward.mp3',
    tap: '/sounds/tap.mp3',
    levelup: '/sounds/levelup.mp3',
  }

  if (typeof window === 'undefined') return
  try {
    const audio = new Audio(sounds[type])
    audio.volume = 0.5
    audio.play().catch(() => {}) // Ignore autoplay restrictions
  } catch (e) {}
}
