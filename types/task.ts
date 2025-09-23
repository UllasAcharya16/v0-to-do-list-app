export interface Task {
  id: string
  user_id: string
  title: string
  notes?: string
  tags: string[]
  completed: boolean
  list_type: "daily" | "monthly"
  is_recurring: boolean
  recurring_pattern?: {
    frequency: "daily" | "weekly" | "monthly"
    days?: number[] // Days of week (1-7) or days of month (1-31)
  }
  due_date?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface Profile {
  id: string
  display_name?: string
  created_at: string
  updated_at: string
}
