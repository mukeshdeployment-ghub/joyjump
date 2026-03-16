import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSpeech from '../characters/Character'

export default function SpeedChallenge({ game, character = 'max', onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(game.timeSeconds || 60)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const problems = game.problems
  const current = problems[currentIdx]

  // Timer
  useEffect(() => {
    if (!started || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started, finished])

  const handleAnswer = useCallback(() => {
    if (!input.trim() || finished) return
    const userAnswer = parseInt(input.trim(), 10)
    const isCorrect = userAnswer === current.a

    if (isCorrect) {
      setScore((s) => s + 1)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      setInput('')
      if (currentIdx + 1 >= problems.length) {
        setFinished(true)
        clearInterval(timerRef.current)
      } else {
        setCurrentIdx((i) => i + 1)
      }
      inputRef.current?.focus()
    }, 500)
  }, [input, current, currentIdx, problems.length, finished])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnswer()
  }

  const pct = Math.round((score / problems.length) * 100)
  const starScore = score >= problems.length * 0.9 ? 3 : score >= problems.length * 0.6 ? 2 : 1
  const timerColor = timeLeft > 20 ? '#52B788' : timeLeft > 10 ? '#F4A261' : '#E76F51'

  if (!started) {
    return (
      <div className="flex flex-col gap-6 items-center text-center">
        <CharacterSpeech character={character} message={`Let's do the ${game.title}! I'll ask you ${problems.length} questions. Type your answer and press Enter as fast as you can! Ready?`} />
        <div className="game-area w-full">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="font-heading text-2xl text-gray-800 mb-2">{game.title}</h2>
          <p className="font-body text-gray-500 mb-6">{problems.length} questions · {game.timeSeconds} seconds</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setStarted(true); setTimeout(() => inputRef.current?.focus(), 100) }}
            className="joy-btn-primary text-xl"
          >
            Let's Go! ⚡
          </motion.button>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col gap-6 items-center text-center"
      >
        <CharacterSpeech character={character} mood={pct >= 70 ? 'celebrate' : 'correct'} />
        <div className="game-area w-full">
          <div className="text-6xl mb-3">{pct >= 90 ? '🏆' : pct >= 60 ? '🌟' : '💪'}</div>
          <h2 className="font-heading text-3xl text-gray-800 mb-1">
            {score} / {problems.length} correct!
          </h2>
          <p className="font-body text-gray-500 mb-4">{pct}% score</p>

          <div className="flex justify-center gap-2 mb-6">
            {[1,2,3].map((s) => (
              <motion.span
                key={s}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: s * 0.2, type: 'spring' }}
                className={`text-4xl ${s <= starScore ? '' : 'grayscale opacity-30'}`}
              >⭐</motion.span>
            ))}
          </div>

          {/* Results breakdown */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 max-h-48 overflow-y-auto w-full">
            {problems.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
                <span className="font-body text-gray-700">{p.q}</span>
                <span className="font-bold font-heading text-gray-800">{p.a}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete({ score: starScore, correct: pct >= 70 })}
            className="joy-btn-primary w-full"
          >
            Continue! →
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Timer + progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-body text-sm text-gray-500">{currentIdx + 1} / {problems.length}</span>
        </div>
        <motion.div
          className="font-heading text-2xl font-bold px-4 py-1 rounded-full"
          style={{ color: timerColor, backgroundColor: `${timerColor}20` }}
          animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          ⏱ {timeLeft}s
        </motion.div>
        <div className="text-sm font-body text-gray-500">⭐ {score} correct</div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: timerColor }}
          animate={{ width: `${(timeLeft / game.timeSeconds) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <div className="game-area relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="text-center w-full"
          >
            <p className="font-body text-gray-400 text-sm mb-2">Question {currentIdx + 1}</p>
            <h2 className="font-heading text-4xl text-gray-800 mb-6">{current.q}</h2>

            {/* Input */}
            <div className="relative w-40 mx-auto">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="?"
                className={`w-full text-center text-3xl font-heading py-3 rounded-2xl border-4 outline-none transition-colors
                  ${feedback === 'correct' ? 'border-[#52B788] bg-[#F0FFF4]' : ''}
                  ${feedback === 'wrong' ? 'border-[#FF9F9F] bg-[#FFF0F0]' : ''}
                  ${!feedback ? 'border-[#A7D8FF] focus:border-[#74C0FC] bg-white' : ''}
                `}
                autoComplete="off"
              />
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-10 top-1/2 -translate-y-1/2 text-2xl"
                >✅</motion.div>
              )}
              {feedback === 'wrong' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-10 top-1/2 -translate-y-1/2 text-2xl"
                >❌</motion.div>
              )}
            </div>

            <p className="font-body text-gray-400 text-sm mt-3">Press Enter ↵ or tap Go!</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAnswer}
        disabled={!input.trim()}
        className={`joy-btn-primary w-full ${!input.trim() ? 'opacity-50' : ''}`}
      >
        Go! ⚡
      </motion.button>
    </div>
  )
}
