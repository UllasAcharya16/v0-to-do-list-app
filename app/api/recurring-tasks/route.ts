import { processRecurringTasks } from "@/lib/recurring-tasks"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await processRecurringTasks()
    return NextResponse.json({ success: true, message: "Recurring tasks processed" })
  } catch (error) {
    console.error("Error processing recurring tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to process recurring tasks" }, { status: 500 })
  }
}

// This endpoint can be called by a cron job or scheduled task
export async function GET() {
  try {
    await processRecurringTasks()
    return NextResponse.json({ success: true, message: "Recurring tasks processed" })
  } catch (error) {
    console.error("Error processing recurring tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to process recurring tasks" }, { status: 500 })
  }
}
