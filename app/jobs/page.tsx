"use client"

import { Navigation } from "@/components/navigation"
import { JobsBoard } from "@/components/jobs/jobs-board"
import { JobModal } from "@/components/jobs/job-modal"
import { useJobs } from "@/lib/hooks/use-api"
import { useDatabase } from "@/components/providers/database-provider"
import type { Job } from "@/lib/types"
import { useState } from "react"

export default function JobsPage() {
  const { isInitialized, error: dbError } = useDatabase()
  const { jobs, loading, error, createJob, updateJob, deleteJob, reorderJobs } = useJobs()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const handleCreateJob = () => {
    setEditingJob(null)
    setIsModalOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleSaveJob = async (jobData: Partial<Job>) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData)
      } else {
        await createJob(jobData as Omit<Job, "id" | "createdAt" | "updatedAt">)
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error("Failed to save job:", err)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId)
      } catch (err) {
        console.error("Failed to delete job:", err)
      }
    }
  }

  const handleArchiveJob = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      try {
        await updateJob(jobId, {
          status: job.status === "active" ? "archived" : "active",
        })
      } catch (err) {
        console.error("Failed to archive job:", err)
      }
    }
  }

  const handleReorderJobs = async (reorderedJobs: Job[]) => {
    try {
      await reorderJobs(reorderedJobs)
    } catch (err) {
      console.error("Failed to reorder jobs:", err)
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing database...</p>
            {dbError && <p className="text-destructive mt-2">{dbError}</p>}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <JobsBoard jobs={jobs} loading={loading} error={error} onCreateJob={handleCreateJob} onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob} onArchiveJob={handleArchiveJob} onReorderJobs={handleReorderJobs}/>
        <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveJob} job={editingJob} />
      </main>
    </div>
  )
}
