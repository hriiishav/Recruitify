"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AssessmentsList } from "@/components/assessments/assessments-list"
import { AssessmentBuilder } from "@/components/assessments/assessment-builder"
import { Button } from "@/components/ui/button"
import { generateAssessments, generateJobs } from "@/lib/data"
import type { Assessment, Job } from "@/lib/types"
import { Plus } from "lucide-react"

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)

  useEffect(() => {
    // Initialize with seed data
    const seedJobs = generateJobs()
    const seedAssessments = generateAssessments(seedJobs)
    setJobs(seedJobs)
    setAssessments(seedAssessments)
    setLoading(false)
  }, [])

  const handleCreateAssessment = () => {
    setEditingAssessment(null)
    setIsBuilderOpen(true)
  }

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment)
    setIsBuilderOpen(true)
  }

  const handleSaveAssessment = (assessmentData: Partial<Assessment>) => {
    if (editingAssessment) {
      // Update existing assessment
      setAssessments((prev) =>
        prev.map((assessment) =>
          assessment.id === editingAssessment.id
            ? { ...assessment, ...assessmentData, updatedAt: new Date() }
            : assessment,
        ),
      )
    } else {
      // Create new assessment
      const newAssessment: Assessment = {
        id: `assessment-${Date.now()}`,
        title: assessmentData.title || "",
        jobId: assessmentData.jobId || "",
        sections: assessmentData.sections || [],
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setAssessments((prev) => [...prev, newAssessment])
    }
    setIsBuilderOpen(false)
  }

  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessments((prev) => prev.filter((assessment) => assessment.id !== assessmentId))
  }

  const handlePublishAssessment = (assessmentId: string) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              isPublished: !assessment.isPublished,
              shareableLink: !assessment.isPublished ? `https://recruitify.app/assessment/${assessmentId}` : undefined,
              updatedAt: new Date(),
            }
          : assessment,
      ),
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {isBuilderOpen ? (
          <AssessmentBuilder
            assessment={editingAssessment}
            jobs={jobs}
            onSave={handleSaveAssessment}
            onCancel={() => setIsBuilderOpen(false)}
          />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Assessments</h1>
                <p className="text-muted-foreground">Create and manage custom assessments for your job positions</p>
              </div>
              <Button onClick={handleCreateAssessment} className="premium-button">
                <Plus className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
            </div>

            <AssessmentsList assessments={assessments} jobs={jobs} onEdit={handleEditAssessment} onDelete={handleDeleteAssessment} onPublish={handlePublishAssessment}/>
          </>
        )}
      </main>
    </div>
  )
}
