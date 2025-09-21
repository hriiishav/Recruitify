"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, MessageSquare, Eye } from "lucide-react"
import type { Candidate, Job } from "@/lib/types"

interface CandidateCardProps {
  candidate: Candidate
  job?: Job
  onAddNote: (candidateId: string, content: string, mentions?: string[]) => void
  compact?: boolean
}

const stageColors: Record<string, string> = {
  applied: "bg-blue-500",
  screening: "bg-yellow-500",
  interview: "bg-purple-500",
  assessment: "bg-orange-500",
  offer: "bg-green-500",
  hired: "bg-emerald-500",
  rejected: "bg-red-500",
}

export function CandidateCard({ candidate, job, onAddNote, compact = false }: CandidateCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleQuickNote = () => {
    const note = prompt("Add a quick note:")
    if (note?.trim()) {
      onAddNote(candidate.id, note.trim())
    }
  }

  return (
    <Card className="premium-card group">
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(candidate.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 max-w-[200px]">
              <h3 className="font-semibold truncate">
                <Link href={`/candidates/${candidate.id}`} className="hover:text-primary transition-colors">
                  {candidate.name}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground break-all text-wrap leading-tight">{candidate.email}</p>
              {!compact && candidate.phone && <p className="text-xs text-muted-foreground">{candidate.phone}</p>}
            </div>
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
                <Link href={`/candidates/${candidate.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleQuickNote}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`mailto:${candidate.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </DropdownMenuItem>
              {candidate.phone && (
                <DropdownMenuItem asChild>
                  <a href={`tel:${candidate.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className={compact ? "pt-0 pb-3" : "pt-0"}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-xs ${stageColors[candidate.currentStage]} text-white`}>
              {candidate.currentStage}
            </Badge>
            {candidate.assessmentScores.length > 0 && (
              <div className="text-xs text-muted-foreground">Score: {candidate.assessmentScores[0]?.score || 0}%</div>
            )}
          </div>

          {job && <div className="text-xs text-muted-foreground truncate">Applied for: {job.title}</div>}

          {!compact && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Applied {candidate.createdAt.toLocaleDateString()}</span>
              <span>{candidate.notes.length} notes</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
