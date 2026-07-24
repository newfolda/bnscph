import Header from "@/src/components/layout/Header"
import Footer from "@/src/components/layout/Footer"
import DailyTransactionsSection from "@/src/components/sections/DailyTransactionsSection"
import FaqSection from "@/src/components/sections/FaqSection"
import HeroSection from "@/src/components/sections/HeroSection"
import ProcessSection from "@/src/components/sections/ProcessSection"
import BenefitsSection from "@/src/components/sections/BenefitsSection"

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <main className="homepage-ambient">
        <div aria-hidden="true" className="homepage-ambient-layer" />
        <ProcessSection />
        <DailyTransactionsSection />
        <BenefitsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
