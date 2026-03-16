import { motion } from 'framer-motion'
import { useJoyStore } from '../../lib/store'
import mathData from '../../data/curriculum/math-mountain.json'

function getAllLessons() {
  const lessons = []
  mathData.topics.forEach((topic) => {
    topic.skills.forEach((skill) => {
      skill.lessons.forEach((lesson) => {
        lessons.push({ ...lesson, topicTitle: topic.title, topicEmoji: topic.emoji })
      })
    })
  })
  return lessons
}

export default function Dashboard() {
  const { child, stars, coins, streak, badges, progress } = useJoyStore()
  const allLessons = getAllLessons()

  const completedLessons = allLessons.filter((l) => progress[l.id]?.completed)
  const totalLessons = allLessons.length
  const completionPct = Math.round((completedLessons.length / totalLessons) * 100)

  // Topic breakdown
  const topicStats = mathData.topics.map((topic) => {
    let done = 0, total = 0
    topic.skills.forEach((skill) => {
      skill.lessons.forEach((lesson) => {
        total++
        if (progress[lesson.id]?.completed) done++
      })
    })
    const avgScore = done > 0
      ? Math.round(topic.skills.flatMap(s => s.lessons).filter(l => progress[l.id]?.completed)
          .reduce((sum, l) => sum + (progress[l.id]?.score || 0), 0) / done * 33.3)
      : 0
    return { ...topic, done, total, avgScore }
  })

  // Recent activity
  const recentActivity = Object.entries(progress)
    .filter(([, v]) => v.completed)
    .sort((a, b) => new Date(b[1].lastPlayed) - new Date(a[1].lastPlayed))
    .slice(0, 5)
    .map(([id, data]) => ({ lesson: allLessons.find(l => l.id === id), ...data }))
    .filter(item => item.lesson)

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#A7D8FF] to-[#CDB4DB] rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👩‍👧</span>
          <div>
            <h1 className="font-heading text-3xl text-white">Parent Dashboard</h1>
            <p className="font-body text-white/80">{child.name}'s learning journey</p>
          </div>
        </div>
      </motion.div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Stars Earned', value: stars, emoji: '⭐', color: '#F4A261' },
          { label: 'Coins', value: coins, emoji: '🪙', color: '#FFD700' },
          { label: 'Lessons Done', value: `${completedLessons.length}/${totalLessons}`, emoji: '📚', color: '#52B788' },
          { label: 'Day Streak', value: `${streak} days`, emoji: '🔥', color: '#E76F51' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-4 shadow-card text-center"
          >
            <div className="text-3xl mb-1">{stat.emoji}</div>
            <div className="font-heading text-2xl" style={{ color: stat.color }}>{stat.value}</div>
            <div className="font-body text-xs text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="joy-card">
        <h2 className="font-heading text-xl text-gray-700 mb-3 flex items-center gap-2">
          📊 Overall Progress — Math Mountain
        </h2>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#F4A261] to-[#FFD700]"
            />
          </div>
          <span className="font-heading text-xl text-[#F4A261]">{completionPct}%</span>
        </div>
        <p className="font-body text-sm text-gray-400">
          {completedLessons.length} of {totalLessons} lessons completed across Math Mountain
        </p>
      </div>

      {/* Topic breakdown */}
      <div className="joy-card">
        <h2 className="font-heading text-xl text-gray-700 mb-4">📚 Topic Breakdown</h2>
        <div className="flex flex-col gap-3">
          {topicStats.map((topic) => (
            <div key={topic.id} className="flex items-center gap-3">
              <span className="text-2xl w-8">{topic.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-body font-semibold text-gray-700">{topic.title}</span>
                  <span className="font-body text-gray-400">{topic.done}/{topic.total}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.total > 0 ? (topic.done / topic.total) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full bg-[#F4A261]"
                  />
                </div>
              </div>
              <div className="text-right w-12">
                {topic.done > 0 && (
                  <span className="font-heading text-sm text-[#52B788]">{topic.avgScore}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="joy-card">
          <h2 className="font-heading text-xl text-gray-700 mb-4">🏆 Badges Earned</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, i) => (
              <motion.div key={badge} initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="flex items-center gap-2 bg-[#FFF3B0] text-[#7B4F00] px-4 py-2 rounded-full font-bold font-button text-sm"
              >
                🏅 {badge.replace(/_/g, ' ')}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="joy-card">
          <h2 className="font-heading text-xl text-gray-700 mb-4">📅 Recent Activity</h2>
          <div className="flex flex-col gap-2">
            {recentActivity.map(({ lesson, score, lastPlayed }, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lesson.topicEmoji}</span>
                  <div>
                    <p className="font-body font-semibold text-sm text-gray-700">{lesson.title}</p>
                    <p className="font-body text-xs text-gray-400">
                      {lastPlayed ? new Date(lastPlayed).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <span key={s} className={`text-lg ${s <= (score || 0) ? '' : 'grayscale opacity-30'}`}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="joy-card bg-[#F0FFF4] border-2 border-[#B8F2E6]">
        <h2 className="font-heading text-xl text-[#2D6A4F] mb-3">💡 Recommendations</h2>
        {completedLessons.length === 0 ? (
          <p className="font-body text-gray-600">Start with Math Mountain! The first lesson on 4-digit numbers is waiting! 🏔️</p>
        ) : completionPct < 50 ? (
          <p className="font-body text-gray-600">Great start! Keep going with Math Mountain — {child.name} is making wonderful progress! 🌟</p>
        ) : (
          <p className="font-body text-gray-600">Excellent! {child.name} is doing amazingly well. Almost there! 🏆</p>
        )}
      </div>
    </div>
  )
}
