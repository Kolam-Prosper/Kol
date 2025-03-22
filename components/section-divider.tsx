interface SectionDividerProps {
  variant?: "primary" | "secondary" | "tertiary"
}

export function SectionDivider({ variant = "primary" }: SectionDividerProps) {
  const getGradient = () => {
    switch (variant) {
      case "primary":
        return "from-transparent via-primary/30 to-transparent"
      case "secondary":
        return "from-transparent via-gray-700 to-transparent"
      case "tertiary":
        return "from-transparent via-gray-800/50 to-transparent"
      default:
        return "from-transparent via-primary/30 to-transparent"
    }
  }

  return (
    <div className="relative h-16 overflow-hidden">
      <div className={`absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r ${getGradient()}`} />
    </div>
  )
}

