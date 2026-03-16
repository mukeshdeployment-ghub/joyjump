import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { childId, lessonId, score, timeSpent, completed } = req.body

    if (!childId || !lessonId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase.from('progress').upsert({
      child_id: childId,
      lesson_id: lessonId,
      score,
      time_spent: timeSpent,
      completed,
      played_at: new Date().toISOString(),
    })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, data })
  }

  if (req.method === 'GET') {
    const { childId } = req.query
    if (!childId) return res.status(400).json({ error: 'childId required' })

    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('child_id', childId)
      .order('played_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
