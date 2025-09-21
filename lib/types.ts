export interface Job {
  id: string
  title: string
  slug: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  status: "active" | "archived"
  tags: string[]
  createdAt: Date
  updatedAt: Date
  order: number
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  resume?: string
  currentStage: CandidateStage
  jobId: string
  notes: Note[]
  assessmentScores: AssessmentScore[]
  createdAt: Date
  updatedAt: Date
  timeline: TimelineEvent[]
}

export type CandidateStage = "applied" | "screening" | "interview" | "assessment" | "offer" | "hired" | "rejected"

export interface Note {
  id: string
  content: string
  mentions: string[]
  authorId: string
  createdAt: Date
}

export interface TimelineEvent {
  id: string
  type: "stage_change" | "note_added" | "assessment_completed"
  description: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface Assessment {
  id: string
  title: string
  jobId: string
  sections: AssessmentSection[]
  isPublished: boolean
  shareableLink?: string
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentSection {
  id: string
  title: string
  description?: string
  questions: Question[]
  order: number
}

export interface Question {
  id: string
  type: "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload"
  title: string
  description?: string
  required: boolean
  options?: string[]
  validation?: ValidationRule
  conditionalLogic?: ConditionalRule
  order: number
}

export interface ValidationRule {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
}

export interface ConditionalRule {
  dependsOn: string // question id
  condition: "equals" | "not_equals" | "contains"
  value: string
}

export interface AssessmentResponse {
  id: string
  assessmentId: string
  candidateId: string
  responses: Record<string, any>
  completedAt?: Date
  score?: number
}

export interface AssessmentScore {
  assessmentId: string
  score: number
  completedAt: Date
  responses: Record<string, any>
}
