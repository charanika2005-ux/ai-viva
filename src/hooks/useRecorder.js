import { useState, useRef, useCallback, useEffect } from 'react'
import { formatTime } from '../utils/helpers'

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch (err) {
      setError('Microphone access denied')
      console.error(err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const reset = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setError(null)
  }, [])

  return {
    isRecording,
    duration,
    formattedDuration: formatTime(duration),
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    reset,
  }
}

export function useTimer(initialTime = 300) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setIsRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const reset = useCallback((newTime) => {
    setTime(newTime || initialTime)
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [initialTime])

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    isComplete: time === 0,
    start,
    stop,
    reset,
  }
}
