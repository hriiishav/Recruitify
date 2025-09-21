import Dexie, { type EntityTable } from "dexie"
import type { Job, Candidate, Assessment, AssessmentResponse } from "./types"

// Define the database schema
export class TalentFlowDB extends Dexie {
  jobs!: EntityTable<Job, "id">
  candidates!: EntityTable<Candidate, "id">
  assessments!: EntityTable<Assessment, "id">
  assessmentResponses!: EntityTable<AssessmentResponse, "id">

  constructor() {
    super("TalentFlowDB")

    this.version(1).stores({
      jobs: "id, title, slug, status, createdAt, updatedAt, order",
      candidates: "id, name, email, currentStage, jobId, createdAt, updatedAt",
      assessments: "id, title, jobId, isPublished, createdAt, updatedAt",
      assessmentResponses: "id, assessmentId, candidateId, completedAt, score",
    })
  }
}

// Create the database instance
export const db = new TalentFlowDB()

// Database initialization and seeding
export async function initializeDatabase() {
  try {
    await db.open()

    // Check if data already exists
    const jobCount = await db.jobs.count()

    if (jobCount === 0) {
      console.log("Seeding database with initial data...")
      await seedDatabase()
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}

// Seed the database with initial data
async function seedDatabase() {
  const { generateJobs, generateCandidates, generateAssessments } = await import("./data")

  try {
    // Generate and insert jobs
    const jobs = generateJobs()
    await db.jobs.bulkAdd(jobs)

    // Generate and insert candidates
    const candidates = generateCandidates(jobs)
    await db.candidates.bulkAdd(candidates)

    // Generate and insert assessments
    const assessments = generateAssessments(jobs)
    await db.assessments.bulkAdd(assessments)

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Failed to seed database:", error)
  }
}

// Database operations for Jobs
export const jobsDB = {
  async getAll(): Promise<Job[]> {
    return await db.jobs.orderBy("order").toArray()
  },

  async getById(id: string): Promise<Job | undefined> {
    return await db.jobs.get(id)
  },

  async create(job: Job): Promise<string> {
    return await db.jobs.add(job)
  },

  async update(id: string, updates: Partial<Job>): Promise<number> {
    return await db.jobs.update(id, { ...updates, updatedAt: new Date() })
  },

  async delete(id: string): Promise<void> {
    await db.jobs.delete(id)
  },

  async bulkUpdate(jobs: Job[]): Promise<void> {
    await db.jobs.bulkPut(jobs.map((job) => ({ ...job, updatedAt: new Date() })))
  },
}

// Database operations for Candidates
export const candidatesDB = {
  async getAll(): Promise<Candidate[]> {
    return await db.candidates.orderBy("createdAt").reverse().toArray()
  },

  async getById(id: string): Promise<Candidate | undefined> {
    return await db.candidates.get(id)
  },

  async getByJobId(jobId: string): Promise<Candidate[]> {
    return await db.candidates.where("jobId").equals(jobId).toArray()
  },

  async create(candidate: Candidate): Promise<string> {
    return await db.candidates.add(candidate)
  },

  async update(id: string, updates: Partial<Candidate>): Promise<number> {
    return await db.candidates.update(id, { ...updates, updatedAt: new Date() })
  },

  async delete(id: string): Promise<void> {
    await db.candidates.delete(id)
  },

  async search(query: string): Promise<Candidate[]> {
    return await db.candidates
      .filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(query.toLowerCase()) ||
          candidate.email.toLowerCase().includes(query.toLowerCase()),
      )
      .toArray()
  },
}

// Database operations for Assessments
export const assessmentsDB = {
  async getAll(): Promise<Assessment[]> {
    return await db.assessments.orderBy("createdAt").reverse().toArray()
  },

  async getById(id: string): Promise<Assessment | undefined> {
    return await db.assessments.get(id)
  },

  async getByJobId(jobId: string): Promise<Assessment[]> {
    return await db.assessments.where("jobId").equals(jobId).toArray()
  },

  async create(assessment: Assessment): Promise<string> {
    return await db.assessments.add(assessment)
  },

  async update(id: string, updates: Partial<Assessment>): Promise<number> {
    return await db.assessments.update(id, { ...updates, updatedAt: new Date() })
  },

  async delete(id: string): Promise<void> {
    await db.assessments.delete(id)
  },
}

// Database operations for Assessment Responses
export const assessmentResponsesDB = {
  async getAll(): Promise<AssessmentResponse[]> {
    return await db.assessmentResponses.toArray()
  },

  async getById(id: string): Promise<AssessmentResponse | undefined> {
    return await db.assessmentResponses.get(id)
  },

  async getByAssessmentId(assessmentId: string): Promise<AssessmentResponse[]> {
    return await db.assessmentResponses.where("assessmentId").equals(assessmentId).toArray()
  },

  async getByCandidateId(candidateId: string): Promise<AssessmentResponse[]> {
    return await db.assessmentResponses.where("candidateId").equals(candidateId).toArray()
  },

  async create(response: AssessmentResponse): Promise<string> {
    return await db.assessmentResponses.add(response)
  },

  async update(id: string, updates: Partial<AssessmentResponse>): Promise<number> {
    return await db.assessmentResponses.update(id, updates)
  },

  async delete(id: string): Promise<void> {
    await db.assessmentResponses.delete(id)
  },
}
