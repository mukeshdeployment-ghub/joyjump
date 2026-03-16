import dynamic from 'next/dynamic'

const TapCorrect = dynamic(() => import('./TapCorrect'))
const DragMatch = dynamic(() => import('./DragMatch'))
const SpeedChallenge = dynamic(() => import('./SpeedChallenge'))
const SortingGame = dynamic(() => import('./SortingGame'))

// Sequence game (for patterns, ordering)
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSpeech from '../characters/Character'

function SequenceGame({ game, character, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const isCorrect = selected === game.correct

  return (
    <div className="flex flex-col gap-6">
      <CharacterSpeech character={character} mood={!checked ? 'intro' : isCorrect ? 'correct' : 'wrong'} />
      <div className="game-area">
        <p className="font-heading text-xl text-center text-gray-700 mb-6">{game.question}</p>
        <div className="w-full grid grid-cols-2 gap-3">
          {game.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={!checked ? { scale: 1.04 } : {}}
              whileTap={!checked ? { scale: 0.96 } : {}}
              onClick={() => { if (!checked) { setSelected(i); setChecked(true) } }}
              className={`answer-option ${checked && i === game.correct ? 'correct' : ''} ${checked && i === selected && i !== game.correct ? 'wrong' : ''}`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
        {game.hint && (
          <div className="mt-4 bg-[#FFF3B0] border-2 border-[#FFD700] rounded-2xl p-3 flex gap-2">
            <span>💡</span>
            <p className="font-body text-sm text-[#7B4F00] font-semibold">{game.hint}</p>
          </div>
        )}
      </div>
      {checked && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 text-center ${isCorrect ? 'bg-[#F0FFF4] border-2 border-[#52B788]' : 'bg-[#FFF0F0] border-2 border-[#FF9F9F]'}`}
        >
          <p className="font-heading text-xl mb-3">{isCorrect ? '🎉 Correct!' : '💪 Try again!'}</p>
          <div className="flex gap-3 justify-center">
            {!isCorrect && (
              <button onClick={() => { setSelected(null); setChecked(false) }}
                className="joy-btn bg-gray-200 text-gray-700 text-base py-3 px-5">Try Again 🔄</button>
            )}
            <button onClick={() => onComplete({ score: isCorrect ? 3 : 1, correct: isCorrect })}
              className="joy-btn-primary text-base py-3 px-8">Continue →</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Counting Basket game (visual counting)
function CountingBasket({ game, character, onComplete }) {
  // Reuses TapCorrect logic but with basket visual
  const [selected, setSelected] = useState(null)
  const isCorrect = selected === game.correct
  const isAnswered = selected !== null

  return (
    <div className="flex flex-col gap-6">
      <CharacterSpeech character={character} mood={!isAnswered ? 'intro' : isCorrect ? 'correct' : 'wrong'} />
      <div className="game-area">
        <div className="text-center mb-4">
          <span className="text-5xl">🧺</span>
          <p className="font-heading text-xl text-gray-700 mt-3">{game.question}</p>
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          {game.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={!isAnswered ? { scale: 1.04 } : {}}
              whileTap={!isAnswered ? { scale: 0.96 } : {}}
              onClick={() => !isAnswered && setSelected(i)}
              disabled={isAnswered}
              className={`answer-option ${isAnswered && i === game.correct ? 'correct' : ''} ${isAnswered && i === selected && i !== game.correct ? 'wrong' : ''}`}
            >{opt}</motion.button>
          ))}
        </div>
        {game.hint && !isAnswered && (
          <div className="mt-4 bg-[#FFF3B0] border-2 border-[#FFD700] rounded-2xl p-3 flex gap-2">
            <span>💡</span>
            <p className="font-body text-sm text-[#7B4F00] font-semibold">{game.hint}</p>
          </div>
        )}
      </div>
      {isAnswered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 text-center ${isCorrect ? 'bg-[#F0FFF4] border-2 border-[#52B788]' : 'bg-[#FFF0F0] border-2 border-[#FF9F9F]'}`}
        >
          <p className="font-heading text-2xl mb-3">{isCorrect ? '🎉 Correct!' : '💪 Try again!'}</p>
          <div className="flex gap-3 justify-center">
            {!isCorrect && (
              <button onClick={() => setSelected(null)} className="joy-btn bg-gray-200 text-gray-700 text-base py-3 px-5">Try Again 🔄</button>
            )}
            <button onClick={() => onComplete({ score: isCorrect ? 3 : 1, correct: isCorrect })}
              className="joy-btn-primary text-base py-3 px-8">Continue →</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Main game router
export default function GameRouter({ game, character = 'max', onComplete }) {
  if (!game) return <div className="text-center text-gray-400 font-body">No game loaded.</div>

  const props = { game, character, onComplete }

  switch (game.type) {
    case 'tap_correct': return <TapCorrect {...props} />
    case 'drag_match': return <DragMatch {...props} />
    case 'speed_challenge': return <SpeedChallenge {...props} />
    case 'sorting': return <SortingGame {...props} />
    case 'sequence': return <SequenceGame {...props} />
    case 'counting_basket': return <CountingBasket {...props} />
    default: return <TapCorrect {...props} />
  }
}
