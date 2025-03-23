"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dapp")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting to dashboard...</p>
    </div>
  )
}

