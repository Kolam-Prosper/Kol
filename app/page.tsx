import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Products } from "@/components/products"
import { Staking } from "@/components/staking"
import { Lending } from "@/components/lending"
import { Investments } from "@/components/investments"
import { Footer } from "@/components/footer"
import { LaunchApp } from "@/components/launch-app"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Staking />
      <Lending />
      <Investments />
      <LaunchApp />
      <Footer />
    </main>
  )
}

