"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/types/task"

interface TaskFormProps {
  task?: Task
  onSubmit: (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at" | "completed_at">) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [notes, setNotes] = useState(task?.notes || "")
  const [listType, setListType] = useState<"daily" | "monthly">(task?.list_type || "daily")
  const [tags, setTags] = useState<string[]>(task?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring || false)
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly">(
    task?.recurring_pattern?.frequency || "daily",
  )

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskData = {
      title: title.trim(),
      notes: notes.trim() || undefined,
      tags,
      completed: task?.completed || false,
      list_type: listType,
      is_recurring: isRecurring,
      recurring_pattern: isRecurring
        ? {
            frequency: recurringFrequency,
            days: getRecurringDays(recurringFrequency),
          }
        : undefined,
      due_date: task?.due_date,
    }

    onSubmit(taskData)
  }

  const getRecurringDays = (frequency: "daily" | "weekly" | "monthly"): number[] | undefined => {
    switch (frequency) {
      case "daily":
        return [1, 2, 3, 4, 5, 6, 7] // All days of the week
      case "weekly":
        return [new Date().getDay() || 7] // Current day of the week (1-7, where 7 is Sunday)
      case "monthly":
        return [new Date().getDate()] // Current day of the month
      default:
        return undefined
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
          className="border-border/50 focus:border-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes (optional)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
          className="border-border/50 focus:border-ring resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">List Type</Label>
        <Select value={listType} onValueChange={(value: "daily" | "monthly") => setListType(value)}>
          <SelectTrigger className="border-border/50 focus:border-ring">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily Tasks</SelectItem>
            <SelectItem value="monthly">Monthly Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
            className="border-border/50 focus:border-ring"
          />
          <Button type="button" onClick={handleAddTag} size="sm" variant="outline">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 bg-muted">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
          />
          <Label htmlFor="recurring" className="text-sm font-medium">
            Make this a recurring task
          </Label>
        </div>

        {isRecurring && (
          <div className="space-y-2 pl-6">
            <Label className="text-sm font-medium">Frequency</Label>
            <Select
              value={recurringFrequency}
              onValueChange={(value: "daily" | "weekly" | "monthly") => setRecurringFrequency(value)}
            >
              <SelectTrigger className="border-border/50 focus:border-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {recurringFrequency === "daily" && "Task will repeat every day"}
              {recurringFrequency === "weekly" && "Task will repeat every week on the same day"}
              {recurringFrequency === "monthly" && "Task will repeat every month on the same date"}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading || !title.trim()}>
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
