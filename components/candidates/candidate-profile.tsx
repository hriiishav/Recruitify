"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail, Phone, FileText, MessageSquare, Clock, Briefcase } from "lucide-react"
import type { Candidate, Job, CandidateStage } from "@/lib/types"

interface CandidateProfileProps {
  candidate: Candidate
  job?: Job | null
  onAddNote: (content: string, mentions?: string[]) => void
  onStageChange: (newStage: CandidateStage) => void
}

const stages: CandidateStage[] = ["applied", "screening", "interview", "assessment", "offer", "hired", "rejected"]

const stageColors: Record<string, string> = {
  applied: "bg-blue-500",
  screening: "bg-yellow-500",
  interview: "bg-purple-500",
  assessment: "bg-orange-500",
  offer: "bg-green-500",
  hired: "bg-emerald-500",
  rejected: "bg-red-500",
}

export function CandidateProfile({ candidate, job, onAddNote, onStageChange }: CandidateProfileProps) {
  const router = useRouter()
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Simple @mention detection
      const mentions = newNote.match(/@(\w+)/g)?.map((m) => m.substring(1)) || []
      onAddNote(newNote.trim(), mentions)
      setNewNote("")
      setIsAddingNote(false)
    }
  }

  const formatTimelineEvent = (event: any) => {
    switch (event.type) {
      case "stage_change":
        return `Stage changed: ${event.description}`
      case "note_added":
        return "Note added"
      case "assessment_completed":
        return "Assessment completed"
      default:
        return event.description
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/candidates")} className="premium-button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>

        <div className="flex items-center space-x-2">
          <Select value={candidate.currentStage} onValueChange={onStageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${stageColors[stage]} rounded-full`} />
                    <span className="capitalize">{stage}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Overview */}
          <Card className="premium-card">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                  <CardDescription className="text-base">{candidate.email}</CardDescription>
                  {candidate.phone && <p className="text-sm text-muted-foreground mt-1">{candidate.phone}</p>}
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge variant="secondary" className={`${stageColors[candidate.currentStage]} text-white`}>
                      {candidate.currentStage}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Applied {candidate.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${candidate.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                  {candidate.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${candidate.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Job Info */}
          {job && (
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Applied Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Scores */}
          {candidate.assessmentScores.length > 0 && (
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.assessmentScores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Assessment {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">
                          Completed {score.completedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{score.score}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes & Timeline */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes ({candidate.notes.length})</TabsTrigger>
              <TabsTrigger value="timeline">Timeline ({candidate.timeline.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <Card className="premium-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Notes
                    </CardTitle>
                    <Button size="sm" onClick={() => setIsAddingNote(true)} className="premium-button">
                      Add Note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isAddingNote && (
                    <div className="space-y-3 mb-6 p-4 bg-muted/50 rounded-lg">
                      <Textarea
                        placeholder="Add a note... Use @username to mention someone"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAddingNote(false)
                            setNewNote("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddNote} className="premium-button">
                          Add Note
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {candidate.notes.length > 0 ? (
                      candidate.notes.map((note) => (
                        <div key={note.id} className="border-l-2 border-primary/20 pl-4 py-2">
                          <p className="text-sm">{note.content}</p>
                          {note.mentions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.mentions.map((mention) => (
                                <Badge key={mention} variant="outline" className="text-xs">
                                  @{mention}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No notes yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.timeline.map((event, index) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{formatTimelineEvent(event)}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.createdAt.toLocaleDateString()} at {event.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href={`mailto:${candidate.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </Button>
              {candidate.phone && (
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <a href={`tel:${candidate.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Candidate
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setIsAddingNote(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Candidate Stats */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Candidate Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days in pipeline</span>
                <span className="font-medium">
                  {Math.floor((new Date().getTime() - candidate.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Notes</span>
                <span className="font-medium">{candidate.notes.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Assessments</span>
                <span className="font-medium">{candidate.assessmentScores.length}</span>
              </div>
              {candidate.assessmentScores.length > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Score</span>
                    <span className="font-medium text-primary">
                      {Math.round(
                        candidate.assessmentScores.reduce((acc, score) => acc + score.score, 0) /
                          candidate.assessmentScores.length,
                      )}
                      %
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
