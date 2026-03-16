import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useJoyStore } from '../../lib/store'
import { StarRating, ProgressBar } from '../../components/ui/Rewards'
import mathData from '../../data/curriculum/math-mountain.json'

export default function MathMountain() {
  const { progress } = useJoyStore()
  const [activeTopicId, setActiveTopicId] = useState(null)

  // Compute topic completion
  function getTopicProgress(topic) {
    let total = 0, done = 0
    topic.skills.forEach((skill) => {
      skill.lessons.forEach((lesson) => {
        total++
        if (progress[lesson.id]?.completed) done++
      })
    })
    return { total, done }
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* World header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FDDCB5 100%)', border: '3px solid #FDDCB5' }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-7xl mb-3"
        >
          🐼
        </motion.div>
        <h1 className="font-heading text-4xl text-[#E76F51] mb-1">Math Mountain</h1>
        <p className="font-body text-gray-500 text-lg">
          Hi! I'm Max! Let's conquer numbers together! 🏔️
        </p>

        {/* Overall progress */}
        <div className="max-w-xs mx-auto mt-4">
          <ProgressBar
            current={Object.keys(progress).filter(k => k.startsWith('math-') && progress[k].completed).length}
            total={mathData.topics.reduce((sum, t) => sum + t.skills.reduce((s2, sk) => s2 + sk.lessons.length, 0), 0)}
            color="#F4A261"
          />
        </div>
      </motion.div>

      {/* Topic cards */}
      <div className="flex flex-col gap-4">
        {mathData.topics.map((topic, i) => {
          const { total, done } = getTopicProgress(topic)
          const isActive = activeTopicId === topic.id
          const pct = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              {/* Topic header */}
              <button
                onClick={() => setActiveTopicId(isActive ? null : topic.id)}
                className="w-full text-left bg-white rounded-3xl shadow-card p-5 flex items-center justify-between hover:shadow-joy transition-all border-2 border-[#FDDCB5] hover:border-[#F4A261]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{topic.emoji}</span>
                  <div>
                    <h2 className="font-heading text-xl text-gray-800">{topic.title}</h2>
                    <p className="font-body text-sm text-gray-400">
                      {done}/{total} lessons · {topic.month}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {pct === 100 && <span className="text-2xl">✅</span>}
                  <div className="text-right">
                    <div className="font-heading text-lg text-[#F4A261]">{pct}%</div>
                    <div className="w-16">
                      <ProgressBar current={done} total={total || 1} color="#F4A261" />
                    </div>
                  </div>
                  <span className="text-gray-400 text-xl">{isActive ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded: skills and lessons */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 pl-4 flex flex-col gap-3 pb-2">
                      {topic.skills.map((skill) => (
                        <div key={skill.id}>
                          <p className="font-button font-bold text-sm text-gray-400 mb-2 px-2">{skill.title}</p>
                          {skill.lessons.map((lesson) => {
                            const lessonProgress = progress[lesson.id]
                            return (
                              <Link key={lesson.id} href={`/worlds/math/lesson/${lesson.id}`}>
                                <motion.div
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-card mb-2 cursor-pointer border-2 hover:border-[#F4A261] transition-all"
                                  style={{ borderColor: lessonProgress?.completed ? '#52B788' : '#F5F5F5' }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                      {lessonProgress?.completed ? '✅' : '📖'}
                                    </span>
                                    <div>
                                      <p className="font-body font-semibold text-gray-700">{lesson.title}</p>
                                      <p className="font-body text-xs text-gray-400 capitalize">
                                        {lesson.type} · {lesson.game?.type?.replace('_', ' ')}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {lessonProgress?.completed && (
                                      <StarRating stars={lessonProgress.score} max={3} />
                                    )}
                                    <span className="text-[#F4A261] text-xl">→</span>
                                  </div>
                                </motion.div>
                              </Link>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#FFF8E7] rounded-3xl p-5 text-center border-2 border-[#FDDCB5]"
      >
        <span className="text-4xl">🐼</span>
        <p className="font-heading text-lg text-[#E76F51] mt-2">
          "Every lesson brings you closer to the top of Math Mountain!"
        </p>
        <p className="font-body text-sm text-gray-400 mt-1">— Max the Panda</p>
      </motion.div>
    </div>
  )
}
