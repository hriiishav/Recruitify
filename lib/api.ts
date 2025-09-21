import { jobsDB, candidatesDB, assessmentsDB, assessmentResponsesDB } from "./db"
import type { Job, Candidate, Assessment, AssessmentResponse, CandidateStage } from "./types"

// Simulate network latency and errors
const simulateNetworkDelay = () => {
  const delay = Math.random() * 1000 + 200 // 200-1200ms
  return new Promise((resolve) => setTimeout(resolve, delay))
}

const simulateNetworkError = () => {
  const errorRate = 0.05 // 5% error rate on write operations
  if (Math.random() < errorRate) {
    throw new Error("Network error: Operation failed")
  }
}

// Jobs API
export const jobsAPI = {
  async getJobs(): Promise<Job[]> {
    await simulateNetworkDelay()
    return await jobsDB.getAll()
  },

  async getJob(id: string): Promise<Job | null> {
    await simulateNetworkDelay()
    const job = await jobsDB.getById(id)
    return job || null
  },

  async createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt">): Promise<Job> {
    await simulateNetworkDelay()
    simulateNetworkError()

    const job: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      await jobsDB.create(job)
      return job
    } catch (error) {
      console.error("Failed to create job:", error)
      throw new Error("Failed to create job")
    }
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      await jobsDB.update(id, updates)
      const updatedJob = await jobsDB.getById(id)
      if (!updatedJob) throw new Error("Job not found")
      return updatedJob
    } catch (error) {
      console.error("Failed to update job:", error)
      throw new Error("Failed to update job")
    }
  },

  async deleteJob(id: string): Promise<void> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      await jobsDB.delete(id)
    } catch (error) {
      console.error("Failed to delete job:", error)
      throw new Error("Failed to delete job")
    }
  },

  async reorderJobs(jobs: Job[]): Promise<void> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      await jobsDB.bulkUpdate(jobs)
    } catch (error) {
      console.error("Failed to reorder jobs:", error)
      throw new Error("Failed to reorder jobs")
    }
  },
}

// Candidates API
export const candidatesAPI = {
  async getCandidates(): Promise<Candidate[]> {
    await simulateNetworkDelay()
    return await candidatesDB.getAll()
  },

  async getCandidate(id: string): Promise<Candidate | null> {
    await simulateNetworkDelay()
    const candidate = await candidatesDB.getById(id)
    return candidate || null
  },

  async getCandidatesByJob(jobId: string): Promise<Candidate[]> {
    await simulateNetworkDelay()
    return await candidatesDB.getByJobId(jobId)
  },

  async searchCandidates(query: string): Promise<Candidate[]> {
    await simulateNetworkDelay()
    return await candidatesDB.search(query)
  },

  async createCandidate(candidateData: Omit<Candidate, "id" | "createdAt" | "updatedAt">): Promise<Candidate> {
    await simulateNetworkDelay()
    simulateNetworkError()

    const candidate: Candidate = {
      ...candidateData,
      id: `candidate-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      await candidatesDB.create(candidate)
      return candidate
    } catch (error) {
      console.error("Failed to create candidate:", error)
      throw new Error("Failed to create candidate")
    }
  },

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      await candidatesDB.update(id, updates)
      const updatedCandidate = await candidatesDB.getById(id)
      if (!updatedCandidate) throw new Error("Candidate not found")
      return updatedCandidate
    } catch (error) {
      console.error("Failed to update candidate:", error)
      throw new Error("Failed to update candidate")
    }
  },

  async updateCandidateStage(id: string, newStage: CandidateStage): Promise<Candidate> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      const candidate = await candidatesDB.getById(id)
      if (!candidate) throw new Error("Candidate not found")

      const timelineEvent = {
        id: `timeline-${Date.now()}`,
        type: "stage_change" as const,
        description: `Moved to ${newStage}`,
        createdAt: new Date(),
      }

      const updates = {
        currentStage: newStage,
        timeline: [...candidate.timeline, timelineEvent],
      }

      await candidatesDB.update(id, updates)
      const updatedCandidate = await candidatesDB.getById(id)
      if (!updatedCandidate) throw new Error("Candidate not found")
      return updatedCandidate
    } catch (error) {
      console.error("Failed to update candidate stage:", error)
      throw new Error("Failed to update candidate stage")
    }
  },

  async addCandidateNote(id: string, content: string, mentions: string[] = []): Promise<Candidate> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      const candidate = await candidatesDB.getById(id)
      if (!candidate) throw new Error("Candidate not found")

      const note = {
        id: `note-${Date.now()}`,
        content,
        mentions,
        authorId: "current-user",
        createdAt: new Date(),
      }

      const timelineEvent = {
        id: `timeline-${Date.now()}`,
        type: "note_added" as const,
        description: "Note added",
        createdAt: new Date(),
      }

      const updates = {
        notes: [...candidate.notes, note],
        timeline: [...candidate.timeline, timelineEvent],
      }

      await candidatesDB.update(id, updates)
      const updatedCandidate = await candidatesDB.getById(id)
      if (!updatedCandidate) throw new Error("Candidate not found")
      return updatedCandidate
    } catch (error) {
      console.error("Failed to add candidate note:", error)
      throw new Error("Failed to add candidate note")
    }
  },
}

// Assessments API
export const assessmentsAPI = {
  async getAssessments(): Promise<Assessment[]> {
    await simulateNetworkDelay()
    return await assessmentsDB.getAll()
  },

  async getAssessment(id: string): Promise<Assessment | null> {
    await simulateNetworkDelay()
    const assessment = await assessmentsDB.getById(id)
    return assessment || null
  },

  async getAssessmentsByJob(jobId: string): Promise<Assessment[]> {
    await simulateNetworkDelay()
    return await assessmentsDB.getByJobId(jobId)
  },

  async createAssessment(assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">): Promise<Assessment> {
    await simulateNetworkDelay()
    simulateNetworkError()

    const assessment: Assessment = {
      ...assessmentData,
      id: `assessment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      await assessmentsDB.create(assessment)
      return assessment
    } catch (error) {
      console.error("Failed to create assessment:", error)
      throw new Error("Failed to create assessment")
    }
  },

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      await assessmentsDB.update(id, updates)
      const updatedAssessment = await assessmentsDB.getById(id)
      if (!updatedAssessment) throw new Error("Assessment not found")
      return updatedAssessment
    } catch (error) {
      console.error("Failed to update assessment:", error)
      throw new Error("Failed to update assessment")
    }
  },

  async deleteAssessment(id: string): Promise<void> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      await assessmentsDB.delete(id)
    } catch (error) {
      console.error("Failed to delete assessment:", error)
      throw new Error("Failed to delete assessment")
    }
  },

  async publishAssessment(id: string): Promise<Assessment> {
    await simulateNetworkDelay()
    simulateNetworkError()

    try {
      const assessment = await assessmentsDB.getById(id)
      if (!assessment) throw new Error("Assessment not found")

      const updates = {
        isPublished: !assessment.isPublished,
        shareableLink: !assessment.isPublished ? `https://recruitify.app/assessment/${id}` : undefined,
      }

      await assessmentsDB.update(id, updates)
      const updatedAssessment = await assessmentsDB.getById(id)
      if (!updatedAssessment) throw new Error("Assessment not found")
      return updatedAssessment
    } catch (error) {
      console.error("Failed to publish assessment:", error)
      throw new Error("Failed to publish assessment")
    }
  },
}

// Assessment Responses API
export const assessmentResponsesAPI = {
  async getResponses(): Promise<AssessmentResponse[]> {
    await simulateNetworkDelay()
    return await assessmentResponsesDB.getAll()
  },

  async getResponse(id: string): Promise<AssessmentResponse | null> {
    await simulateNetworkDelay()
    const response = await assessmentResponsesDB.getById(id)
    return response || null
  },

  async getResponsesByAssessment(assessmentId: string): Promise<AssessmentResponse[]> {
    await simulateNetworkDelay()
    return await assessmentResponsesDB.getByAssessmentId(assessmentId)
  },

  async getResponsesByCandidate(candidateId: string): Promise<AssessmentResponse[]> {
    await simulateNetworkDelay()
    return await assessmentResponsesDB.getByCandidateId(candidateId)
  },

  async submitResponse(responseData: Omit<AssessmentResponse, "id">): Promise<AssessmentResponse> {
    await simulateNetworkDelay()
    simulateNetworkError()

    const response: AssessmentResponse = {
      ...responseData,
      id: `response-${Date.now()}`,
    }

    try {
      await assessmentResponsesDB.create(response)

      // Update candidate's assessment scores
      if (responseData.candidateId && responseData.score !== undefined) {
        const candidate = await candidatesDB.getById(responseData.candidateId)
        if (candidate) {
          const assessmentScore = {
            assessmentId: responseData.assessmentId,
            score: responseData.score,
            completedAt: responseData.completedAt || new Date(),
            responses: responseData.responses,
          }

          const timelineEvent = {
            id: `timeline-${Date.now()}`,
            type: "assessment_completed" as const,
            description: `Assessment completed with score: ${responseData.score}%`,
            createdAt: new Date(),
          }

          await candidatesDB.update(responseData.candidateId, {
            assessmentScores: [...candidate.assessmentScores, assessmentScore],
            timeline: [...candidate.timeline, timelineEvent],
          })
        }
      }

      return response
    } catch (error) {
      console.error("Failed to submit assessment response:", error)
      throw new Error("Failed to submit assessment response")
    }
  },
}
