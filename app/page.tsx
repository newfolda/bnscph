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
      <ProcessSection />
      <DailyTransactionsSection />
      <BenefitsSection />
      <FaqSection />
      <Footer />
    </>
  )
}
