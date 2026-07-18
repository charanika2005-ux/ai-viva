export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const INTERVIEW_TYPES = [
  { value: 'hr', label: 'HR Interview', icon: 'Users', description: 'Behavioral and situational questions' },
  { value: 'technical', label: 'Technical Interview', icon: 'Code', description: 'Coding and system design questions' },
  { value: 'viva', label: 'Viva / Oral Exam', icon: 'GraduationCap', description: 'Academic viva voce examination' },
]

export const SUBJECTS = [
  { value: 'general', label: 'General' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'data-structures', label: 'Data Structures & Algorithms' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'databases', label: 'Databases' },
  { value: 'operating-systems', label: 'Operating Systems' },
  { value: 'networking', label: 'Computer Networks' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'leadership', label: 'Leadership & Management' },
]

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { value: 'hard', label: 'Hard', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
]

export const QUESTION_COUNTS = [5, 10, 15, 20]

export const SCORE_RANGES = {
  excellent: { min: 80, label: 'Excellent', color: '#10b981' },
  good: { min: 60, label: 'Good', color: '#3b82f6' },
  average: { min: 40, label: 'Average', color: '#f59e0b' },
  poor: { min: 0, label: 'Needs Improvement', color: '#ef4444' },
}
