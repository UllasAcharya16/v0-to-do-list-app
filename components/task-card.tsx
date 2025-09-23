"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/types/task"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    await onToggleComplete(task.id, !task.completed)
    setIsCompleting(false)
  }

  return (
    <Card
      className={cn(
        "group hover:shadow-sm transition-all duration-200 border-border/50",
        task.completed && "opacity-75",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isCompleting}
            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium text-sm text-foreground leading-tight",
                    task.completed && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </h3>
                {task.notes && (
                  <p
                    className={cn(
                      "text-xs text-muted-foreground mt-1 leading-relaxed",
                      task.completed && "line-through",
                    )}
                  >
                    {task.notes}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => onEdit(task)} className="text-xs">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5 bg-muted text-muted-foreground hover:bg-muted"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {task.is_recurring && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs px-2 py-0 h-5 border-border/50">
                  Recurring
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
