import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">TaskFlow</h1>
          <p className="text-lg text-muted-foreground">Organize your daily and monthly tasks with ease</p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/demo">Try Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
