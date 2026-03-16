import { motion, AnimatePresence } from 'framer-motion'
import { useJoyStore } from '../../lib/store'

// Top bar reward display
export function RewardBar() {
  const { stars, coins, streak, child } = useJoyStore()

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Stars */}
      <motion.div
        className="star-count"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-xl">⭐</span>
        <span className="font-heading text-lg">{stars}</span>
      </motion.div>

      {/* Coins */}
      <motion.div
        className="coin-count"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-xl">🪙</span>
        <span className="font-heading text-lg">{coins}</span>
      </motion.div>

      {/* Streak */}
      {streak > 0 && (
        <div className="inline-flex items-center gap-1 bg-[#FFD6A5] text-[#9C4A00] px-3 py-1.5 rounded-full font-bold text-sm">
          <span>🔥</span>
          <span className="font-heading">{streak} day streak!</span>
        </div>
      )}
    </div>
  )
}

// Star animation that bursts when earned
export function StarBurst({ count = 1, x, y }) {
  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.5, 1],
            opacity: [1, 1, 0],
            x: (Math.random() - 0.5) * 120,
            y: -80 - Math.random() * 60,
          }}
          transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  )
}

// Lesson reward screen shown after completion
export function RewardScreen({ stars = 3, coins = 10, badge = null, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-joy-lg"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-8xl mb-4"
        >
          🎉
        </motion.div>

        <h2 className="font-heading text-3xl text-[#E76F51] mb-2">Amazing!</h2>
        <p className="font-body text-gray-600 mb-6">You completed the lesson!</p>

        {/* Stars earned */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.15, type: 'spring', damping: 8 }}
              className={`text-5xl ${i < stars ? '' : 'grayscale opacity-30'}`}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        {/* Coins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="inline-flex items-center gap-2 bg-[#FFF3B0] text-[#B7791F] px-5 py-2.5 rounded-full font-bold text-xl mb-4"
        >
          <span>🪙</span>
          <span className="font-heading">+{coins} coins!</span>
        </motion.div>

        {/* Badge if earned */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring' }}
            className="bg-[#F3F0FF] rounded-2xl p-4 mb-4"
          >
            <p className="font-heading text-lg text-[#7209B7]">🏆 New Badge Earned!</p>
            <p className="font-body text-sm text-gray-600 mt-1">{badge.title}</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="joy-btn-primary w-full mt-2"
        >
          Keep Going! 🚀
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Progress bar
export function ProgressBar({ current, total, color = '#F4A261' }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-body text-gray-500 mb-1">
        <span>{current} / {total} lessons</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Star rating display (read-only)
export function StarRating({ stars = 0, max = 3 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`text-2xl ${i < stars ? '' : 'grayscale opacity-30'}`}>
          ⭐
        </span>
      ))}
    </div>
  )
}
