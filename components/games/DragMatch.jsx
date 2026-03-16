import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSpeech from '../characters/Character'

export default function DragMatch({ game, character = 'max', onComplete }) {
  const [matches, setMatches] = useState({}) // { itemIndex: matchIndex }
  const [dragging, setDragging] = useState(null)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState({})

  const allMatched = Object.keys(matches).length === game.pairs.length

  const handleDragStart = (idx) => setDragging(idx)
  const handleDragEnd = () => setDragging(null)

  const handleDrop = useCallback((matchIdx) => {
    if (dragging === null || checked) return
    setMatches((prev) => ({ ...prev, [dragging]: matchIdx }))
    setDragging(null)
  }, [dragging, checked])

  const handleCheck = useCallback(() => {
    const newResults = {}
    let correctCount = 0
    game.pairs.forEach((pair, i) => {
      const isCorrect = matches[i] === i
      newResults[i] = isCorrect
      if (isCorrect) correctCount++
    })
    setResults(newResults)
    setChecked(true)
  }, [matches, game.pairs])

  const handleReset = useCallback(() => {
    setMatches({})
    setChecked(false)
    setResults({})
  }, [])

  const allCorrect = checked && Object.values(results).every(Boolean)
  const score = checked ? Math.round((Object.values(results).filter(Boolean).length / game.pairs.length) * 3) : 0

  return (
    <div className="flex flex-col gap-6">
      <CharacterSpeech
        character={character}
        mood={!checked ? 'intro' : allCorrect ? 'correct' : 'wrong'}
      />

      <div className="game-area">
        <p className="font-heading text-xl text-center text-gray-700 mb-2">{game.question}</p>
        <p className="text-sm text-gray-400 font-body text-center mb-4">Drag each item to its match!</p>

        <div className="w-full grid grid-cols-2 gap-6">
          {/* Left: items to drag */}
          <div className="flex flex-col gap-3">
            <p className="font-button font-bold text-gray-500 text-sm text-center">Drag these →</p>
            {game.pairs.map((pair, i) => {
              const isMatched = matches[i] !== undefined
              const isCorrect = results[i]
              return (
                <motion.div
                  key={i}
                  draggable={!checked && !isMatched}
                  onDragStart={() => handleDragStart(i)}
                  onDragEnd={handleDragEnd}
                  whileHover={!checked && !isMatched ? { scale: 1.05 } : {}}
                  whileTap={!checked && !isMatched ? { scale: 0.95 } : {}}
                  className={`drag-item text-center text-base select-none
                    ${isMatched ? 'opacity-40 cursor-not-allowed' : 'cursor-grab'}
                    ${checked && isCorrect === true ? 'bg-[#F0FFF4] border-2 border-[#52B788]' : ''}
                    ${checked && isCorrect === false ? 'bg-[#FFF0F0] border-2 border-[#FF9F9F]' : ''}
                    ${!checked ? 'bg-[#A7D8FF] text-[#1A5276]' : ''}
                  `}
                >
                  {pair.item}
                  {checked && (isCorrect ? ' ✅' : ' ❌')}
                </motion.div>
              )
            })}
          </div>

          {/* Right: drop targets */}
          <div className="flex flex-col gap-3">
            <p className="font-button font-bold text-gray-500 text-sm text-center">← Drop here</p>
            {game.pairs.map((pair, i) => {
              const matchedItemIdx = Object.entries(matches).find(([, v]) => v === i)?.[0]
              const isFilled = matchedItemIdx !== undefined
              return (
                <div
                  key={i}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  className={`drop-zone text-sm font-body font-semibold text-center p-3 min-h-[52px]
                    ${isFilled ? 'filled' : ''}
                    ${dragging !== null && !checked ? 'over border-[#B197FC] bg-[#F3F0FF]' : ''}
                  `}
                >
                  {isFilled
                    ? <span className="text-[#2D6A4F] font-bold">{game.pairs[matchedItemIdx].item} →</span>
                    : <span className="text-gray-400">{pair.match}</span>
                  }
                  {!isFilled && <span className="block text-xs text-[#52B788] mt-0.5">{pair.match}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="bg-[#FFF3B0] border-2 border-[#FFD700] rounded-2xl p-3 flex gap-2 items-start">
        <span className="text-xl">💡</span>
        <p className="font-body text-sm text-[#7B4F00] font-semibold">{game.hint}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        {!checked && (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="joy-btn bg-gray-200 text-gray-700 text-base py-3 px-6"
            >
              Reset 🔄
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheck}
              disabled={!allMatched}
              className={`joy-btn-primary text-base py-3 px-8 ${!allMatched ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Check Answers! ✅
            </motion.button>
          </>
        )}

        {checked && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center"
            >
              <p className="font-heading text-2xl mb-3">
                {allCorrect ? '🎉 Perfect Match!' : `⭐ ${Object.values(results).filter(Boolean).length}/${game.pairs.length} correct!`}
              </p>
              <div className="flex gap-3 justify-center">
                {!allCorrect && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="joy-btn bg-[#FFD6A5] text-[#7B4F00] text-base py-3 px-6"
                  >
                    Try Again 🔄
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onComplete({ score, correct: allCorrect })}
                  className="joy-btn-primary text-base py-3 px-8"
                >
                  Continue →
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
