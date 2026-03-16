import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import LessonEngine from '../../../../components/layout/LessonEngine'
import mathData from '../../../../data/curriculum/math-mountain.json'

// Flatten all lessons from math curriculum
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

// Get next lesson id
function getNextLesson(currentId, allLessons) {
  const idx = allLessons.findIndex((l) => l.id === currentId)
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null
}

export default function LessonPage() {
  const router = useRouter()
  const { lessonId } = router.query

  const allLessons = useMemo(() => getAllLessons(), [])
  const lesson = useMemo(() => allLessons.find((l) => l.id === lessonId), [lessonId, allLessons])
  const nextLesson = useMemo(() => lesson ? getNextLesson(lesson.id, allLessons) : null, [lesson, allLessons])

  if (!lessonId) return <LoadingScreen />
  if (!lesson) return <NotFoundScreen />

  const handleFinish = ({ stars }) => {
    if (nextLesson) {
      router.push(`/worlds/math/lesson/${nextLesson.id}`)
    } else {
      router.push('/worlds/math')
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-body text-gray-400">
        <Link href="/worlds/math" className="hover:text-[#F4A261] transition-colors">
          {lesson.topicEmoji} {lesson.topicTitle}
        </Link>
        <span>›</span>
        <span className="text-gray-600">{lesson.title}</span>
      </div>

      {/* Lesson engine */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LessonEngine lesson={lesson} onFinish={handleFinish} />
      </motion.div>

      {/* Skip to next (small link) */}
      {nextLesson && (
        <div className="text-center mt-4">
          <Link href={`/worlds/math/lesson/${nextLesson.id}`}>
            <span className="text-xs font-body text-gray-300 hover:text-gray-400 cursor-pointer">
              Skip to next lesson →
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-6xl"
      >🌟</motion.div>
      <p className="font-heading text-xl text-gray-400">Loading your lesson...</p>
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <span className="text-6xl">🐼</span>
      <p className="font-heading text-2xl text-gray-600">Hmm, lesson not found!</p>
      <p className="font-body text-gray-400">Let's go back to Math Mountain.</p>
      <Link href="/worlds/math">
        <button className="joy-btn-primary mt-2">Back to Math Mountain 🏔️</button>
      </Link>
    </div>
  )
}
