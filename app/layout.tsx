import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaskFlow - Organize Your Daily & Monthly Tasks",
  description:
    "A comprehensive todo list app with recurring tasks, progress tracking, and clean minimal design. Built with Next.js and Supabase.",
  generator: "v0.app",
  keywords: ["todo", "tasks", "productivity", "recurring tasks", "progress tracking"],
  authors: [{ name: "TaskFlow" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
