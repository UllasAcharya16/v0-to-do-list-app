import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TodoDashboard } from "@/components/todo-dashboard"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">TaskFlow</h1>
            <p className="text-muted-foreground">Welcome back, {data.user.email}</p>
          </div>
          <form action="/auth/logout" method="post">
            <button className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </form>
        </div>
        <TodoDashboard initialTasks={tasks || []} userId={data.user.id} />
      </div>
    </div>
  )
}
