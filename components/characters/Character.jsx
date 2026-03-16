import { motion, AnimatePresence } from 'framer-motion'

const CHARACTERS = {
  max: {
    name: 'Max',
    title: 'Max the Panda',
    emoji: '🐼',
    color: '#F4A261',
    bg: '#FFF8E7',
    world: 'Math Mountain',
  },
  lila: {
    name: 'Lila',
    title: 'Lila the Owl',
    emoji: '🦉',
    color: '#52B788',
    bg: '#F0FFF4',
    world: 'Story Forest',
  },
  nova: {
    name: 'Nova',
    title: 'Nova the Fox',
    emoji: '🦊',
    color: '#4895EF',
    bg: '#E8F4FD',
    world: 'Science Ocean',
  },
  orbit: {
    name: 'Orbit',
    title: 'Orbit the Turtle',
    emoji: '🐢',
    color: '#F72585',
    bg: '#FFF0F6',
    world: 'Discovery Space',
  },
  juno: {
    name: 'Juno',
    title: 'Juno the Rabbit',
    emoji: '🐰',
    color: '#B197FC',
    bg: '#F3F0FF',
    world: 'All Worlds',
  },
}

// Messages by mood
const MESSAGES = {
  intro: {
    max: ["Hi! I'm Max the Panda! Let's go on a math adventure!", "Ready to learn some cool math tricks?", "Numbers are so much fun! Let me show you!"],
    lila: ["Hello friend! I'm Lila! Let's read and learn together!", "Words are magical! I'll help you understand them!"],
    nova: ["Hey explorer! I'm Nova! Science is amazing!", "Let's discover how the world works!"],
    orbit: ["Greetings, traveller! I'm Orbit! Let's explore our world!"],
    juno: ["Welcome to JoyJump! I'm Juno! You're going to love it here!"],
  },
  correct: [
    "Amazing! You got it! ⭐",
    "Wow, you're SO smart! 🌟",
    "Perfect! That's exactly right! 🎉",
    "Brilliant! I knew you could do it! ✨",
    "Superstar! You nailed it! 🌈",
    "Fantastic! High five! 🙌",
  ],
  wrong: [
    "Oops! Let's try again — you're almost there! 💪",
    "Not quite! I know you can get it! 🌟",
    "Good try! Let me give you a hint... 💡",
    "Nearly! Try one more time! 🎯",
    "Keep going — every mistake helps us learn! 🌱",
  ],
  hint: [
    "Here's a little hint for you...",
    "Psst! Try thinking about it this way...",
    "Hmm, let me help you think...",
    "I have a secret tip!",
  ],
  celebrate: [
    "You did it!! You're a SUPERSTAR! 🌟🎉",
    "AMAZING! I'm SO proud of you! 🏆✨",
    "WOOHOO! You completed the lesson! 🎊🌈",
  ],
}

function getRandomMessage(mood, character = 'max') {
  const charMessages = MESSAGES[mood]?.[character] || MESSAGES[mood]
  if (Array.isArray(charMessages)) {
    return charMessages[Math.floor(Math.random() * charMessages.length)]
  }
  return charMessages
}

// The character avatar — large animated emoji
export function CharacterAvatar({ character = 'max', size = 'md', animate = true }) {
  const char = CHARACTERS[character]
  const sizes = { sm: 'text-4xl', md: 'text-6xl', lg: 'text-8xl', xl: 'text-9xl' }

  return (
    <motion.div
      className={`${sizes[size]} select-none`}
      animate={animate ? { y: [0, -8, 0] } : {}}
      transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      {char.emoji}
    </motion.div>
  )
}

// Character with speech bubble
export function CharacterSpeech({ character = 'max', message, mood = 'intro', className = '' }) {
  const char = CHARACTERS[character]
  const displayMessage = message || getRandomMessage(mood, character)

  return (
    <div className={`flex items-end gap-4 ${className}`}>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex-shrink-0"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-joy"
          style={{ backgroundColor: char.bg, border: `3px solid ${char.color}` }}
        >
          {char.emoji}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayMessage}
          initial={{ opacity: 0, x: -10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="speech-bubble max-w-xs flex-1"
          style={{ borderColor: char.color }}
        >
          <p className="font-body font-semibold text-gray-700 text-base leading-relaxed">
            {displayMessage}
          </p>
          <p className="text-xs text-gray-400 mt-1 font-body">{char.title}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Compact character badge (for top bar)
export function CharacterBadge({ character = 'max' }) {
  const char = CHARACTERS[character]
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold font-button shadow-card"
      style={{ backgroundColor: char.bg, color: char.color, border: `2px solid ${char.color}40` }}
    >
      <span className="text-xl">{char.emoji}</span>
      <span>{char.name}</span>
    </div>
  )
}

export { CHARACTERS, MESSAGES, getRandomMessage }
export default CharacterSpeech
