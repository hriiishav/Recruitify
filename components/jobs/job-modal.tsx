"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (job: Partial<Job>) => void
  job?: Job | null
}

export function JobModal({ isOpen, onClose, onSave, job }: JobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active" as "active" | "archived",
    tags: [] as string[],
    responsibilities: [""],
    qualifications: [""],
  })
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        status: job.status,
        tags: job.tags,
        responsibilities: job.responsibilities.length > 0 ? job.responsibilities : [""],
        qualifications: job.qualifications.length > 0 ? job.qualifications : [""],
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "active",
        tags: [],
        responsibilities: [""],
        qualifications: [""],
      })
    }
    setErrors({})
  }, [job, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    // unique slug validation
    const slug = formData.title.toLowerCase().replace(/\s+/g, "-")
    if (slug.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter((r) => r.trim()),
      qualifications: formData.qualifications.filter((q) => q.trim()),
    }

    onSave(cleanedData)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const updateArrayField = (field: "responsibilities" | "qualifications", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayField = (field: "responsibilities" | "qualifications") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayField = (field: "responsibilities" | "qualifications", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Create New Job"}</DialogTitle>
          <DialogDescription>
            {job ? "Update job details and requirements" : "Fill in the details for your new job posting"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Senior Frontend Developer"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
              {formData.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  URL slug: /{formData.title.toLowerCase().replace(/\s+/g, "-")}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role and what you're looking for..."
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "archived") => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <Label>Key Responsibilities</Label>
            <div className="space-y-2">
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => updateArrayField("responsibilities", index, e.target.value)}
                    placeholder="Enter a responsibility..."
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField("responsibilities", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("responsibilities")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Responsibility
              </Button>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <Label>Required Qualifications</Label>
            <div className="space-y-2">
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={qualification}
                    onChange={(e) => updateArrayField("qualifications", index, e.target.value)}
                    placeholder="Enter a qualification..."
                  />
                  {formData.qualifications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField("qualifications", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("qualifications")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Qualification
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="premium-button">
              {job ? "Update Job" : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
