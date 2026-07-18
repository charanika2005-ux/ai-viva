import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const MODEL = 'gemini-3.5-flash'

async function generateJSON(prompt) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.5,
      responseMimeType: 'application/json',
    },
  })

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text)
}

export async function generateQuestions({ type, subject, difficulty, count }) {
  const typeLabels = { hr: 'HR/Behavioral', technical: 'Technical', viva: 'Viva Voce/Academic Oral Exam' }
  const diffLabels = { easy: 'basic', medium: 'intermediate', hard: 'advanced' }

  const prompt = `You are an expert interview panelist. Generate exactly ${count} ${typeLabels[type] || 'mixed'} interview questions.

Subject/Topic: ${subject}
Difficulty: ${diffLabels[difficulty] || difficulty}

Return a JSON array with exactly ${count} objects, each having:
- "id": sequential number starting from 1
- "text": the question text (clear, specific, and professional)
- "category": a short category label (e.g., "Problem Solving", "Data Structures", "Communication")
- "tips": a brief 1-sentence hint about what a good answer should cover

Rules:
- Questions must be relevant to the subject and difficulty level.
- For HR type: focus on behavioral, situational, and cultural-fit questions.
- For Technical type: focus on coding, system design, algorithms, and domain knowledge.
- For Viva type: focus on academic concepts, theory, and practical understanding.
- Return ONLY a valid JSON array, nothing else.`

  const parsed = await generateJSON(prompt)
  return Array.isArray(parsed) ? parsed : parsed.questions || []
}

export async function evaluateAnswer({ question, transcript, type }) {
  const prompt = `You are an expert interview evaluator. Evaluate the candidate's answer.

Interview Type: ${type}
Question: ${question}
Candidate's Answer: ${transcript}

Return a JSON object with exactly these fields:
- "technicalScore": number 0-100 (how technically accurate and complete)
- "communicationScore": number 0-100 (clarity, structure, articulation)
- "grammarScore": number 0-100 (grammar, vocabulary, fluency)
- "overallScore": number 0-100 (weighted average)
- "strengths": array of 2-4 strings describing strengths
- "weaknesses": array of 2-4 strings describing areas for improvement
- "suggestion": string with a specific actionable improvement tip
- "idealAnswer": string with a brief ideal/model answer

Scoring: 90-100 Exceptional | 70-89 Strong | 50-69 Adequate | Below 50 Needs improvement

Return ONLY a valid JSON object.`

  return await generateJSON(prompt)
}

export async function generateReportSummary({ evaluations, type }) {
  const avgScores = {
    technical: evaluations.reduce((s, e) => s + (e.technicalScore || 0), 0) / evaluations.length,
    communication: evaluations.reduce((s, e) => s + (e.communicationScore || 0), 0) / evaluations.length,
    grammar: evaluations.reduce((s, e) => s + (e.grammarScore || 0), 0) / evaluations.length,
    overall: evaluations.reduce((s, e) => s + (e.overallScore || 0), 0) / evaluations.length,
  }

  const allStrengths = evaluations.flatMap((e) => e.strengths || [])
  const allWeaknesses = evaluations.flatMap((e) => e.weaknesses || [])

  const prompt = `Based on this interview evaluation summary, provide an overall improvement plan.

Interview Type: ${type}
Average Technical Score: ${Math.round(avgScores.technical)}
Average Communication Score: ${Math.round(avgScores.communication)}
Average Grammar Score: ${Math.round(avgScores.grammar)}
Overall Score: ${Math.round(avgScores.overall)}
Strengths found: ${allStrengths.slice(0, 6).join('; ')}
Weaknesses found: ${allWeaknesses.slice(0, 6).join('; ')}

Return JSON with:
- "improvementPlan": array of 3-5 specific actionable improvement suggestions
- "topWeakTopics": array of 3 strings identifying the weakest topic areas
- "summary": a 2-3 sentence overall performance summary

Return ONLY a valid JSON object.`

  return await generateJSON(prompt)
}
