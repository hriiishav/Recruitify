"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { AssessmentPreview } from "@/components/assessments/assessment-preview"
import { generateAssessments, generateJobs } from "@/lib/data"
import type { Assessment, Job } from "@/lib/types"

export default function AssessmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading assessment data
    const jobs = generateJobs()
    const assessments = generateAssessments(jobs)
    const foundAssessment = assessments.find((a) => a.id === params.id)
    const assessmentJob = foundAssessment ? jobs.find((j) => j.id === foundAssessment.jobId) : null

    setAssessment(foundAssessment || null)
    setJob(assessmentJob || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Assessment Not Found</h1>
            <p className="text-muted-foreground mb-6">The assessment you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/assessments")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Assessments
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <AssessmentPreview assessment={assessment} job={job} />
      </main>
    </div>
  )
}
