import { motion } from 'framer-motion'
import Link from 'next/link'
import { useJoyStore } from '../../lib/store'

const WORLDS = [
  { id: 'math', title: 'Math Mountain', emoji: '🏔️', char: '🐼', color: '#F4A261', bg: '#FFF8E7', href: '/worlds/math', always: true },
  { id: 'story', title: 'Story Forest', emoji: '🌿', char: '🦉', color: '#52B788', bg: '#F0FFF4', href: '/worlds/story', stars: 20 },
  { id: 'science', title: 'Science Ocean', emoji: '🔬', char: '🦊', color: '#4895EF', bg: '#E8F4FD', href: '/worlds/science', stars: 40 },
  { id: 'discovery', title: 'Discovery Space', emoji: '🌍', char: '🐢', color: '#F72585', bg: '#FFF0F6', href: '/worlds/discovery', stars: 60 },
  { id: 'hindi', title: 'Hindi World', emoji: '🏵️', char: '🐰', color: '#E76F51', bg: '#FFF5F2', href: '/worlds/hindi', stars: 30 },
  { id: 'creativity', title: 'Creativity Island', emoji: '🎨', char: '🌟', color: '#7209B7', bg: '#F3F0FF', href: '/worlds/creativity', stars: 80 },
]

export default function WorldsPage() {
  const { stars, unlockedWorlds } = useJoyStore()

  return (
    <div className="flex flex-col gap-6 pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="font-heading text-4xl text-gray-800">🗺️ All Worlds</h1>
        <p className="font-body text-gray-500 mt-1">Choose your adventure!</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WORLDS.map((w, i) => {
          const isUnlocked = w.always || unlockedWorlds.includes(w.id)
          return (
            <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              {isUnlocked ? (
                <Link href={w.href}>
                  <motion.div whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.98 }}
                    className="joy-card cursor-pointer hover:shadow-joy transition-all"
                    style={{ backgroundColor: w.bg, border: `3px solid ${w.color}40` }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{w.emoji}</span>
                      <div className="flex-1">
                        <h2 className="font-heading text-xl" style={{ color: w.color }}>{w.title}</h2>
                        <p className="font-body text-sm text-gray-400">{w.char} guide</p>
                      </div>
                      <span className="text-2xl text-gray-300">→</span>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div className="joy-card opacity-60 relative overflow-hidden" style={{ backgroundColor: w.bg }}>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl grayscale">{w.emoji}</span>
                    <div className="flex-1">
                      <h2 className="font-heading text-xl text-gray-400">{w.title}</h2>
                      <p className="font-body text-sm text-gray-400">🔒 Need {w.stars} ⭐ (you have {stars})</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
