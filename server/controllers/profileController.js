import { getUserStats, getUserInterviews, updateUser } from '../services/supabaseService.js'

export async function getProfileStats(req, res, next) {
  try {
    const stats = await getUserStats(req.user.id)
    const recent = await getUserInterviews(req.user.id, { limit: 5 })

    res.json({
      profile: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        avatar_url: req.user.avatar_url,
        created_at: req.user.created_at,
      },
      stats,
      recentActivity: recent.interviews.map((i) => ({
        id: i.id,
        type: i.type,
        subject: i.subject,
        score: i.overall_score,
        date: i.created_at,
      })),
    })
  } catch (err) {
    next(err)
  }
}

export async function updateProfileSettings(req, res, next) {
  try {
    const { full_name, avatar_url } = req.body
    const updates = {}
    if (full_name !== undefined) updates.full_name = full_name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    updates.updated_at = new Date().toISOString()

    const user = await updateUser(req.user.id, updates)

    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name, avatar_url: user.avatar_url },
    })
  } catch (err) {
    next(err)
  }
}
