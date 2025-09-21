import type { Job, Candidate, Assessment, CandidateStage } from "./types"

// Seed data generation functions
export function generateJobs(): Job[] {
  const jobTitles = [
    "Senior Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Product Manager",
    "UX Designer",
    "Data Scientist",
    "Mobile Developer",
    "QA Engineer",
    "Technical Lead",
    "Software Architect",
    "Marketing Manager",
    "Sales Representative",
    "Customer Success Manager",
    "HR Specialist",
    "Financial Analyst",
    "Operations Manager",
    "Business Analyst",
    "Content Writer",
    "Graphic Designer",
    "Project Manager",
    "Security Engineer",
    "Machine Learning Engineer",
    "Cloud Engineer",
    "Database Administrator",
  ]

  const tags = ["Remote", "Full-time", "Part-time", "Contract", "Senior", "Junior", "Mid-level", "Urgent", "New"]
  const statuses: ("active" | "archived")[] = ["active", "archived"]

  return jobTitles.map((title, index) => ({
    id: `job-${index + 1}`,
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    description: `We are looking for a talented ${title} to join our growing team. This is an excellent opportunity to work with cutting-edge technologies and make a significant impact on our products.`,
    responsibilities: [
      `Lead ${title.toLowerCase()} initiatives and projects`,
      "Collaborate with cross-functional teams",
      "Mentor junior team members",
      "Contribute to technical architecture decisions",
      "Ensure code quality and best practices",
    ],
    qualifications: [
      `5+ years of experience in ${title.toLowerCase()} role`,
      "Strong problem-solving skills",
      "Excellent communication abilities",
      "Bachelor's degree in relevant field",
      "Experience with modern development tools",
    ],
    status: Math.random() > 0.3 ? "active" : "archived",
    tags: tags.slice(0, Math.floor(Math.random() * 4) + 1),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    order: index,
  }))
}

export function generateCandidates(jobs: Job[]): Candidate[] {
  const firstNames = ["Cristiano", "Leo", "Michael", "Gareth", "David", "Virat", "Roberto", "Novak", "James", "Maria","Roger","Steve","Kylian"]
  const lastNames = [
    "Smith",
    "Ronaldo",
    "Messi",
    "Jordan",
    "Schumacher",
    "Bale",
    "Miller",
    "Kohli",
    "Rodriguez",
    "Sharapova",
    "Mbappe",
    "Federer",
    "Djokovic"
  ]
  const stages: CandidateStage[] = ["applied", "screening", "interview", "assessment", "offer", "hired", "rejected"]

  const candidates: Candidate[] = []

  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const job = jobs[Math.floor(Math.random() * jobs.length)]

    candidates.push({
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+91-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      currentStage: stages[Math.floor(Math.random() * stages.length)],
      jobId: job.id,
      notes: [],
      assessmentScores: [],
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      timeline: [
        {
          id: `timeline-${i + 1}-1`,
          type: "stage_change",
          description: "Application submitted",
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      ],
    })
  }

  return candidates
}

export function generateAssessments(jobs: Job[]): Assessment[] {
  return jobs.slice(0, 3).map((job, index) => ({
    id: `assessment-${index + 1}`,
    title: `${job.title} Assessment`,
    jobId: job.id,
    sections: [
      {
        id: `section-${index + 1}-1`,
        title: "Technical Skills",
        description: "Evaluate technical competencies",
        order: 0,
        questions: Array.from({ length: 5 }, (_, qIndex) => ({
          id: `question-${index + 1}-1-${qIndex + 1}`,
          type: "single-choice" as const,
          title: `Technical question ${qIndex + 1}`,
          description: "Select the best answer",
          required: true,
          options: ["Option A", "Option B", "Option C", "Option D"],
          order: qIndex,
        })),
      },
      {
        id: `section-${index + 1}-2`,
        title: "Experience & Background",
        description: "Tell us about your experience",
        order: 1,
        questions: Array.from({ length: 3 }, (_, qIndex) => ({
          id: `question-${index + 1}-2-${qIndex + 1}`,
          type: "long-text" as const,
          title: `Experience question ${qIndex + 1}`,
          description: "Please provide detailed answer",
          required: true,
          validation: { minLength: 50, maxLength: 500 },
          order: qIndex,
        })),
      },
    ],
    isPublished: true,
    shareableLink: `https://recruitify.app/assessment/${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }))
}
