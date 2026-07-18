export function errorHandler(err, req, res, _next) {
  console.error(`[Error] ${err.message}`, err.stack)

  if (err.name === 'ValidationError' || err.type === 'validation') {
    return res.status(400).json({ error: 'Validation failed', details: err.message })
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 25MB.' })
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' })
  }

  if (err.message === 'Only audio files are allowed') {
    return res.status(400).json({ error: 'Only audio files are allowed' })
  }

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' })
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource not found' })
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }

  res.status(500).json({ error: 'Internal server error' })
}
