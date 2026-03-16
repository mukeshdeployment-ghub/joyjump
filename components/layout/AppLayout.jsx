import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useJoyStore } from '../../lib/store'
import { RewardBar } from '../ui/Rewards'

export default function AppLayout({ children }) {
  const router = useRouter()
  const { child } = useJoyStore()
  const isHome = router.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b-2 border-[#A7D8FF]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo / back */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-[#A7D8FF] flex items-center justify-center text-xl font-bold text-[#1A5276]"
              >
                ←
              </motion.button>
            )}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-3xl">🌈</span>
                <span className="font-heading text-2xl text-[#E76F51] hidden sm:block">JoyJump</span>
              </motion.div>
            </Link>
          </div>

          {/* Child greeting */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">👧</span>
            <span className="font-heading text-lg text-gray-700 hidden sm:block">Hi, {child.name}!</span>
          </div>

          {/* Rewards */}
          <RewardBar />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom nav (mobile-friendly) */}
      <nav className="sticky bottom-0 bg-white border-t-2 border-[#A7D8FF] py-3 px-4">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
          <NavItem href="/" icon="🏠" label="Home" active={router.pathname === '/'} />
          <NavItem href="/worlds" icon="🗺️" label="Worlds" active={router.pathname.startsWith('/worlds')} />
          <NavItem href="/dashboard" icon="📊" label="Progress" active={router.pathname.startsWith('/dashboard')} />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label, active }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex flex-col items-center gap-1 cursor-pointer px-4 py-1 rounded-2xl transition-all ${
          active ? 'bg-[#FFF3B0]' : ''
        }`}
      >
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-button font-bold ${active ? 'text-[#E76F51]' : 'text-gray-400'}`}>
          {label}
        </span>
      </motion.div>
    </Link>
  )
}
