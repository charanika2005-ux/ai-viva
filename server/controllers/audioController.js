import { transcribeAudio, cleanupFile } from '../services/audioService.js'

export async function transcribe(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    const result = await transcribeAudio(req.file.path)

    await cleanupFile(req.file.path)

    res.json({
      transcript: result.text,
      language: result.language,
      duration: result.duration,
    })
  } catch (err) {
    if (req.file) await cleanupFile(req.file.path)
    next(err)
  }
}
