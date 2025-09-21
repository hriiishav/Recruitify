"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeDatabase } from "@/lib/db"

interface DatabaseContextType {
  isInitialized: boolean
  error: string | null
}

const DatabaseContext = createContext<DatabaseContextType>({
  isInitialized: false,
  error: null,
})

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase()
        setIsInitialized(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize database")
      }
    }

    init()
  }, [])

  return <DatabaseContext.Provider value={{ isInitialized, error }}>{children}</DatabaseContext.Provider>
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}
