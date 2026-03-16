import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSpeech from '../characters/Character'

export default function SortingGame({ game, character = 'max', onComplete }) {
  const [sorted, setSorted] = useState(() =>
    game.categories.map(() => [])
  )
  const [remaining, setRemaining] = useState(game.items)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState(null)
  const [draggingItem, setDraggingItem] = useState(null)

  const handleDrop = useCallback((catIdx) => {
    if (!draggingItem || checked) return
    setSorted((prev) => {
      const next = prev.map((cat) => [...cat])
      next[catIdx] = [...next[catIdx], draggingItem]
      return next
    })
    setRemaining((prev) => prev.filter((i) => i.name !== draggingItem.name))
    setDraggingItem(null)
  }, [draggingItem, checked])

  const handleRemove = useCallback((catIdx, itemName) => {
    if (checked) return
    const item = sorted[catIdx].find((i) => i.name === itemName)
    setSorted((prev) => {
      const next = prev.map((cat) => [...cat])
      next[catIdx] = next[catIdx].filter((i) => i.name !== itemName)
      return next
    })
    setRemaining((prev) => [...prev, item])
  }, [sorted, checked])

  const handleCheck = useCallback(() => {
    let correct = 0
    const itemResults = {}
    game.items.forEach((item) => {
      const placedCat = sorted.findIndex((cat) => cat.some((i) => i.name === item.name))
      const isCorrect = placedCat === item.category
      itemResults[item.name] = isCorrect
      if (isCorrect) correct++
    })
    setResults(itemResults)
    setChecked(true)
  }, [sorted, game.items])

  const handleReset = () => {
    setSorted(game.categories.map(() => []))
    setRemaining(game.items)
    setChecked(false)
    setResults(null)
  }

  const allPlaced = remaining.length === 0
  const allCorrect = results && Object.values(results).every(Boolean)
  const correctCount = results ? Object.values(results).filter(Boolean).length : 0
  const score = checked ? Math.round((correctCount / game.items.length) * 3) : 0

  const categoryColors = [
    { bg: '#E8F4FD', border: '#74C0FC', text: '#1A5276' },
    { bg: '#F0FFF4', border: '#52B788', text: '#1D4E2A' },
    { bg: '#F3F0FF', border: '#B197FC', text: '#4A235A' },
    { bg: '#FFF8E7', border: '#F4A261', text: '#7B4F00' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <CharacterSpeech
        character={character}
        mood={!checked ? 'intro' : allCorrect ? 'correct' : 'wrong'}
      />

      <div className="game-area">
        <p className="font-heading text-xl text-center text-gray-700 mb-4">{game.question}</p>

        {/* Items to sort */}
        {remaining.length > 0 && (
          <div className="mb-5 w-full">
            <p className="font-body text-sm text-gray-400 text-center mb-2">Drag these items into the right group 👇</p>
            <div className="flex flex-wrap gap-2 justify-center p-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              {remaining.map((item) => (
                <motion.div
                  key={item.name}
                  draggable
                  onDragStart={() => setDraggingItem(item)}
                  onDragEnd={() => setDraggingItem(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="drag-item bg-[#CDB4DB] text-[#4A235A] text-sm cursor-grab px-4 py-2"
                >
                  {item.name}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Category drop zones */}
        <div className={`w-full grid gap-3 ${game.categories.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {game.categories.map((cat, catIdx) => {
            const colors = categoryColors[catIdx % categoryColors.length]
            return (
              <div
                key={catIdx}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(catIdx)}
                className="rounded-2xl p-3 min-h-[100px] border-2 transition-all"
                style={{
                  backgroundColor: draggingItem ? `${colors.bg}` : colors.bg,
                  borderColor: draggingItem ? colors.border : `${colors.border}88`,
                  borderStyle: 'dashed',
                }}
              >
                <p className="font-button font-bold text-sm mb-2 text-center" style={{ color: colors.text }}>
                  {cat}
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {sorted[catIdx].map((item) => {
                    const isCorrect = results?.[item.name]
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        onClick={() => handleRemove(catIdx, item.name)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-bold font-button transition-all
                          ${checked
                            ? isCorrect
                              ? 'bg-[#52B788] text-white'
                              : 'bg-[#FF9F9F] text-white'
                            : 'bg-white shadow-sm hover:shadow-md'
                          }
                        `}
                        style={!checked ? { color: colors.text } : {}}
                        disabled={checked}
                        title={!checked ? 'Click to remove' : ''}
                      >
                        {item.name}
                        {checked && (isCorrect ? ' ✅' : ' ❌')}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hint */}
      <div className="bg-[#FFF3B0] border-2 border-[#FFD700] rounded-2xl p-3 flex gap-2">
        <span className="text-xl">💡</span>
        <p className="font-body text-sm text-[#7B4F00] font-semibold">{game.hint}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        {!checked && (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="joy-btn bg-gray-200 text-gray-700 text-base py-3 px-5"
            >Reset 🔄</motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleCheck}
              disabled={!allPlaced}
              className={`joy-btn-primary text-base py-3 px-8 ${!allPlaced ? 'opacity-50' : ''}`}
            >Check Answers! ✅</motion.button>
          </>
        )}
        {checked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
            <p className="font-heading text-2xl mb-3">
              {allCorrect ? '🎉 All sorted correctly!' : `⭐ ${correctCount}/${game.items.length} correct!`}
            </p>
            <div className="flex gap-3 justify-center">
              {!allCorrect && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleReset} className="joy-btn bg-[#FFD6A5] text-[#7B4F00] text-base py-3 px-5"
                >Try Again 🔄</motion.button>
              )}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onComplete({ score, correct: allCorrect })}
                className="joy-btn-primary text-base py-3 px-8"
              >Continue →</motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
