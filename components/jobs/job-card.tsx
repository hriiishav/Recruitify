"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Archive, Trash2, Eye, GripVertical } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  onEdit: () => void
  onDelete: () => void
  onArchive: () => void
}

export function JobCard({ job, onEdit, onDelete, onArchive }: JobCardProps) {
  return (
    <Card className="premium-card group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-lg truncate">
                  <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                    {job.title}
                  </Link>
                </CardTitle>
                <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-xs">
                  {job.status}
                </Badge>
              </div>
              <CardDescription className="text-sm">/{job.slug}</CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/jobs/${job.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="mr-2 h-4 w-4" />
                {job.status === "active" ? "Archive" : "Unarchive"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {job.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {job.createdAt.toLocaleDateString()}</span>
          <span>25 applicants</span>
        </div>
      </CardContent>
    </Card>
  )
}
