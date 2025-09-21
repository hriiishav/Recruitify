"use client"

import type React from "react"

import { Suspense, useEffect } from "react"
import { Analytics } from "@vercel/analytics/next"
import { DatabaseProvider } from "@/components/providers/database-provider"

function ResizeObserverErrorSuppressor() {
  useEffect(() => {
    // Suppress ResizeObserver loop completed with undelivered notifications error
    const resizeObserverErrorHandler = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        e.stopImmediatePropagation()
        return false
      }
    }

    window.addEventListener("error", resizeObserverErrorHandler)

    return () => {
      window.removeEventListener("error", resizeObserverErrorHandler)
    }
  }, [])

  return null
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ResizeObserverErrorSuppressor />
      <DatabaseProvider>
        <Suspense fallback={null}>{children}</Suspense>
      </DatabaseProvider>
      <Analytics />
    </>
  )
}
