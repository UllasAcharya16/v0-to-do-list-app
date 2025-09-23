"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Target, Zap, Award } from "lucide-react"
import type { Task } from "@/types/task"

interface AnalyticsOverviewProps {
  dailyTasks: Task[]
  monthlyTasks: Task[]
}

export function AnalyticsOverview({ dailyTasks, monthlyTasks }: AnalyticsOverviewProps) {
  const allTasks = [...dailyTasks, ...monthlyTasks]
  const completedTasks = allTasks.filter((task) => task.completed)

  // Calculate completion rate
  const overallCompletionRate = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0

  // Get most used tags
  const tagCounts = allTasks.reduce(
    (acc, task) => {
      task.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Calculate productivity score (weighted by recency and completion)
  const getProductivityScore = () => {
    const now = new Date()
    let score = 0

    completedTasks.forEach((task) => {
      if (!task.completed_at) return

      const completedDate = new Date(task.completed_at)
      const daysAgo = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24))

      // More recent completions get higher scores
      const recencyMultiplier = Math.max(0, 1 - daysAgo / 30) // Decay over 30 days
      const baseScore = task.is_recurring ? 2 : 1 // Recurring tasks worth more
      score += baseScore * recencyMultiplier
    })

    return Math.min(100, Math.round(score))
  }

  const productivityScore = getProductivityScore()

  // Get achievement level
  const getAchievementLevel = () => {
    if (completedTasks.length >= 50) return { level: "Expert", icon: Award, color: "text-yellow-600" }
    if (completedTasks.length >= 25) return { level: "Advanced", icon: Target, color: "text-blue-600" }
    if (completedTasks.length >= 10) return { level: "Intermediate", icon: Zap, color: "text-green-600" }
    return { level: "Beginner", icon: BarChart3, color: "text-gray-600" }
  }

  const achievement = getAchievementLevel()
  const AchievementIcon = achievement.icon

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-md bg-muted/30">
            <div className="text-2xl font-bold text-foreground">{overallCompletionRate}%</div>
            <div className="text-xs text-muted-foreground">Overall Completion</div>
          </div>

          <div className="text-center p-3 rounded-md bg-muted/30">
            <div className="text-2xl font-bold text-foreground">{productivityScore}</div>
            <div className="text-xs text-muted-foreground">Productivity Score</div>
          </div>
        </div>

        {/* Achievement Level */}
        <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
          <div className="flex items-center gap-2">
            <AchievementIcon className={`h-4 w-4 ${achievement.color}`} />
            <div className="text-sm">
              <div className="font-medium text-foreground">{achievement.level}</div>
              <div className="text-xs text-muted-foreground">{completedTasks.length} tasks completed</div>
            </div>
          </div>
        </div>

        {/* Top Tags */}
        {topTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Most Used Tags</div>
            <div className="flex flex-wrap gap-1">
              {topTags.map(([tag, count]) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-muted">
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          <div className="text-xs">
            <span className="text-muted-foreground">Daily Tasks:</span>
            <span className="ml-1 font-medium text-foreground">{dailyTasks.length}</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Monthly Tasks:</span>
            <span className="ml-1 font-medium text-foreground">{monthlyTasks.length}</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Recurring:</span>
            <span className="ml-1 font-medium text-foreground">
              {allTasks.filter((task) => task.is_recurring).length}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Total Tags:</span>
            <span className="ml-1 font-medium text-foreground">{Object.keys(tagCounts).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
