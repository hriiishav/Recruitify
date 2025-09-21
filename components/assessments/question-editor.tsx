"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, X } from "lucide-react"
import type { Question, ValidationRule, ConditionalRule } from "@/lib/types"

interface QuestionEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (question: Partial<Question>) => void
  question?: Question
  allQuestions: Question[]
}

const questionTypes = [
  { value: "single-choice", label: "Single Choice" },
  { value: "multi-choice", label: "Multiple Choice" },
  { value: "short-text", label: "Short Text" },
  { value: "long-text", label: "Long Text" },
  { value: "numeric", label: "Numeric" },
  { value: "file-upload", label: "File Upload" },
]

export function QuestionEditor({ isOpen, onClose, onSave, question, allQuestions }: QuestionEditorProps) {
  const [formData, setFormData] = useState({
    type: "single-choice" as Question["type"],
    title: "",
    description: "",
    required: false,
    options: [""],
    validation: {} as ValidationRule,
    conditionalLogic: undefined as ConditionalRule | undefined,
  })

  const [showValidation, setShowValidation] = useState(false)
  const [showConditional, setShowConditional] = useState(false)

  useEffect(() => {
    if (question) {
      setFormData({
        type: question.type,
        title: question.title,
        description: question.description || "",
        required: question.required,
        options: question.options || [""],
        validation: question.validation || {},
        conditionalLogic: question.conditionalLogic,
      })
      setShowValidation(!!question.validation && Object.keys(question.validation).length > 0)
      setShowConditional(!!question.conditionalLogic)
    } else {
      setFormData({
        type: "single-choice",
        title: "",
        description: "",
        required: false,
        options: [""],
        validation: {},
        conditionalLogic: undefined,
      })
      setShowValidation(false)
      setShowConditional(false)
    }
  }, [question, isOpen])

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Question title is required")
      return
    }

    const questionData: Partial<Question> = {
      ...formData,
      options: ["single-choice", "multi-choice"].includes(formData.type)
        ? formData.options.filter((opt) => opt.trim())
        : undefined,
      validation: showValidation && Object.keys(formData.validation).length > 0 ? formData.validation : undefined,
      conditionalLogic: showConditional ? formData.conditionalLogic : undefined,
    }

    onSave(questionData)
  }

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }))
  }

  const updateOption = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }))
  }

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const updateValidation = (field: keyof ValidationRule, value: any) => {
    setFormData((prev) => ({
      ...prev,
      validation: { ...prev.validation, [field]: value },
    }))
  }

  const updateConditional = (field: keyof ConditionalRule, value: any) => {
    setFormData((prev) => ({
      ...prev,
      conditionalLogic: { ...prev.conditionalLogic, [field]: value } as ConditionalRule,
    }))
  }

  const needsOptions = ["single-choice", "multi-choice"].includes(formData.type)
  const needsValidation = ["short-text", "long-text", "numeric"].includes(formData.type)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Add Question"}</DialogTitle>
          <DialogDescription>Configure your question with validation rules and conditional logic</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Question Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Question Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Question["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Question Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your question..."
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Additional context or instructions..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, required: checked }))}
              />
              <Label htmlFor="required">Required question</Label>
            </div>
          </div>

          {/* Options for choice questions */}
          {needsOptions && (
            <div className="space-y-4">
              <Separator />
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2 mt-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.options.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeOption(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Validation Rules */}
          {needsValidation && (
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <Label>Validation Rules</Label>
                <Switch checked={showValidation} onCheckedChange={setShowValidation} />
              </div>

              {showValidation && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  {formData.type === "numeric" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min">Minimum Value</Label>
                        <Input
                          id="min"
                          type="number"
                          value={formData.validation.min || ""}
                          onChange={(e) => updateValidation("min", e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max">Maximum Value</Label>
                        <Input
                          id="max"
                          type="number"
                          value={formData.validation.max || ""}
                          onChange={(e) => updateValidation("max", e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </div>
                  )}

                  {["short-text", "long-text"].includes(formData.type) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minLength">Minimum Length</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={formData.validation.minLength || ""}
                          onChange={(e) =>
                            updateValidation("minLength", e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLength">Maximum Length</Label>
                        <Input
                          id="maxLength"
                          type="number"
                          value={formData.validation.maxLength || ""}
                          onChange={(e) =>
                            updateValidation("maxLength", e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="pattern">Pattern (Regex)</Label>
                    <Input
                      id="pattern"
                      value={formData.validation.pattern || ""}
                      onChange={(e) => updateValidation("pattern", e.target.value)}
                      placeholder="e.g. ^[A-Za-z]+$"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conditional Logic */}
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <Label>Conditional Logic</Label>
              <Switch checked={showConditional} onCheckedChange={setShowConditional} />
            </div>

            {showConditional && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Show this question only when another question meets certain conditions
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dependsOn">Depends on Question</Label>
                    <Select
                      value={formData.conditionalLogic?.dependsOn || ""}
                      onValueChange={(value) => updateConditional("dependsOn", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {allQuestions
                          .filter((q) => q.id !== question?.id)
                          .map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.conditionalLogic?.condition || ""}
                      onValueChange={(value: ConditionalRule["condition"]) => updateConditional("condition", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      value={formData.conditionalLogic?.value || ""}
                      onChange={(e) => updateConditional("value", e.target.value)}
                      placeholder="Expected value"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="premium-button">
              {question ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
