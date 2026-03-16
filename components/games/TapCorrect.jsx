import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSpeech from '../characters/Character'

export default function TapCorrect({ game, character = 'max', onComplete }) {
  const [selected, setSelected] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const isCorrect = selected === game.correct
  const isAnswered = selected !== null

  const handleSelect = useCallback((idx) => {
    if (isAnswered) return
    setSelected(idx)
    setAttempts((a) => a + 1)
  }, [isAnswered])

  const handleNext = useCallback(() => {
    const score = attempts === 1 ? 3 : attempts === 2 ? 2 : 1
    onComplete({ score, correct: isCorrect })
  }, [attempts, isCorrect, onComplete])

  const handleRetry = useCallback(() => {
    setSelected(null)
    setShowHint(true)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Character */}
      <CharacterSpeech
        character={character}
        message={
          !isAnswered ? null
          : isCorrect ? null
          : null
        }
        mood={!isAnswered ? 'intro' : isCorrect ? 'correct' : 'wrong'}
      />

      {/* Hint */}
      <AnimatePresence>
        {showHint && !isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#FFF3B0] border-2 border-[#FFD700] rounded-2xl p-4 flex items-start gap-3"
          >
            <span className="text-2xl">💡</span>
            <p className="font-body font-semibold text-[#7B4F00]">{game.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <div className="game-area">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl text-center text-gray-800 px-4"
        >
          {game.question}
        </motion.h2>

        {/* Options */}
        <div className="w-full grid grid-cols-2 gap-3">
          {game.options.map((option, idx) => {
            let className = 'answer-option'
            if (isAnswered) {
              if (idx === game.correct) className += ' correct'
              else if (idx === selected) className += ' wrong'
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isAnswered ? { scale: 1.03 } : {}}
                whileTap={!isAnswered ? { scale: 0.97 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={className}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
              >
                {isAnswered && idx === game.correct && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mr-2"
                  >✅</motion.span>
                )}
                {isAnswered && idx === selected && idx !== game.correct && (
                  <span className="mr-2">❌</span>
                )}
                {option}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-5 text-center ${
              isCorrect
                ? 'bg-[#F0FFF4] border-2 border-[#52B788]'
                : 'bg-[#FFF0F0] border-2 border-[#FF9F9F]'
            }`}
          >
            <p className="font-heading text-2xl mb-2">
              {isCorrect ? '🎉 Correct! Great job!' : '💪 Not quite — let\'s try again!'}
            </p>

            <div className="flex justify-center gap-3 mt-3">
              {!isCorrect && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  className="joy-btn bg-[#FF9F9F] text-white text-lg py-3 px-6"
                >
                  Try Again 🔄
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="joy-btn-primary text-lg py-3 px-6"
              >
                {isCorrect ? 'Next! →' : 'Continue →'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint button (before answering) */}
      {!isAnswered && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="text-center text-sm font-body text-gray-400 hover:text-gray-600 underline"
        >
          Need a hint? 💡
        </button>
      )}
    </div>
  )
}
