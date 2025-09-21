"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CandidateProfile } from "@/components/candidates/candidate-profile"
import { generateCandidates, generateJobs } from "@/lib/data"
import type { Candidate, Job } from "@/lib/types"

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading candidate data
    const jobs = generateJobs()
    const candidates = generateCandidates(jobs)
    const foundCandidate = candidates.find((c) => c.id === params.id)
    const candidateJob = foundCandidate ? jobs.find((j) => j.id === foundCandidate.jobId) : null

    setCandidate(foundCandidate || null)
    setJob(candidateJob || null)
    setLoading(false)
  }, [params.id])

  const handleAddNote = (content: string, mentions: string[] = []) => {
    if (!candidate) return

    setCandidate((prev) =>
      prev
        ? {
            ...prev,
            notes: [
              ...prev.notes,
              {
                id: `note-${Date.now()}`,
                content,
                mentions,
                authorId: "current-user",
                createdAt: new Date(),
              },
            ],
            timeline: [
              ...prev.timeline,
              {
                id: `timeline-${Date.now()}`,
                type: "note_added",
                description: "Note added",
                createdAt: new Date(),
              },
            ],
          }
        : null,
    )
  }

  const handleStageChange = (newStage: any) => {
    if (!candidate) return

    setCandidate((prev) =>
      prev
        ? {
            ...prev,
            currentStage: newStage,
            updatedAt: new Date(),
            timeline: [
              ...prev.timeline,
              {
                id: `timeline-${Date.now()}`,
                type: "stage_change",
                description: `Moved to ${newStage}`,
                createdAt: new Date(),
              },
            ],
          }
        : null,
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
            <p className="text-muted-foreground mb-6">The candidate you're looking for doesn't exist.</p>
            <button onClick={() => router.push("/candidates")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Back to Candidates</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CandidateProfile candidate={candidate} job={job} onAddNote={handleAddNote} onStageChange={handleStageChange} />
      </main>
    </div>
  )
}
