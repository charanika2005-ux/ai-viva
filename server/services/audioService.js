import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function transcribeAudio(filePath) {
  const fileBuffer = await fs.readFile(filePath)

  if (fileBuffer.length === 0) {
    const err = new Error('Audio file is empty')
    err.status = 400
    throw err
  }

  const ext = path.extname(filePath).toLowerCase()

  const mimeMap = {
    '.webm': 'audio/webm',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.mp4': 'audio/mp4',
  }
  const mimeType = mimeMap[ext] || 'audio/webm'

  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

  const audioPart = {
    inlineData: {
      mimeType,
      data: fileBuffer.toString('base64'),
    },
  }

  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 30000)

  try {
    const result = await model.generateContent(
      [
        audioPart,
        'Transcribe the audio above word-for-word. Return ONLY the raw transcript text, nothing else. No labels, no formatting, no quotation marks.',
      ],
      { signal: abortController.signal }
    )

    const text = result.response.text().trim()

    return {
      text,
      language: 'en',
      duration: null,
      segments: [],
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath)
  } catch {
    // file already deleted or missing
  }
}
