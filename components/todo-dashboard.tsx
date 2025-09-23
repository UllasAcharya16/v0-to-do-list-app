"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit3, Calendar, Tag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Task {
  id: string
  title: string
  notes?: string
  completed: boolean
  due_date?: string
  tags?: string[]
  list_type: string
  created_at: string
}

interface TodoDashboardProps {
  initialTasks: Task[]
  userId: string
}

export function TodoDashboard({ initialTasks, userId }: TodoDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [newTags, setNewTags] = useState("")
  const [listType, setListType] = useState("daily")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const addTask = async () => {
    if (!newTask.trim()) return

    setIsLoading(true)
    const taskData = {
      title: newTask,
      notes: newNotes || null,
      due_date: newDueDate || null,
      tags: newTags ? newTags.split(",").map((tag) => tag.trim()) : [],
      list_type: listType,
      user_id: userId,
      completed: false,
    }

    const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

    if (!error && data) {
      setTasks([data, ...tasks])
      setNewTask("")
      setNewNotes("")
      setNewDueDate("")
      setNewTags("")
    }
    setIsLoading(false)
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", taskId)

    if (!error) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))
    }
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (!error) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const { error } = await supabase.from("tasks").update(updates).eq("id", taskId)

    if (!error) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
      setEditingTask(null)
    }
  }

  const dailyTasks = tasks.filter((task) => task.list_type === "daily")
  const monthlyTasks = tasks.filter((task) => task.list_type === "monthly")
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="space-y-8">
      {/* Add New Task */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={listType === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setListType("daily")}
            >
              Daily
            </Button>
            <Button
              variant={listType === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setListType("monthly")}
            >
              Monthly
            </Button>
          </div>

          <Input
            placeholder="Task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />

          <Textarea
            placeholder="Notes (optional)..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={2}
          />

          <div className="flex gap-2">
            <Input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="flex-1" />
            <Input
              placeholder="Tags (comma separated)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="flex-1"
            />
          </div>

          <Button onClick={addTask} disabled={isLoading} className="w-full">
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </CardContent>
      </Card>

      {/* Task Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Tasks ({dailyTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                isEditing={editingTask === task.id}
                setEditing={setEditingTask}
              />
            ))}
            {dailyTasks.length === 0 && <p className="text-muted-foreground text-center py-4">No daily tasks yet</p>}
          </CardContent>
        </Card>

        {/* Monthly Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Tasks ({monthlyTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                isEditing={editingTask === task.id}
                setEditing={setEditingTask}
              />
            ))}
            {monthlyTasks.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No monthly tasks yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks ({completedTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                isEditing={false}
                setEditing={setEditingTask}
                showCompleted
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  isEditing: boolean
  setEditing: (id: string | null) => void
  showCompleted?: boolean
}

function TaskItem({ task, onToggle, onDelete, onUpdate, isEditing, setEditing, showCompleted }: TaskItemProps) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editNotes, setEditNotes] = useState(task.notes || "")

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      notes: editNotes || null,
    })
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${task.completed ? "bg-muted/50" : "bg-background"}`}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
        className="mt-1"
      />

      <div className="flex-1 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSave()}
            />
            <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </div>
            {task.notes && (
              <div
                className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
              >
                {task.notes}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.due_date).toLocaleDateString()}
                </div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {!showCompleted && (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setEditing(isEditing ? null : task.id)}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
