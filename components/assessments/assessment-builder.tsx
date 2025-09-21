"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { AssessmentPreview } from "./assessment-preview"
import { QuestionEditor } from "./question-editor"
import { Plus, ArrowLeft, Save, Eye, GripVertical, Trash2, Copy, Settings } from "lucide-react"
import type { Assessment, AssessmentSection, Question, Job } from "@/lib/types"

interface AssessmentBuilderProps {
  assessment?: Assessment | null
  jobs: Job[]
  onSave: (assessment: Partial<Assessment>) => void
  onCancel: () => void
}

export function AssessmentBuilder({ assessment, jobs, onSave, onCancel }: AssessmentBuilderProps) {
  const [formData, setFormData] = useState({
    title: "",
    jobId: "",
    sections: [] as AssessmentSection[],
  })
  const [activeTab, setActiveTab] = useState("builder")
  const [editingQuestion, setEditingQuestion] = useState<{ sectionId: string; questionId?: string } | null>(null)

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title,
        jobId: assessment.jobId,
        sections: assessment.sections,
      })
    }
  }, [assessment])

  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message.includes("ResizeObserver loop completed")) {
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", handleResizeObserverError)

    return () => {
      window.removeEventListener("error", handleResizeObserverError)
    }
  }, [])

  const handleSave = () => {
    if (!formData.title.trim() || !formData.jobId) {
      alert("Please fill in all required fields")
      return
    }

    onSave(formData)
  }

  const addSection = () => {
    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      description: "",
      questions: [],
      order: formData.sections.length,
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
  }

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, ...updates } : section)),
    }))
  }

  const deleteSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const duplicateSection = (sectionId: string) => {
    const section = formData.sections.find((s) => s.id === sectionId)
    if (!section) return

    const duplicatedSection: AssessmentSection = {
      ...section,
      id: `section-${Date.now()}`,
      title: `${section.title} (Copy)`,
      order: formData.sections.length,
      questions: section.questions.map((q) => ({
        ...q,
        id: `question-${Date.now()}-${Math.random()}`,
      })),
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, duplicatedSection],
    }))
  }

  const addQuestion = (sectionId: string) => {
    setEditingQuestion({ sectionId })
  }

  const saveQuestion = (sectionId: string, questionData: Partial<Question>) => {
    if (editingQuestion?.questionId) {
      // Update existing question
      updateSection(sectionId, {
        questions:
          formData.sections
            .find((s) => s.id === sectionId)
            ?.questions.map((q) => (q.id === editingQuestion.questionId ? { ...q, ...questionData } : q)) || [],
      })
    } else {
      // Add new question
      const newQuestion: Question = {
        id: `question-${Date.now()}`,
        type: questionData.type || "single-choice",
        title: questionData.title || "",
        description: questionData.description,
        required: questionData.required || false,
        options: questionData.options,
        validation: questionData.validation,
        conditionalLogic: questionData.conditionalLogic,
        order: formData.sections.find((s) => s.id === sectionId)?.questions.length || 0,
      }

      updateSection(sectionId, {
        questions: [...(formData.sections.find((s) => s.id === sectionId)?.questions || []), newQuestion],
      })
    }
    setEditingQuestion(null)
  }

  const editQuestion = (sectionId: string, questionId: string) => {
    setEditingQuestion({ sectionId, questionId })
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    updateSection(sectionId, {
      questions: formData.sections.find((s) => s.id === sectionId)?.questions.filter((q) => q.id !== questionId) || [],
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === "section") {
      const newSections = Array.from(formData.sections)
      const [reorderedSection] = newSections.splice(source.index, 1)
      newSections.splice(destination.index, 0, reorderedSection)

      setFormData((prev) => ({
        ...prev,
        sections: newSections.map((section, index) => ({ ...section, order: index })),
      }))
    } else if (type === "question") {
      const sectionId = source.droppableId
      const section = formData.sections.find((s) => s.id === sectionId)
      if (!section) return

      const newQuestions = Array.from(section.questions)
      const [reorderedQuestion] = newQuestions.splice(source.index, 1)
      newQuestions.splice(destination.index, 0, reorderedQuestion)

      updateSection(sectionId, {
        questions: newQuestions.map((question, index) => ({ ...question, order: index })),
      })
    }
  }

  const previewAssessment: Assessment = {
    id: assessment?.id || "preview",
    title: formData.title || "Untitled Assessment",
    jobId: formData.jobId,
    sections: formData.sections,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel} className="premium-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{assessment ? "Edit Assessment" : "Create Assessment"}</h1>
            <p className="text-muted-foreground">Build custom assessments with multiple question types</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")} className="premium-button">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="premium-button">
            <Save className="mr-2 h-4 w-4" />
            Save Assessment
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Basic Info */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Assessment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Assessment Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Frontend Developer Assessment"
                  />
                </div>
                <div>
                  <Label htmlFor="job">Associated Job *</Label>
                  <Select
                    value={formData.jobId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jobId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Assessment Sections</h2>
              <Button onClick={addSection} size="sm" className="premium-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections" type="section">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {formData.sections.map((section, sectionIndex) => (
                      <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`premium-card ${snapshot.isDragging ? "rotate-2 scale-105" : ""}`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <Input
                                      value={section.title}
                                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                      className="font-semibold"
                                      placeholder="Section title"
                                    />
                                    <Textarea
                                      value={section.description || ""}
                                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                      placeholder="Section description (optional)"
                                      rows={2}
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => duplicateSection(section.id)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteSection(section.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline">{section.questions.length} questions</Badge>
                                  <Button
                                    onClick={() => addQuestion(section.id)}
                                    size="sm"
                                    variant="outline"
                                    className="premium-button"
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Question
                                  </Button>
                                </div>

                                {section.questions.length > 0 && (
                                  <Droppable droppableId={section.id} type="question">
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {section.questions.map((question, questionIndex) => (
                                          <Draggable key={question.id} draggableId={question.id} index={questionIndex}>
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`p-3 border rounded-lg bg-muted/50 ${
                                                  snapshot.isDragging ? "rotate-1 scale-105" : ""
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center space-x-3 flex-1">
                                                    <div
                                                      {...provided.dragHandleProps}
                                                      className="cursor-grab active:cursor-grabbing"
                                                    >
                                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1">
                                                      <p className="font-medium text-sm">{question.title}</p>
                                                      <p className="text-xs text-muted-foreground capitalize">
                                                        {question.type.replace("-", " ")} •{" "}
                                                        {question.required ? "Required" : "Optional"}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center space-x-1">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => editQuestion(section.id, question.id)}
                                                    >
                                                      Edit
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => deleteQuestion(section.id, question.id)}
                                                      className="text-destructive hover:text-destructive"
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {formData.sections.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
                <p className="text-muted-foreground mb-4">Add your first section to start building your assessment</p>
                <Button onClick={addSection} className="premium-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <AssessmentPreview assessment={previewAssessment} job={jobs.find((j) => j.id === formData.jobId)} isPreview />
        </TabsContent>
      </Tabs>

      {/* Question Editor Modal */}
      {editingQuestion && (
        <QuestionEditor
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={(questionData) => saveQuestion(editingQuestion.sectionId, questionData)}
          question={
            editingQuestion.questionId
              ? formData.sections
                  .find((s) => s.id === editingQuestion.sectionId)
                  ?.questions.find((q) => q.id === editingQuestion.questionId)
              : undefined
          }
          allQuestions={formData.sections.flatMap((s) => s.questions)}
        />
      )}
    </div>
  )
}
