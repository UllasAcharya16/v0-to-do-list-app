"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, TrendingUp, Calendar } from "lucide-react"
import type { Task } from "@/types/task"

interface ProgressCardProps {
  tasks: Task[]
  title: string
  type: "daily" | "monthly"
}

export function ProgressCard({ tasks, title, type }: ProgressCardProps) {
  const completedTasks = tasks.filter((task) => task.completed)
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  // Calculate streak for daily tasks
  const getStreak = () => {
    if (type !== "daily") return null

    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    // Check backwards from today
    while (streak < 30) {
      // Max 30 days check
      const dateStr = currentDate.toISOString().split("T")[0]
      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.created_at).toISOString().split("T")[0]
        return taskDate === dateStr
      })

      const dayCompleted = dayTasks.filter((task) => task.completed)
      if (dayTasks.length === 0 || dayCompleted.length === 0) break

      const dayCompletionRate = (dayCompleted.length / dayTasks.length) * 100
      if (dayCompletionRate < 50) break // Less than 50% completion breaks streak

      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  const streak = getStreak()

  // Get recent completion trend (last 7 days for daily, last 4 weeks for monthly)
  const getTrend = () => {
    const now = new Date()
    const periods = type === "daily" ? 7 : 4
    const periodLength = type === "daily" ? 1 : 7 // days

    let recentCompletions = 0
    let olderCompletions = 0

    tasks.forEach((task) => {
      if (!task.completed_at) return

      const completedDate = new Date(task.completed_at)
      const daysAgo = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysAgo <= periods * periodLength) {
        recentCompletions++
      } else if (daysAgo <= periods * periodLength * 2) {
        olderCompletions++
      }
    })

    return recentCompletions > olderCompletions ? "up" : recentCompletions < olderCompletions ? "down" : "stable"
  }

  const trend = getTrend()

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center justify-between">
          {title} Progress
          <Badge variant="outline" className="text-xs border-border/50">
            {completionRate}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="text-foreground font-medium">
              {completedTasks.length}/{totalTasks}
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="text-xs">
              <div className="font-medium text-foreground">{completedTasks.length}</div>
              <div className="text-muted-foreground">Completed</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <Circle className="h-4 w-4 text-muted-foreground" />
            <div className="text-xs">
              <div className="font-medium text-foreground">{totalTasks - completedTasks.length}</div>
              <div className="text-muted-foreground">Remaining</div>
            </div>
          </div>

          {streak !== null && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div className="text-xs">
                <div className="font-medium text-foreground">{streak}</div>
                <div className="text-muted-foreground">Day Streak</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
            <TrendingUp
              className={`h-4 w-4 ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
              }`}
            />
            <div className="text-xs">
              <div className="font-medium text-foreground capitalize">{trend}</div>
              <div className="text-muted-foreground">Trend</div>
            </div>
          </div>
        </div>

        {/* Recurring Tasks Count */}
        {tasks.some((task) => task.is_recurring) && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Recurring Tasks</span>
              <Badge variant="secondary" className="text-xs bg-muted">
                {tasks.filter((task) => task.is_recurring).length}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
