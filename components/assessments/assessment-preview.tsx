"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Send, Clock, FileText } from "lucide-react"
import type { Assessment, Job, Question, AssessmentResponse } from "@/lib/types"

interface AssessmentPreviewProps {
  assessment: Assessment
  job?: Job | null
  isPreview?: boolean
}

export function AssessmentPreview({ assessment, job, isPreview = false }: AssessmentPreviewProps) {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [startTime] = useState(new Date())

  const totalQuestions = assessment.sections.reduce((total, section) => total + section.questions.length, 0)
  const answeredQuestions = Object.keys(responses).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const updateResponse = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const isQuestionVisible = (question: Question): boolean => {
    if (!question.conditionalLogic) return true

    const { dependsOn, condition, value } = question.conditionalLogic
    const dependentResponse = responses[dependsOn]

    if (!dependentResponse) return false

    switch (condition) {
      case "equals":
        return dependentResponse === value
      case "not_equals":
        return dependentResponse !== value
      case "contains":
        return String(dependentResponse).toLowerCase().includes(value.toLowerCase())
      default:
        return true
    }
  }

  const validateQuestion = (question: Question, response: any): string | null => {
    if (question.required && (!response || (Array.isArray(response) && response.length === 0))) {
      return "This question is required"
    }

    if (!question.validation || !response) return null

    const { minLength, maxLength, min, max, pattern } = question.validation

    if (typeof response === "string") {
      if (minLength && response.length < minLength) {
        return `Minimum length is ${minLength} characters`
      }
      if (maxLength && response.length > maxLength) {
        return `Maximum length is ${maxLength} characters`
      }
      if (pattern && !new RegExp(pattern).test(response)) {
        return "Invalid format"
      }
    }

    if (typeof response === "number") {
      if (min !== undefined && response < min) {
        return `Minimum value is ${min}`
      }
      if (max !== undefined && response > max) {
        return `Maximum value is ${max}`
      }
    }

    return null
  }

  const canProceed = () => {
    const currentSectionQuestions = assessment.sections[currentSection]?.questions || []
    const visibleQuestions = currentSectionQuestions.filter(isQuestionVisible)
    const requiredQuestions = visibleQuestions.filter((q) => q.required)

    return requiredQuestions.every((q) => responses[q.id])
  }

  const handleSubmit = () => {
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) // minutes

    // Calculate a simple score based on completion
    const score = Math.round((answeredQuestions / totalQuestions) * 100)

    const assessmentResponse: Partial<AssessmentResponse> = {
      assessmentId: assessment.id,
      responses,
      completedAt: endTime,
      score,
    }

    console.log("Assessment submitted:", assessmentResponse)
    setIsSubmitted(true)
  }

  const renderQuestion = (question: Question) => {
    if (!isQuestionVisible(question)) return null

    const response = responses[question.id]
    const error = validateQuestion(question, response)

    return (
      <div key={question.id} className="space-y-4 p-6 border rounded-lg">
        <div>
          <Label className="text-base font-medium">
            {question.title}
            {question.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {question.description && <p className="text-sm text-muted-foreground mt-1">{question.description}</p>}
        </div>

        <div className="space-y-3">
          {question.type === "single-choice" && question.options && (
            <RadioGroup value={response || ""} onValueChange={(value) => updateResponse(question.id, value)}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "multi-choice" && question.options && (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={(response || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentResponses = response || []
                      if (checked) {
                        updateResponse(question.id, [...currentResponses, option])
                      } else {
                        updateResponse(
                          question.id,
                          currentResponses.filter((r: string) => r !== option),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}

          {question.type === "short-text" && (
            <Input
              value={response || ""}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              placeholder="Enter your answer..."
            />
          )}

          {question.type === "long-text" && (
            <Textarea
              value={response || ""}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              placeholder="Enter your detailed answer..."
              rows={4}
            />
          )}

          {question.type === "numeric" && (
            <Input
              type="number"
              value={response || ""}
              onChange={(e) => updateResponse(question.id, e.target.value ? Number(e.target.value) : "")}
              placeholder="Enter a number..."
            />
          )}

          {question.type === "file-upload" && (
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">File upload functionality would be implemented here</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Choose File
              </Button>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="premium-card text-center">
          <CardContent className="pt-12 pb-12">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold mb-4">Assessment Completed!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for completing the assessment. Your responses have been submitted successfully.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{answeredQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)}
                </div>
                <div className="text-sm text-muted-foreground">Minutes Taken</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">
                  {Math.round((answeredQuestions / totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
            {!isPreview && (
              <Button onClick={() => router.push("/assessments")} className="premium-button">
                Back to Assessments
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {!isPreview && (
          <Button variant="ghost" onClick={() => router.push("/assessments")} className="premium-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {isPreview && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Preview Mode
          </Badge>
        )}
      </div>

      {/* Assessment Header */}
      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              {job && <CardDescription className="text-lg">For: {job.title}</CardDescription>}
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)} min</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                Progress: {answeredQuestions} of {totalQuestions} questions
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Current Section */}
      {assessment.sections[currentSection] && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{assessment.sections[currentSection].title}</span>
              <Badge variant="outline">
                Section {currentSection + 1} of {assessment.sections.length}
              </Badge>
            </CardTitle>
            {assessment.sections[currentSection].description && (
              <CardDescription>{assessment.sections[currentSection].description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">{assessment.sections[currentSection].questions.map(renderQuestion)}</div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
          disabled={currentSection === 0}
          className="premium-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Section
        </Button>

        {currentSection < assessment.sections.length - 1 ? (
          <Button
            onClick={() => setCurrentSection((prev) => prev + 1)}
            disabled={!canProceed()}
            className="premium-button"
          >
            Next Section
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canProceed() || isPreview} className="premium-button">
            <Send className="mr-2 h-4 w-4" />
            Submit Assessment
          </Button>
        )}
      </div>
    </div>
  )
}
