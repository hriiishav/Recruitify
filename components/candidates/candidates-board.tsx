"use client"

import { useState, useMemo } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CandidateCard } from "./candidate-card"
import { Search } from "lucide-react"
import type { Candidate, Job, CandidateStage } from "@/lib/types"

interface CandidatesBoardProps {
  candidates: Candidate[]
  jobs: Job[]
  onStageChange: (candidateId: string, newStage: CandidateStage) => void
  onAddNote: (candidateId: string, content: string, mentions?: string[]) => void
}

const stages: { id: CandidateStage; title: string; color: string }[] = [
  { id: "applied", title: "Applied", color: "bg-blue-500" },
  { id: "screening", title: "Screening", color: "bg-yellow-500" },
  { id: "interview", title: "Interview", color: "bg-purple-500" },
  { id: "assessment", title: "Assessment", color: "bg-orange-500" },
  { id: "offer", title: "Offer", color: "bg-green-500" },
  { id: "hired", title: "Hired", color: "bg-emerald-500" },
  { id: "rejected", title: "Rejected", color: "bg-red-500" },
]

export function CandidatesBoard({ candidates, jobs, onStageChange, onAddNote }: CandidatesBoardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobFilter, setJobFilter] = useState<string>("all")

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesJob = jobFilter === "all" || candidate.jobId === jobFilter

      return matchesSearch && matchesJob
    })
  }, [candidates, searchTerm, jobFilter])

  const candidatesByStage = useMemo(() => {
    const grouped: Record<CandidateStage, Candidate[]> = {
      applied: [],
      screening: [],
      interview: [],
      assessment: [],
      offer: [],
      hired: [],
      rejected: [],
    }

    filteredCandidates.forEach((candidate) => {
      grouped[candidate.currentStage].push(candidate)
    })

    return grouped
  }, [filteredCandidates])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const candidateId = draggableId
    const newStage = destination.droppableId as CandidateStage

    if (source.droppableId !== destination.droppableId) {
      onStageChange(candidateId, newStage)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="text-center">
            <CardContent className="pt-4">
              <div className={`w-3 h-3 ${stage.color} rounded-full mx-auto mb-2`} />
              <div className="text-2xl font-bold">{candidatesByStage[stage.id].length}</div>
              <div className="text-xs text-muted-foreground">{stage.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 min-h-[600px] overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex flex-col min-w-[320px] flex-shrink-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-3 h-3 ${stage.color} rounded-full`} />
                <h3 className="font-semibold text-sm">{stage.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {candidatesByStage[stage.id].length}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 space-y-3 p-4 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-accent/20" : "bg-muted/20"
                    }`}
                  >
                    {candidatesByStage[stage.id].map((candidate, index) => (
                      <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging ? "rotate-2 scale-105 z-50" : ""
                            }`}
                          >
                            <CandidateCard
                              candidate={candidate}
                              job={jobs.find((j) => j.id === candidate.jobId)}
                              onAddNote={onAddNote}
                              compact
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {candidatesByStage[stage.id].length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No candidates in {stage.title.toLowerCase()}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
