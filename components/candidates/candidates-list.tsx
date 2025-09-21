"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CandidateCard } from "./candidate-card"
import { Search } from "lucide-react"
import type { Candidate, Job, CandidateStage } from "@/lib/types"

interface CandidatesListProps {
  candidates: Candidate[]
  jobs: Job[]
  onStageChange: (candidateId: string, newStage: CandidateStage) => void
  onAddNote: (candidateId: string, content: string, mentions?: string[]) => void
}

export function CandidatesList({ candidates, jobs, onStageChange, onAddNote }: CandidatesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStage = stageFilter === "all" || candidate.currentStage === stageFilter
      const matchesJob = jobFilter === "all" || candidate.jobId === jobFilter

      return matchesSearch && matchesStage && matchesJob
    })
  }, [candidates, searchTerm, stageFilter, jobFilter])

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="assessment">Assessment</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

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
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{filteredCandidates.length}</div>
              <div className="text-sm text-muted-foreground">Total Candidates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {filteredCandidates.filter((c) => c.currentStage === "interview").length}
              </div>
              <div className="text-sm text-muted-foreground">In Interview</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-3">
                {filteredCandidates.filter((c) => c.currentStage === "offer").length}
              </div>
              <div className="text-sm text-muted-foreground">Offers Extended</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-1">
                {filteredCandidates.filter((c) => c.currentStage === "hired").length}
              </div>
              <div className="text-sm text-muted-foreground">Hired</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {paginatedCandidates.length > 0 ? (
        <div className="grid gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {paginatedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              job={jobs.find((j) => j.id === candidate.jobId)}
              onAddNote={onAddNote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
          <p className="text-muted-foreground">
            {searchTerm || stageFilter !== "all" || jobFilter !== "all"
              ? "Try adjusting your filters"
              : "No candidates have been added yet"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded ${
                    currentPage === page ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
