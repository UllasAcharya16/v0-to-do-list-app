"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function DemoPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete project proposal", completed: false },
    { id: "2", title: "Review team feedback", completed: true },
    { id: "3", title: "Schedule client meeting", completed: false },
  ])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask.trim(),
          completed: false,
        },
      ])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">TaskFlow Demo</h1>
          <p className="text-muted-foreground">Try out the task management features</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <Button onClick={addTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks ({tasks.filter((t) => !t.completed).length} remaining)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                  <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No tasks yet. Add one above to get started!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
