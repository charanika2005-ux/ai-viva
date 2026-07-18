import 'dotenv/config'
import crypto from 'crypto'
import { createUser, findUserByEmail } from './services/supabaseService.js'

const id = crypto.randomUUID()
console.log('Testing with UUID:', id)

try {
  const user = await createUser({ id, email: 'test123@example.com', full_name: 'Test User', password_hash: 'abc123' })
  console.log('SUCCESS - user created:', user)
} catch(e) {
  console.log('ERROR:', e.message, e.code)
}
