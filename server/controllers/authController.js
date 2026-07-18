import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail, updateUser, deleteUserRecord, deleteInterviewsByUser, deleteAnswersByUser } from '../services/supabaseService.js'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function register(req, res, next) {
  try {
    const { email, password, full_name } = req.body

    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const id = crypto.randomUUID()
    const password_hash = hashPassword(password)

    const user = await createUser({ id, email, full_name, password_hash })
    const token = generateToken(id)

    res.status(201).json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
      access_token: token,
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const hash = hashPassword(password)
    if (hash !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id)

    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name, avatar_url: user.avatar_url },
      access_token: token,
    })
  } catch (err) {
    next(err)
  }
}

export async function getProfile(req, res) {
  const user = req.user
  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
    },
  })
}

export async function updateProfile(req, res, next) {
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

export async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id
    await deleteAnswersByUser(userId)
    await deleteInterviewsByUser(userId)
    await deleteUserRecord(userId)
    res.json({ message: 'Account deleted successfully' })
  } catch (err) {
    next(err)
  }
}
