import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJoyStore } from '../../lib/store'
import { fireConfetti, playSound } from '../../lib/celebration'
import CharacterSpeech, { CharacterAvatar } from '../characters/Character'
import GameRouter from '../games/GameRouter'
import { RewardScreen } from '../ui/Rewards'

// Lesson phases: story → game → quiz → reward
const PHASES = ['story', 'game', 'quiz', 'reward']

// Quiz component (3 questions, multiple choice)
function QuizPhase({ quiz, character, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  const question = quiz[currentQ]
  const isCorrect = selected === question?.correct
  const isLast = currentQ === quiz.length - 1

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
  }

  const handleNext = () => {
    const newAnswers = [...answers, { q: currentQ, correct: isCorrect }]
    setAnswers(newAnswers)
    if (isLast) {
      const score = newAnswers.filter((a) => a.correct).length
      onComplete({ score: Math.round((score / quiz.length) * 3), correct: score >= Math.ceil(quiz.length / 2) })
    } else {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <CharacterSpeech character={character} message={`Quiz time! Question ${currentQ + 1} of ${quiz.length} 🎯`} />

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {quiz.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
            i < currentQ ? 'bg-[#52B788]' : i === currentQ ? 'bg-[#F4A261]' : 'bg-gray-200'
          }`} />
        ))}
      </div>

      <div className="game-area">
        <motion.p
          key={currentQ}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-xl text-center text-gray-800 mb-6"
        >
          {question.q}
        </motion.p>

        <div className="w-full grid grid-cols-1 gap-3">
          {question.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={!answered ? { scale: 1.02 } : {}}
              whileTap={!answered ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`answer-option text-left ${answered && i === question.correct ? 'correct' : ''} ${answered && i === selected && i !== question.correct ? 'wrong' : ''}`}
            >
              <span className="font-body font-bold text-gray-400 mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      {answered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 text-center ${isCorrect ? 'bg-[#F0FFF4] border-2 border-[#52B788]' : 'bg-[#FFF0F0] border-2 border-[#FF9F9F]'}`}
        >
          <p className="font-heading text-xl mb-2">{isCorrect ? '✅ Correct!' : `❌ The answer was: ${question.options[question.correct]}`}</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="joy-btn-primary text-base py-3 px-8"
          >
            {isLast ? 'Finish Quiz! 🎉' : 'Next Question →'}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// Story phase
function StoryPhase({ lesson, onContinue }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="text-8xl"
      >
        {lesson.character === 'max' ? '🐼' : lesson.character === 'lila' ? '🦉' : '🦊'}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-card border-4 border-[#A7D8FF] p-6 max-w-lg w-full"
      >
        <h2 className="font-heading text-2xl text-[#E76F51] mb-3 text-center">{lesson.title}</h2>
        <p className="font-body text-gray-700 text-lg leading-relaxed">{lesson.story}</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="joy-btn-primary text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Let's Play! 🎮
      </motion.button>
    </div>
  )
}

// Main lesson engine
export default function LessonEngine({ lesson, onFinish }) {
  const [phase, setPhase] = useState(0) // index into PHASES
  const [gameScore, setGameScore] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showReward, setShowReward] = useState(false)

  const { addStars, addCoins, addBadge, markLessonComplete } = useJoyStore()

  const currentPhase = PHASES[phase]

  const handleStoryDone = useCallback(() => setPhase(1), [])

  const handleGameDone = useCallback(({ score }) => {
    setGameScore(score)
    setPhase(2)
  }, [])

  const handleQuizDone = useCallback(async ({ score }) => {
    setQuizScore(score)
    const totalStars = Math.round((gameScore + score) / 2)
    const coins = lesson.rewards.coins

    // Apply rewards
    addStars(totalStars)
    addCoins(coins)
    if (lesson.rewards.badge) addBadge(lesson.rewards.badge)
    markLessonComplete(lesson.id, totalStars)

    // Celebrate!
    playSound('reward')
    await fireConfetti('side')

    setShowReward(true)
  }, [gameScore, lesson, addStars, addCoins, addBadge, markLessonComplete])

  const handleRewardDone = useCallback(() => {
    onFinish({ stars: Math.round((gameScore + quizScore) / 2) })
  }, [gameScore, quizScore, onFinish])

  const character = lesson.character || 'max'

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Phase indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {PHASES.slice(0, 3).map((p, i) => (
          <div key={p} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-button font-bold transition-all ${
            i === phase ? 'bg-[#F4A261] text-white' : i < phase ? 'bg-[#52B788] text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {i < phase ? '✅' : i === phase ? '▶' : '○'}
            {p === 'story' ? 'Story' : p === 'game' ? 'Game' : 'Quiz'}
          </div>
        ))}
      </div>

      {/* Phase content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {currentPhase === 'story' && (
            <StoryPhase lesson={lesson} onContinue={handleStoryDone} />
          )}
          {currentPhase === 'game' && lesson.game && (
            <GameRouter
              game={lesson.game}
              character={character}
              onComplete={handleGameDone}
            />
          )}
          {currentPhase === 'quiz' && lesson.quiz && (
            <QuizPhase
              quiz={lesson.quiz}
              character={character}
              onComplete={handleQuizDone}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reward overlay */}
      {showReward && (
        <RewardScreen
          stars={Math.round((gameScore + quizScore) / 2)}
          coins={lesson.rewards.coins}
          badge={lesson.rewards.badge ? { title: lesson.rewards.badge } : null}
          onContinue={handleRewardDone}
        />
      )}
    </div>
  )
}
