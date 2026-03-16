# 🌈 JoyJump — Personalized Learning Universe

A complete educational platform built for **Dhruvee** (Class 3, Mount St. Mary's School, Delhi Cantt),
following the full 2025-26 curriculum across both terms.

> Built with love by a parent, for a child. 🐼

---

## 🚀 Quick Start (5 minutes to first lesson)

### Step 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/joyjump.git
cd joyjump
npm install
```

### Step 2 — Run locally (no setup needed!)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — **the app works fully offline** using
localStorage. Supabase is optional (for cloud sync and parent dashboard persistence).

---

## 🗄️ Supabase Setup (optional but recommended)

Supabase stores progress in the cloud so Dhruvee can learn on any device.

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier)
2. Copy your **Project URL** and **anon key** from Settings → API
3. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. In Supabase → **SQL Editor**, paste and run `supabase-schema.sql`
5. Restart the dev server: `npm run dev`

---

## ☁️ Deploy to Vercel (free)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "JoyJump v1 — Math Mountain live 🏔️"
   git remote add origin https://github.com/YOUR_USERNAME/joyjump.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo

3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Click **Deploy** — your platform is live! 🎉

Dhruvee can now access it from any browser, tablet, or phone.

---

## 📚 What's Built

### Worlds (Phase 1 — Math Mountain complete)

| World | Character | Subjects | Status |
|-------|-----------|----------|--------|
| 🏔️ Math Mountain | Max the Panda | Numbers, Geometry, Multiplication, Division, Fractions, Money, Time, Data | ✅ **Live** |
| 🌿 Story Forest | Lila the Owl | English Grammar, Literature | 🔜 Phase 2 |
| 🔬 Science Ocean | Nova the Fox | Animals, Plants, Physics, Earth | 🔜 Phase 2 |
| 🌍 Discovery Space | Orbit the Turtle | India, Geography, History | 🔜 Phase 3 |
| 🏵️ Hindi World | Juno the Rabbit | Hindi Grammar, Literature | 🔜 Phase 3 |
| 🎨 Creativity Island | — | Computer Science, Art | 🔜 Phase 4 |

### Math Mountain — Full Curriculum (Dhruvee's actual syllabus)

**First Term (April–September 2025)**
- ✅ 4-Digit Numbers (place value, comparing, ordering)
- ✅ Addition of 4-Digit Numbers (with and without carrying)
- ✅ Subtraction of 4-Digit Numbers
- ✅ Geometry and Patterns (shapes, lines, sequences)
- ✅ Multiplication (concept, tables 2/5/10, word problems)
- ✅ Division (fair sharing concept)

**Final Term (October–December 2025)**
- ✅ Fractions (halves, quarters, thirds)
- ✅ Money (Rupees and Paise)
- ✅ Time (reading clocks, hours/minutes)
- ✅ Measurement (cm, m, km)
- ✅ Handling Data (tally marks, bar graphs)

### Game Types Built

| Game | Used for |
|------|----------|
| 🎯 Tap Correct | Most lessons — choose the right answer |
| 🔗 Drag and Drop Match | Place values, vocabulary, science |
| ⚡ Speed Challenge | Times tables, mental math |
| 🗂️ Sorting Game | Categories (2D/3D shapes, herbivore/carnivore) |
| 📦 Counting Basket | Division, multiplication groups |
| 🔢 Sequence Builder | Number patterns |

---

## 🎨 Design System

| Color | Use | Hex |
|-------|-----|-----|
| Sky Blue | Backgrounds, borders | `#A7D8FF` |
| Mint Green | Success states | `#B8F2E6` |
| Peach Orange | Primary buttons | `#FFD6A5` |
| Sun Yellow | Rewards, stars | `#FFF3B0` |
| Lavender | Secondary accents | `#CDB4DB` |

**Fonts:** Fredoka (headings) · Nunito (body) · Baloo 2 (buttons)

---

## 📁 Project Structure

```
joyjump/
├── components/
│   ├── characters/    # Max, Lila, Nova, Orbit, Juno
│   ├── games/         # TapCorrect, DragMatch, SpeedChallenge, SortingGame, GameRouter
│   ├── layout/        # AppLayout, LessonEngine
│   └── ui/            # Rewards (stars, coins, progress bars)
├── data/
│   ├── curriculum/    # math-mountain.json (all lessons)
│   └── rewards/       # badges, stickers, unlocks
├── lib/
│   ├── store.js       # Zustand state (progress, rewards, child profile)
│   ├── supabase.js    # Database client
│   ├── progress.js    # Save/load helpers
│   └── celebration.js # Confetti and sound effects
├── pages/
│   ├── index.js       # Home / world map
│   ├── worlds/
│   │   ├── index.js   # All worlds
│   │   ├── math.js    # Math Mountain topic list
│   │   └── math/lesson/[lessonId].js  # Dynamic lesson page
│   ├── dashboard/     # Parent dashboard
│   └── api/progress/  # Supabase sync API
├── styles/
│   └── globals.css    # Tailwind + JoyJump design system
└── supabase-schema.sql
```

---

## ➕ Adding New Worlds (Story Forest, Science Ocean...)

1. Create a new curriculum file: `data/curriculum/story-forest.json`
   (follow the same structure as `math-mountain.json`)

2. Create the world page: `pages/worlds/story.js`
   (copy `pages/worlds/math.js` and change the data import)

3. Create the lesson route: `pages/worlds/story/lesson/[lessonId].js`

4. Add to the WORLDS array in `pages/index.js`

That's it — the LessonEngine, GameRouter, and reward system work automatically for every world.

---

## 🔊 Sound Effects

Place these files in `/public/sounds/`:
- `correct.mp3` — short sparkle sound
- `wrong.mp3` — gentle thud
- `reward.mp3` — celebration chime
- `tap.mp3` — soft pop
- `levelup.mp3` — ascending tune

Free sounds: [freesound.org](https://freesound.org) · [pixabay.com/sound-effects](https://pixabay.com/sound-effects/)

---

## 🔮 Roadmap

- **Phase 2**: Story Forest (English Grammar) + Science Ocean
- **Phase 3**: Hindi World + Discovery Space (India, Geography)
- **Phase 4**: Parent upload new syllabi → auto-generate lessons
- **Phase 5**: AI story generation with local Ollama (no subscription)

---

## 💛 Made for Dhruvee

> *"Every child is a different kind of mind."* — George Evans

This platform is built specifically around Dhruvee's Class 3 curriculum at
Mount St. Mary's School, Delhi Cantt — every topic, every character moment,
every reward designed to make her feel capable, celebrated, and excited to learn.

---

*Built with Next.js · Tailwind CSS · Framer Motion · Supabase · ❤️*
