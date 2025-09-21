"use client"

import { useState, useEffect } from "react"
import { jobsAPI, candidatesAPI, assessmentsAPI } from "../api"
import type { Job, Candidate, Assessment } from "../types"

// Custom hook for jobs data
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobsAPI.getJobs()
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const createJob = async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newJob = await jobsAPI.createJob(jobData)
      setJobs((prev) => [...prev, newJob])
      return newJob
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job")
      throw err
    }
  }

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      const updatedJob = await jobsAPI.updateJob(id, updates)
      setJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job")
      throw err
    }
  }

  const deleteJob = async (id: string) => {
    try {
      await jobsAPI.deleteJob(id)
      setJobs((prev) => prev.filter((job) => job.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job")
      throw err
    }
  }

  const reorderJobs = async (reorderedJobs: Job[]) => {
    try {
      await jobsAPI.reorderJobs(reorderedJobs)
      setJobs(reorderedJobs)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder jobs")
      // Revert to previous state on error
      fetchJobs()
      throw err
    }
  }

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    reorderJobs,
  }
}

// Custom hook for candidates data
export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await candidatesAPI.getCandidates()
      setCandidates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const updateCandidateStage = async (id: string, newStage: any) => {
    try {
      const updatedCandidate = await candidatesAPI.updateCandidateStage(id, newStage)
      setCandidates((prev) => prev.map((candidate) => (candidate.id === id ? updatedCandidate : candidate)))
      return updatedCandidate
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update candidate stage")
      throw err
    }
  }

  const addCandidateNote = async (id: string, content: string, mentions: string[] = []) => {
    try {
      const updatedCandidate = await candidatesAPI.addCandidateNote(id, content, mentions)
      setCandidates((prev) => prev.map((candidate) => (candidate.id === id ? updatedCandidate : candidate)))
      return updatedCandidate
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add candidate note")
      throw err
    }
  }

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
    updateCandidateStage,
    addCandidateNote,
  }
}

// Custom hook for assessments data
export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await assessmentsAPI.getAssessments()
      setAssessments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assessments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [])

  const createAssessment = async (assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newAssessment = await assessmentsAPI.createAssessment(assessmentData)
      setAssessments((prev) => [...prev, newAssessment])
      return newAssessment
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create assessment")
      throw err
    }
  }

  const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      const updatedAssessment = await assessmentsAPI.updateAssessment(id, updates)
      setAssessments((prev) => prev.map((assessment) => (assessment.id === id ? updatedAssessment : assessment)))
      return updatedAssessment
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update assessment")
      throw err
    }
  }

  const deleteAssessment = async (id: string) => {
    try {
      await assessmentsAPI.deleteAssessment(id)
      setAssessments((prev) => prev.filter((assessment) => assessment.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete assessment")
      throw err
    }
  }

  const publishAssessment = async (id: string) => {
    try {
      const updatedAssessment = await assessmentsAPI.publishAssessment(id)
      setAssessments((prev) => prev.map((assessment) => (assessment.id === id ? updatedAssessment : assessment)))
      return updatedAssessment
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish assessment")
      throw err
    }
  }

  return {
    assessments,
    loading,
    error,
    refetch: fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    publishAssessment,
  }
}
