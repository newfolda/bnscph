import Header from "@/src/components/layout/Header"
import Footer from "@/src/components/layout/Footer"
import BenefitsSection from "@/src/components/sections/BenefitsSection"
import FaqSection from "@/src/components/sections/FaqSection"
import HeroSection from "@/src/components/sections/HeroSection"
import ProcessSection from "@/src/components/sections/ProcessSection"
import ReviewsSection from "@/src/components/sections/ReviewsSection"

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ProcessSection />
      <BenefitsSection />
      <ReviewsSection />
      <FaqSection />
      <Footer />
    </>
  )
}
