import { motion } from 'framer-motion'
import Link from 'next/link'
import { useJoyStore } from '../lib/store'
import { ProgressBar } from '../components/ui/Rewards'
import rewardsData from '../data/rewards/rewards.json'

const WORLDS = [
  {
    id: 'math',
    title: 'Math Mountain',
    emoji: '🏔️',
    character: '🐼',
    characterName: 'Max',
    color: '#F4A261',
    bg: '#FFF8E7',
    border: '#FDDCB5',
    description: 'Numbers, shapes and patterns!',
    href: '/worlds/math',
    unlocked: true,
  },
  {
    id: 'story',
    title: 'Story Forest',
    emoji: '🌿',
    character: '🦉',
    characterName: 'Lila',
    color: '#52B788',
    bg: '#F0FFF4',
    border: '#B8F2E6',
    description: 'English grammar and stories!',
    href: '/worlds/story',
    requiredStars: 20,
  },
  {
    id: 'science',
    title: 'Science Ocean',
    emoji: '🔬',
    character: '🦊',
    characterName: 'Nova',
    color: '#4895EF',
    bg: '#E8F4FD',
    border: '#A7D8FF',
    description: 'Animals, plants and beyond!',
    href: '/worlds/science',
    requiredStars: 40,
  },
  {
    id: 'discovery',
    title: 'Discovery Space',
    emoji: '🌍',
    character: '🐢',
    characterName: 'Orbit',
    color: '#F72585',
    bg: '#FFF0F6',
    border: '#FFB3D0',
    description: 'India, continents and history!',
    href: '/worlds/discovery',
    requiredStars: 60,
  },
  {
    id: 'hindi',
    title: 'Hindi World',
    emoji: '🏵️',
    character: '🐰',
    characterName: 'Juno',
    color: '#E76F51',
    bg: '#FFF5F2',
    border: '#FDDCB5',
    description: 'Hindi grammar and stories!',
    href: '/worlds/hindi',
    requiredStars: 30,
  },
  {
    id: 'creativity',
    title: 'Creativity Island',
    emoji: '🎨',
    character: '🌟',
    characterName: 'Spark',
    color: '#7209B7',
    bg: '#F3F0FF',
    border: '#CDB4DB',
    description: 'Art, computers and projects!',
    href: '/worlds/creativity',
    requiredStars: 80,
  },
]

export default function Home() {
  const { child, stars, streak, progress, unlockedWorlds } = useJoyStore()

  const completedLessons = Object.values(progress).filter((p) => p.completed).length
  const greetings = ['Good morning', 'Hello', 'Welcome back', 'Hi there']
  const greeting = greetings[new Date().getHours() < 12 ? 0 : new Date().getHours() < 17 ? 1 : 2]

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="world-map-bg rounded-3xl p-6 text-center relative overflow-hidden"
      >
        {/* Floating emojis background */}
        {['🌟', '⭐', '✨', '🎉', '🌈'].map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-20 pointer-events-none"
            style={{ left: `${10 + i * 20}%`, top: `${20 + (i % 2) * 40}%` }}
            animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            {e}
          </motion.span>
        ))}

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-7xl mb-3"
        >
          🌈
        </motion.div>
        <h1 className="font-heading text-4xl text-[#E76F51] mb-1">
          {greeting}, {child.name}!
        </h1>
        <p className="font-body text-gray-500 text-lg">
          Ready for today's adventure? 🚀
        </p>

        {/* Streak badge */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#FFD6A5] text-[#9C4A00] px-4 py-2 rounded-full font-bold mt-3"
          >
            🔥 {streak} day streak — amazing!
          </motion.div>
        )}

        {/* Quick stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="font-heading text-2xl text-[#F4A261]">{stars}</div>
            <div className="font-body text-xs text-gray-400">Stars</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-2xl text-[#52B788]">{completedLessons}</div>
            <div className="font-body text-xs text-gray-400">Lessons</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-2xl text-[#B197FC]">{unlockedWorlds.length}</div>
            <div className="font-body text-xs text-gray-400">Worlds</div>
          </div>
        </div>
      </motion.div>

      {/* Continue button */}
      <div className="text-center">
        <Link href="/worlds/math">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="joy-btn-primary text-2xl px-10 py-5 shadow-joy-lg"
          >
            ▶ Keep Learning! 🐼
          </motion.button>
        </Link>
      </div>

      {/* World Map */}
      <section>
        <h2 className="font-heading text-3xl text-gray-800 mb-4 flex items-center gap-2">
          🗺️ Your Learning Worlds
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLDS.map((world, i) => {
            const isUnlocked = world.unlocked || unlockedWorlds.includes(world.id)
            const starsNeeded = world.requiredStars || 0
            const canUnlock = !isUnlocked && stars >= starsNeeded

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={isUnlocked ? { scale: 1.03, y: -4 } : {}}
              >
                {isUnlocked ? (
                  <Link href={world.href}>
                    <WorldCard world={world} unlocked />
                  </Link>
                ) : (
                  <WorldCard world={world} unlocked={false} starsNeeded={starsNeeded} currentStars={stars} />
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Next unlock hint */}
      {stars < 20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#F3F0FF] rounded-3xl p-5 flex items-center gap-4"
        >
          <span className="text-4xl">🔓</span>
          <div>
            <p className="font-heading text-lg text-[#7209B7]">Unlock Story Forest!</p>
            <p className="font-body text-sm text-gray-500">
              Earn {20 - stars} more ⭐ stars in Math Mountain to unlock Lila the Owl's world!
            </p>
            <div className="mt-2 max-w-xs">
              <ProgressBar current={stars} total={20} color="#B197FC" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Parent dashboard link */}
      <div className="text-center">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 font-body text-sm"
          >
            📊 Parent Dashboard
          </motion.button>
        </Link>
      </div>
    </div>
  )
}

function WorldCard({ world, unlocked, starsNeeded, currentStars }) {
  return (
    <div
      className={`joy-card cursor-pointer transition-all relative overflow-hidden ${unlocked ? 'hover:shadow-joy' : 'opacity-70'}`}
      style={{ backgroundColor: world.bg, border: `3px solid ${world.border}` }}
    >
      {/* Unlock overlay */}
      {!unlocked && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl z-10 flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">🔒</span>
          <p className="font-heading text-lg text-gray-600">Locked</p>
          <p className="font-body text-sm text-gray-400">Need {starsNeeded} ⭐ stars</p>
          <div className="w-32 mt-1">
            <ProgressBar current={currentStars} total={starsNeeded} color={world.color} />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-4xl mb-1">{world.emoji}</div>
          <h3 className="font-heading text-xl" style={{ color: world.color }}>{world.title}</h3>
          <p className="font-body text-sm text-gray-500 mt-0.5">{world.description}</p>
        </div>
        <div className="text-3xl">{world.character}</div>
      </div>

      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-button"
        style={{ backgroundColor: `${world.color}20`, color: world.color }}
      >
        {world.characterName} guides you!
      </div>
    </div>
  )
}
