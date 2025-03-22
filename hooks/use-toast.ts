// hooks/use-toast.ts
"use client"

import { useState } from "react"

type ToastProps = {
  title: string
  description: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description }: ToastProps) => {
    // For now, just log to console
    console.log(`Toast: ${title} - ${description}`)
    
    // In a real implementation, you'd add to state and render toasts
    setToasts((prev) => [...prev, { title, description }])
  }

  return { toast }
}
