"use client"

import { useToast as useOriginalToast } from "@/components/ui/toast"

// This is a wrapper around the toast implementation to ensure consistent usage
export function useToast() {
  const { toast: originalToast } = useOriginalToast()

  return {
    toast: ({
      title,
      description,
      status = "default",
    }: {
      title: string
      description: string
      status?: "default" | "error" | "success" | "warning" | "info"
    }) => {
      // Map the status to the appropriate variant
      const variant = status === "error" ? "destructive" : status

      return originalToast({
        title,
        description,
        variant,
      })
    },
  }
}

