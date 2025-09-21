"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { CandidatesBoard } from "@/components/candidates/candidates-board"
import { CandidatesList } from "@/components/candidates/candidates-list"
import { Button } from "@/components/ui/button"
import { generateCandidates, generateJobs } from "@/lib/data"
import type { Candidate, Job, CandidateStage } from "@/lib/types"
import { LayoutGrid, List } from "lucide-react"

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"list" | "board">("board")

  useEffect(() => {
    // Initialize with seed data
    const seedJobs = generateJobs()
    const seedCandidates = generateCandidates(seedJobs)
    setJobs(seedJobs)
    setCandidates(seedCandidates)
    setLoading(false)
  }, [])

  const handleStageChange = (candidateId: string, newStage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              currentStage: newStage,
              updatedAt: new Date(),
              timeline: [
                ...candidate.timeline,
                {
                  id: `timeline-${Date.now()}`,
                  type: "stage_change",
                  description: `Moved to ${newStage}`,
                  createdAt: new Date(),
                },
              ],
            }
          : candidate,
      ),
    )
  }

  const handleAddNote = (candidateId: string, content: string, mentions: string[] = []) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              notes: [
                ...candidate.notes,
                {
                  id: `note-${Date.now()}`,
                  content,
                  mentions,
                  authorId: "current-user",
                  createdAt: new Date(),
                },
              ],
              timeline: [
                ...candidate.timeline,
                {
                  id: `timeline-${Date.now()}`,
                  type: "note_added",
                  description: "Note added",
                  createdAt: new Date(),
                },
              ],
            }
          : candidate,
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground">Manage your candidate pipeline and track applications</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
              className="premium-button"
            >
              <List className="mr-2 h-4 w-4" />
              List View
            </Button>
            <Button
              variant={view === "board" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("board")}
              className="premium-button"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board View
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <CandidatesList candidates={candidates} jobs={jobs} onStageChange={handleStageChange} onAddNote={handleAddNote}/>
        ) : (
          <CandidatesBoard candidates={candidates} jobs={jobs} onStageChange={handleStageChange} onAddNote={handleAddNote}/>
        )}
      </main>
    </div>
  )
}
