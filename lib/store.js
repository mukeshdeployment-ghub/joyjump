import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useJoyStore = create(
  persist(
    (set, get) => ({
      // ── Child Profile ────────────────────────────────────
      child: {
        name: 'Dhruvee',
        avatar: 'rabbit',
        grade: 3,
      },
      setChild: (child) => set({ child }),

      // ── Rewards ──────────────────────────────────────────
      stars: 0,
      coins: 0,
      badges: [],
      unlockedWorlds: ['math'],

      addStars: (n) => set((s) => ({ stars: s.stars + n })),
      addCoins: (n) => set((s) => ({ coins: s.coins + n })),
      addBadge: (badge) =>
        set((s) => ({ badges: s.badges.includes(badge) ? s.badges : [...s.badges, badge] })),
      unlockWorld: (world) =>
        set((s) => ({
          unlockedWorlds: s.unlockedWorlds.includes(world)
            ? s.unlockedWorlds
            : [...s.unlockedWorlds, world],
        })),

      // ── Progress ─────────────────────────────────────────
      // { lessonId: { completed, score, attempts, lastPlayed } }
      progress: {},

      markLessonComplete: (lessonId, score) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [lessonId]: {
              completed: true,
              score,
              attempts: (s.progress[lessonId]?.attempts || 0) + 1,
              lastPlayed: new Date().toISOString(),
            },
          },
        })),

      getLessonProgress: (lessonId) => get().progress[lessonId] || null,

      // ── Streak ───────────────────────────────────────────
      streak: 0,
      lastPlayDate: null,
      updateStreak: () => {
        const today = new Date().toDateString()
        const last = get().lastPlayDate
        if (last === today) return
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        set((s) => ({
          streak: last === yesterday ? s.streak + 1 : 1,
          lastPlayDate: today,
        }))
      },

      // ── Active lesson ────────────────────────────────────
      currentLesson: null,
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

      // ── UI state ─────────────────────────────────────────
      showCelebration: false,
      celebrationData: null,
      triggerCelebration: (data) => {
        set({ showCelebration: true, celebrationData: data })
        setTimeout(() => set({ showCelebration: false, celebrationData: null }), 3500)
      },
    }),
    {
      name: 'joyjump-storage',
      // Only persist important state
      partialize: (s) => ({
        child: s.child,
        stars: s.stars,
        coins: s.coins,
        badges: s.badges,
        unlockedWorlds: s.unlockedWorlds,
        progress: s.progress,
        streak: s.streak,
        lastPlayDate: s.lastPlayDate,
      }),
    }
  )
)
