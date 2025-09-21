"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { JobCard } from "./job-card"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Search, AlertCircle } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobsBoardProps {
  jobs: Job[]
  loading: boolean
  error: string | null
  onCreateJob: () => void
  onEditJob: (job: Job) => void
  onDeleteJob: (jobId: string) => void
  onArchiveJob: (jobId: string) => void
  onReorderJobs: (jobs: Job[]) => void
}

export function JobsBoard({
  jobs,
  loading,
  error,
  onCreateJob,
  onEditJob,
  onDeleteJob,
  onArchiveJob,
  onReorderJobs,
}: JobsBoardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    jobs.forEach((job) => job.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags)
  }, [jobs])

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || job.status === statusFilter
        const matchesTag = tagFilter === "all" || job.tags.includes(tagFilter)

        return matchesSearch && matchesStatus && matchesTag
      })
      .sort((a, b) => a.order - b.order)
  }, [jobs, searchTerm, statusFilter, tagFilter])

  // Paginate jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    // UI updates on paginated jobs
    const items = Array.from(paginatedJobs)
    const [reorderedItem] = items.splice(sourceIndex, 1)
    items.splice(destinationIndex, 0, reorderedItem)

    // ordering jobs
    const updatedJobs = items.map((job, index) => ({
      ...job,
      order: (currentPage - 1) * itemsPerPage + index,
    }))

    // Merge with the original jobs array to maintain all jobs
    const allJobsUpdated = jobs.map((job) => {
      const updatedJob = updatedJobs.find((updated) => updated.id === job.id)
      return updatedJob || job
    })

    onReorderJobs(allJobsUpdated)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-muted rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings and track applications</p>
        </div>
        <Button onClick={onCreateJob} className="premium-button">
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-primary">{jobs.filter((j) => j.status === "active").length}</div>
          <div className="text-sm text-muted-foreground">Active Jobs</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-muted-foreground">
            {jobs.filter((j) => j.status === "archived").length}
          </div>
          <div className="text-sm text-muted-foreground">Archived Jobs</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold text-accent">{jobs.length}</div>
          <div className="text-sm text-muted-foreground">Total Jobs</div>
        </div>
      </div>

      {/* Jobs List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jobs">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {paginatedJobs.map((job, index) => (
                <Draggable key={job.id} draggableId={job.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all duration-200 ${snapshot.isDragging ? "rotate-2 scale-105 z-50" : ""}`}
                    >
                      <JobCard
                        job={job}
                        onEdit={() => onEditJob(job)}
                        onDelete={() => onDeleteJob(job.id)}
                        onArchive={() => onArchiveJob(job.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || tagFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first job posting to get started"}
          </p>
          {!searchTerm && statusFilter === "all" && tagFilter === "all" && (
            <Button onClick={onCreateJob} className="premium-button">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
