"use client"

import { useEffect, useRef } from "react"

interface KolamDesignProps {
  width?: number
  height?: number
  className?: string
  color?: string
  opacity?: number
}

export function KolamDesign({
  width = 200,
  height = 200,
  className = "",
  color = "#ff5722",
  opacity = 0.7,
}: KolamDesignProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw kolam pattern
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.45

    // Colors
    const primaryColor = color
    ctx.strokeStyle = primaryColor
    ctx.lineWidth = 1.5

    // Draw the traditional kolam pattern
    const drawTraditionalKolam = () => {
      // Set opacity for all drawing operations
      ctx.globalAlpha = opacity

      // Draw the main circular structure
      const drawMainCircles = () => {
        // Outer circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, maxRadius * 0.9, 0, Math.PI * 2)
        ctx.stroke()

        // Middle circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, maxRadius * 0.7, 0, Math.PI * 2)
        ctx.stroke()

        // Inner circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, maxRadius * 0.5, 0, Math.PI * 2)
        ctx.stroke()

        // Center circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, maxRadius * 0.2, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw the lotus pattern
      const drawLotusPetals = () => {
        const petalCount = 16
        const innerRadius = maxRadius * 0.5
        const outerRadius = maxRadius * 0.7

        for (let i = 0; i < petalCount; i++) {
          const angle = (i * 2 * Math.PI) / petalCount
          const nextAngle = ((i + 1) * 2 * Math.PI) / petalCount

          const midAngle = (angle + nextAngle) / 2

          const x1 = centerX + innerRadius * Math.cos(angle)
          const y1 = centerY + innerRadius * Math.sin(angle)

          const x2 = centerX + innerRadius * Math.cos(nextAngle)
          const y2 = centerY + innerRadius * Math.sin(nextAngle)

          const cpX = centerX + outerRadius * 1.1 * Math.cos(midAngle)
          const cpY = centerY + outerRadius * 1.1 * Math.sin(midAngle)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.quadraticCurveTo(cpX, cpY, x2, y2)
          ctx.stroke()
        }
      }

      // Draw the star pattern
      const drawStarPattern = () => {
        const pointCount = 8
        const innerRadius = maxRadius * 0.2
        const outerRadius = maxRadius * 0.9

        for (let i = 0; i < pointCount; i++) {
          const angle = (i * 2 * Math.PI) / pointCount

          const x1 = centerX + innerRadius * Math.cos(angle)
          const y1 = centerY + innerRadius * Math.sin(angle)

          const x2 = centerX + outerRadius * Math.cos(angle)
          const y2 = centerY + outerRadius * Math.sin(angle)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }

      // Draw connecting patterns
      const drawConnectingPatterns = () => {
        const pointCount = 8
        const radius = maxRadius * 0.7

        for (let i = 0; i < pointCount; i++) {
          const angle = (i * 2 * Math.PI) / pointCount
          const nextAngle = ((i + 2) * 2 * Math.PI) / pointCount

          const x1 = centerX + radius * Math.cos(angle)
          const y1 = centerY + radius * Math.sin(angle)

          const x2 = centerX + radius * Math.cos(nextAngle)
          const y2 = centerY + radius * Math.sin(nextAngle)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }

      // Draw decorative dots
      const drawDots = () => {
        const dotCount = 24
        const radius = maxRadius * 0.8

        ctx.fillStyle = primaryColor

        for (let i = 0; i < dotCount; i++) {
          const angle = (i * 2 * Math.PI) / dotCount

          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Inner dots
        const innerDotCount = 8
        const innerRadius = maxRadius * 0.35

        for (let i = 0; i < innerDotCount; i++) {
          const angle = (i * 2 * Math.PI) / innerDotCount

          const x = centerX + innerRadius * Math.cos(angle)
          const y = centerY + innerRadius * Math.sin(angle)

          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw intricate patterns
      const drawIntricatePatterns = () => {
        const patternCount = 8
        const innerRadius = maxRadius * 0.35
        const outerRadius = maxRadius * 0.5

        for (let i = 0; i < patternCount; i++) {
          const angle = (i * 2 * Math.PI) / patternCount
          const nextAngle = ((i + 1) * 2 * Math.PI) / patternCount

          const x1 = centerX + innerRadius * Math.cos(angle)
          const y1 = centerY + innerRadius * Math.sin(angle)

          const x2 = centerX + outerRadius * Math.cos(angle)
          const y2 = centerY + outerRadius * Math.sin(angle)

          const x3 = centerX + outerRadius * Math.cos(nextAngle)
          const y3 = centerY + outerRadius * Math.sin(nextAngle)

          const x4 = centerX + innerRadius * Math.cos(nextAngle)
          const y4 = centerY + innerRadius * Math.sin(nextAngle)

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.lineTo(x3, y3)
          ctx.lineTo(x4, y4)
          ctx.closePath()
          ctx.stroke()
        }
      }

      // Execute all drawing functions
      drawMainCircles()
      drawLotusPetals()
      drawStarPattern()
      drawConnectingPatterns()
      drawDots()
      drawIntricatePatterns()
    }

    // Execute the main drawing function
    drawTraditionalKolam()
  }, [width, height, color, opacity])

  return <canvas ref={canvasRef} className={`${className}`} />
}

