"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Archive, Trash2, Clock, Users } from "lucide-react"
import { generateJobs } from "@/lib/data"
import type { Job } from "@/lib/types"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading job data
    const jobs = generateJobs()
    const foundJob = jobs.find((j) => j.id === params.jobId)
    setJob(foundJob || null)
    setLoading(false)
  }, [params.jobId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-muted rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/jobs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/jobs")} className="premium-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="premium-button bg-transparent">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="premium-button bg-transparent">
              <Archive className="mr-2 h-4 w-4" />
              {job.status === "active" ? "Archive" : "Unarchive"}
            </Button>
            <Button variant="destructive" size="sm" className="premium-button">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card className="premium-card mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
                <CardDescription className="text-lg">/{job.slug}</CardDescription>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Posted {job.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    25 applicants
                  </div>
                </div>
              </div>
              <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-sm">
                {job.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card className="premium-card mb-8">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        <Card className="premium-card mb-8">
          <CardHeader>
            <CardTitle>Key Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">{responsibility}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="premium-card mb-8">
          <CardHeader>
            <CardTitle>Required Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {job.qualifications.map((qualification, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">{qualification}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Application Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">25</div>
                <div className="text-sm text-muted-foreground">Total Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">8</div>
                <div className="text-sm text-muted-foreground">In Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">5</div>
                <div className="text-sm text-muted-foreground">Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-5">2</div>
                <div className="text-sm text-muted-foreground">Offers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
