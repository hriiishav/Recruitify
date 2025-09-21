"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Share, Eye, Copy, ExternalLink, Search } from "lucide-react"
import type { Assessment, Job } from "@/lib/types"

interface AssessmentsListProps {
  assessments: Assessment[]
  jobs: Job[]
  onEdit: (assessment: Assessment) => void
  onDelete: (assessmentId: string) => void
  onPublish: (assessmentId: string) => void
}

export function AssessmentsList({ assessments, jobs, onEdit, onDelete, onPublish }: AssessmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJob = jobFilter === "all" || assessment.jobId === jobFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && assessment.isPublished) ||
      (statusFilter === "draft" && !assessment.isPublished)

    return matchesSearch && matchesJob && matchesStatus
  })

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  const getJobTitle = (jobId: string) => {
    return jobs.find((job) => job.id === jobId)?.title || "Unknown Job"
  }

  const getTotalQuestions = (assessment: Assessment) => {
    return assessment.sections.reduce((total, section) => total + section.questions.length, 0)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{assessments.length}</div>
            <div className="text-sm text-muted-foreground">Total Assessments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent">{assessments.filter((a) => a.isPublished).length}</div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {assessments.filter((a) => !a.isPublished).length}
            </div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-chart-3">
              {Math.round(assessments.reduce((acc, a) => acc + getTotalQuestions(a), 0) / assessments.length || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Questions</div>
          </CardContent>
        </Card>
      </div>

      {/* Assessments Grid */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="premium-card group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{assessment.title}</CardTitle>
                    <CardDescription className="truncate">{getJobTitle(assessment.jobId)}</CardDescription>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`/assessments/${assessment.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(assessment)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPublish(assessment.id)}>
                        <Share className="mr-2 h-4 w-4" />
                        {assessment.isPublished ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      {assessment.shareableLink && (
                        <DropdownMenuItem onClick={() => copyShareLink(assessment.shareableLink!)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(assessment.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={assessment.isPublished ? "default" : "secondary"}>
                      {assessment.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{getTotalQuestions(assessment)} questions</span>
                  </div>

                  <div className="text-sm text-muted-foreground">{assessment.sections.length} sections</div>

                  {assessment.shareableLink && (
                    <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate flex-1">{assessment.shareableLink}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyShareLink(assessment.shareableLink!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created {assessment.createdAt.toLocaleDateString()}</span>
                    <span>Updated {assessment.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
          <p className="text-muted-foreground">
            {searchTerm || jobFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first assessment to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
