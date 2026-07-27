"use client"

import { type CSSProperties, type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import Container from "../ui/Container"
import Button from "../ui/Button"
import SellCarModal from "../sell-car/SellCarModal"
import { useLanguage } from "../language/LanguageProvider"
const particles = [
  { left: 5, top: 17, size: 3, duration: 19, delay: -5, opacity: 0.34, color: "var(--primary)", blur: false },
  { left: 11, top: 68, size: 2, duration: 23, delay: -11, opacity: 0.28, color: "var(--primary-hover)", blur: false },
  { left: 16, top: 35, size: 4, duration: 21, delay: -7, opacity: 0.2, color: "rgba(255, 255, 255, 0.7)", blur: true },
  { left: 22, top: 82, size: 3, duration: 25, delay: -16, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 29, top: 9, size: 2, duration: 18, delay: -8, opacity: 0.36, color: "var(--primary-hover)", blur: false },
  { left: 34, top: 53, size: 5, duration: 27, delay: -20, opacity: 0.18, color: "var(--primary)", blur: true },
  { left: 41, top: 27, size: 3, duration: 20, delay: -12, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 47, top: 73, size: 2, duration: 24, delay: -4, opacity: 0.26, color: "rgba(255, 255, 255, 0.7)", blur: false },
  { left: 52, top: 14, size: 4, duration: 22, delay: -15, opacity: 0.24, color: "var(--primary-hover)", blur: true },
  { left: 58, top: 62, size: 3, duration: 26, delay: -9, opacity: 0.34, color: "var(--primary)", blur: false },
  { left: 64, top: 38, size: 2, duration: 17, delay: -6, opacity: 0.32, color: "var(--primary-hover)", blur: false },
  { left: 69, top: 88, size: 4, duration: 28, delay: -18, opacity: 0.18, color: "rgba(255, 255, 255, 0.7)", blur: true },
  { left: 73, top: 20, size: 3, duration: 21, delay: -10, opacity: 0.33, color: "var(--primary)", blur: false },
  { left: 77, top: 56, size: 5, duration: 24, delay: -14, opacity: 0.19, color: "var(--primary-hover)", blur: true },
  { left: 81, top: 7, size: 2, duration: 19, delay: -3, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 84, top: 76, size: 3, duration: 27, delay: -21, opacity: 0.27, color: "rgba(255, 255, 255, 0.7)", blur: false },
  { left: 88, top: 43, size: 4, duration: 23, delay: -13, opacity: 0.24, color: "var(--primary)", blur: true },
  { left: 92, top: 25, size: 2, duration: 20, delay: -2, opacity: 0.36, color: "var(--primary-hover)", blur: false },
  { left: 95, top: 65, size: 3, duration: 25, delay: -17, opacity: 0.3, color: "var(--primary)", blur: false },
  { left: 3, top: 48, size: 4, duration: 22, delay: -19, opacity: 0.2, color: "rgba(255, 255, 255, 0.7)", blur: true },
  { left: 38, top: 92, size: 2, duration: 18, delay: -1, opacity: 0.3, color: "var(--primary-hover)", blur: false },
  { left: 56, top: 45, size: 3, duration: 26, delay: -22, opacity: 0.26, color: "var(--primary)", blur: false },
  { left: 70, top: 4, size: 2, duration: 21, delay: -11, opacity: 0.28, color: "rgba(255, 255, 255, 0.7)", blur: false },
  { left: 98, top: 84, size: 4, duration: 28, delay: -7, opacity: 0.19, color: "var(--primary)", blur: true },
]

const goldConfettiPieces = [
  { side: "left", offset: 3, rise: 170, inward: 12, rotate: 146, delay: 0, width: 4, height: 13, color: "#D8B86D", opacity: 0.78 },
  { side: "left", offset: 7, rise: 212, inward: 17, rotate: -128, delay: 55, width: 5, height: 15, color: "#B98235", opacity: 0.7 },
  { side: "left", offset: 11, rise: 144, inward: 22, rotate: 104, delay: 115, width: 5, height: 12, color: "#F0D99A", opacity: 0.76 },
  { side: "left", offset: 2, rise: 232, inward: 9, rotate: -168, delay: 165, width: 4, height: 14, color: "#8E642D", opacity: 0.62 },
  { side: "left", offset: 14, rise: 186, inward: 19, rotate: 132, delay: 35, width: 6, height: 6, color: "#D4A654", opacity: 0.65, square: true },
  { side: "left", offset: 6, rise: 260, inward: 25, rotate: -112, delay: 145, width: 4, height: 16, color: "#E7C97D", opacity: 0.7 },
  { side: "left", offset: 17, rise: 156, inward: 15, rotate: 154, delay: 90, width: 4, height: 11, color: "#AA7838", opacity: 0.66 },
  { side: "left", offset: 9, rise: 224, inward: 28, rotate: -144, delay: 180, width: 5, height: 14, color: "#F2DEAA", opacity: 0.7 },
  { side: "left", offset: 19, rise: 198, inward: 20, rotate: 120, delay: 65, width: 4, height: 13, color: "#C19042", opacity: 0.72 },
  { side: "left", offset: 4, rise: 132, inward: 14, rotate: -102, delay: 125, width: 5, height: 5, color: "#D7B66A", opacity: 0.62, square: true },
  { side: "left", offset: 15, rise: 246, inward: 31, rotate: 166, delay: 20, width: 4, height: 15, color: "#9A6B32", opacity: 0.58 },
  { side: "left", offset: 22, rise: 176, inward: 24, rotate: -136, delay: 155, width: 4, height: 12, color: "#E5C475", opacity: 0.74 },
  { side: "right", offset: 3, rise: 174, inward: 12, rotate: -148, delay: 25, width: 4, height: 14, color: "#D8B86D", opacity: 0.78 },
  { side: "right", offset: 8, rise: 218, inward: 18, rotate: 126, delay: 80, width: 5, height: 15, color: "#B98235", opacity: 0.7 },
  { side: "right", offset: 12, rise: 150, inward: 22, rotate: -108, delay: 130, width: 5, height: 12, color: "#F0D99A", opacity: 0.76 },
  { side: "right", offset: 2, rise: 236, inward: 10, rotate: 172, delay: 175, width: 4, height: 14, color: "#8E642D", opacity: 0.62 },
  { side: "right", offset: 15, rise: 188, inward: 20, rotate: -134, delay: 45, width: 6, height: 6, color: "#D4A654", opacity: 0.65, square: true },
  { side: "right", offset: 6, rise: 264, inward: 26, rotate: 116, delay: 150, width: 4, height: 16, color: "#E7C97D", opacity: 0.7 },
  { side: "right", offset: 18, rise: 160, inward: 16, rotate: -156, delay: 100, width: 4, height: 11, color: "#AA7838", opacity: 0.66 },
  { side: "right", offset: 10, rise: 228, inward: 29, rotate: 146, delay: 185, width: 5, height: 14, color: "#F2DEAA", opacity: 0.7 },
  { side: "right", offset: 20, rise: 202, inward: 21, rotate: -124, delay: 70, width: 4, height: 13, color: "#C19042", opacity: 0.72 },
  { side: "right", offset: 4, rise: 136, inward: 15, rotate: 104, delay: 135, width: 5, height: 5, color: "#D7B66A", opacity: 0.62, square: true },
  { side: "right", offset: 16, rise: 250, inward: 32, rotate: -168, delay: 30, width: 4, height: 15, color: "#9A6B32", opacity: 0.58 },
  { side: "right", offset: 23, rise: 180, inward: 25, rotate: 138, delay: 160, width: 4, height: 12, color: "#E5C475", opacity: 0.74 },
] as const

export default function HeroSection() {
  const { t } = useLanguage()
  const rotatingWords = t.hero.rotatingWords
  const typewriterWords = t.hero.typewriterWords
  const particleLayerRef = useRef<HTMLDivElement>(null)
  const rotatingWordMeasureRef = useRef<HTMLSpanElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const targetOffsetRef = useRef({ x: 0, y: 0 })
  const currentOffsetRef = useRef({ x: 0, y: 0 })
  const prefersReducedMotionRef = useRef(false)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [wordPhase, setWordPhase] = useState<"idle" | "enter" | "exit">("idle")
  const [rotatingWordWidth, setRotatingWordWidth] = useState<number>()
  const [typedWord, setTypedWord] = useState("")
  const [isTypewriterReducedMotion, setIsTypewriterReducedMotion] = useState(false)
  const [showGoldConfetti, setShowGoldConfetti] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const confettiTimer = window.setTimeout(() => {
      setShowGoldConfetti(true)
    }, 300)

    return () => window.clearTimeout(confettiTimer)
  }, [])
  const animateParallax = () => {
    const particleLayer = particleLayerRef.current
    if (!particleLayer || prefersReducedMotionRef.current) { animationFrameRef.current = null; return }
    const target = targetOffsetRef.current
    const current = currentOffsetRef.current
    current.x += (target.x - current.x) * 0.08
    current.y += (target.y - current.y) * 0.08
    particleLayer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
    animationFrameRef.current = Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1 ? window.requestAnimationFrame(animateParallax) : null
  }
  const scheduleParallax = () => { if (animationFrameRef.current === null) animationFrameRef.current = window.requestAnimationFrame(animateParallax) }
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotionRef.current) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5

    targetOffsetRef.current = {
      x: horizontalPosition * 16,
      y: verticalPosition * 12,
    }
    scheduleParallax()
  }

  const handlePointerLeave = () => {
    targetOffsetRef.current = { x: 0, y: 0 }
    scheduleParallax()
  }

  useLayoutEffect(() => {
    const measuredWidth = rotatingWordMeasureRef.current?.getBoundingClientRect().width

    if (measuredWidth) {
      setRotatingWordWidth(measuredWidth)
    }
  }, [activeWordIndex, rotatingWords])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateMotionPreference = () => {
      prefersReducedMotionRef.current = reducedMotionQuery.matches

      if (reducedMotionQuery.matches) {
        targetOffsetRef.current = { x: 0, y: 0 }
        currentOffsetRef.current = { x: 0, y: 0 }

        if (particleLayerRef.current) {
          particleLayerRef.current.style.transform = "translate3d(0, 0, 0)"
        }

        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }
    }

    updateMotionPreference()
    reducedMotionQuery.addEventListener("change", updateMotionPreference)

    return () => {
      reducedMotionQuery.removeEventListener("change", updateMotionPreference)

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let typewriterTimeout: number | undefined
    let currentWordIndex = 0
    let characterIndex = 0
    let isDeleting = false

    const clearTypewriter = () => {
      if (typewriterTimeout !== undefined) {
        window.clearTimeout(typewriterTimeout)
      }
    }

    const typeNextCharacter = () => {
      const currentWord = typewriterWords[currentWordIndex]

      if (isDeleting) {
        characterIndex -= 1
        setTypedWord(currentWord.slice(0, characterIndex))

        if (characterIndex === 0) {
          isDeleting = false
          currentWordIndex = (currentWordIndex + 1) % typewriterWords.length
          typewriterTimeout = window.setTimeout(typeNextCharacter, 300)
          return
        }

        typewriterTimeout = window.setTimeout(typeNextCharacter, 65)
        return
      }

      characterIndex += 1
      setTypedWord(currentWord.slice(0, characterIndex))

      if (characterIndex === currentWord.length) {
        isDeleting = true
        typewriterTimeout = window.setTimeout(typeNextCharacter, 1400)
        return
      }

      typewriterTimeout = window.setTimeout(typeNextCharacter, 95)
    }

    const updateTypewriter = () => {
      clearTypewriter()
      currentWordIndex = 0
      characterIndex = 0
      isDeleting = false
      setIsTypewriterReducedMotion(reducedMotionQuery.matches)

      if (reducedMotionQuery.matches || document.hidden) {
        setTypedWord(typewriterWords[0])
        return
      }

      setTypedWord("")
      typewriterTimeout = window.setTimeout(typeNextCharacter, 250)
    }

    updateTypewriter()
    reducedMotionQuery.addEventListener("change", updateTypewriter)
    document.addEventListener("visibilitychange", updateTypewriter)

    return () => {
      clearTypewriter()
      reducedMotionQuery.removeEventListener("change", updateTypewriter)
      document.removeEventListener("visibilitychange", updateTypewriter)
    }
  }, [typewriterWords])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let rotationTimeout: number | undefined
    let entranceFrame: number | undefined

    const clearRotation = () => {
      if (rotationTimeout !== undefined) {
        window.clearTimeout(rotationTimeout)
      }

      if (entranceFrame !== undefined) {
        window.cancelAnimationFrame(entranceFrame)
      }
    }

    const scheduleRotation = () => {
      rotationTimeout = window.setTimeout(() => {
        setWordPhase("exit")

        rotationTimeout = window.setTimeout(() => {
          setActiveWordIndex((currentIndex) => (currentIndex + 1) % rotatingWords.length)
          setWordPhase("enter")
          entranceFrame = window.requestAnimationFrame(() => setWordPhase("idle"))
          scheduleRotation()
        }, 400)
      }, 2800)
    }

    const updateRotation = () => {
      clearRotation()
      setActiveWordIndex(0)
      setWordPhase("idle")

      if (!reducedMotionQuery.matches && !document.hidden) {
        scheduleRotation()
      }
    }

    updateRotation()
    reducedMotionQuery.addEventListener("change", updateRotation)
    document.addEventListener("visibilitychange", updateRotation)

    return () => {
      clearRotation()
      reducedMotionQuery.removeEventListener("change", updateRotation)
      document.removeEventListener("visibilitychange", updateRotation)
    }
  }, [rotatingWords])

  return (
    <>
      <section
      className="hero-showroom relative isolate overflow-hidden bg-[var(--primary-light)]"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      {/* Temporarily disabled while evaluating /images/hero/herobg2.png as the hero background.
      <video
        aria-hidden="true"
        autoPlay
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover [filter:brightness(0.9)_saturate(0.9)] motion-reduce:hidden"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      */}
      <div aria-hidden="true" className="hero-showroom-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute bottom-12 right-[5%] h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.07] blur-3xl md:h-96 md:w-96" />
      </div>
      {showGoldConfetti && (
        <div aria-hidden="true" className="hero-gold-confetti pointer-events-none absolute inset-0 z-[4] overflow-hidden">
          {goldConfettiPieces.map((piece, index) => (
            <span
              key={`${piece.side}-${index}`}
              className={`hero-gold-confetti-piece ${piece.square ? "hero-gold-confetti-piece--square" : ""}`}
              style={{
                [piece.side]: `${piece.offset}%`,
                bottom: `${7 + index % 4 * 2}%`,
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                backgroundColor: piece.color,
                "--confetti-x": `${piece.side === "left" ? piece.inward : -piece.inward}vw`,
                "--confetti-y": `-${piece.rise}px`,
                "--confetti-rotation": `${piece.rotate}deg`,
                "--confetti-delay": `${piece.delay}ms`,
                "--confetti-opacity": piece.opacity,
              } as CSSProperties}
            />
          ))}
        </div>
      )}
      <div
        ref={particleLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] transform-gpu will-change-transform"
      >
        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className={`hero-particle absolute rounded-full transform-gpu ${particle.blur ? "blur-[1px]" : ""}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      <Container className="relative z-20">
        <div className="flex gap-8 pb-48 pt-20 md:pb-52 lg:pb-60">
          <div className="flex flex-1 flex-col justify-center">
            <h1
              aria-label={t.hero.ariaLabel}
              className="max-w-xl text-5xl font-bold leading-[1.1] tracking-tight text-white"
            >
              <span className="block lg:whitespace-nowrap">
                {t.hero.prefix}{" "}
                <span
                  aria-hidden="true"
                  className="hero-rotating-word relative inline-block align-baseline leading-[1.1] transition-[width] duration-[350ms] ease-out"
                  style={rotatingWordWidth ? { width: `${rotatingWordWidth}px` } : undefined}
                >
                  <span ref={rotatingWordMeasureRef} className="invisible whitespace-nowrap">
                    {rotatingWords[activeWordIndex]}
                  </span>
                  <span
                    className={`absolute inset-0 inline-block text-[#D7A93F] transition-[transform,opacity] duration-[400ms] ease-out ${
                      wordPhase === "exit" ? "-translate-y-1 opacity-0" : wordPhase === "enter" ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    {rotatingWords[activeWordIndex]}
                  </span>
                </span>{" "}
                {t.hero.wordSuffix}
              </span>
              <span className="block">{t.hero.lineTwo}</span>
              <span className="mt-2 block text-[0.72em] font-semibold text-white">
                {t.hero.lineThree}
              </span>
            </h1>
            <p aria-label={`${t.hero.supportingPrefix} ${typewriterWords[0]}`} className="mt-5 max-w-md text-lg font-medium leading-relaxed text-white/90 sm:whitespace-nowrap">
              <span aria-hidden="true">
                {t.hero.supportingPrefix}{" "}
                <span className="relative inline-block align-baseline text-[#D7A93F]">
                  <span className="invisible">{typewriterWords.reduce((longestWord, word) => word.length > longestWord.length ? word : longestWord)}</span>
                  <span className="absolute left-0 top-0 inline-flex items-baseline whitespace-nowrap">
                    {typedWord}
                    {!isTypewriterReducedMotion && <span className="hero-typewriter-caret" />}
                  </span>
                </span>
              </span>
            </p>
            <SellCarModal trigger={(openSellCarModal) => (
            <Button
              aria-label={t.hero.cta}
              onClick={openSellCarModal}
              className="group relative mt-5 h-16 w-full max-w-[16.625rem] overflow-hidden border border-[rgba(181,132,31,0.62)] !bg-[linear-gradient(135deg,rgba(224,183,86,0.96),rgba(198,150,45,0.94),rgba(218,174,72,0.95))] !p-0 font-semibold !text-white shadow-[0_10px_24px_rgba(92,62,14,0.22),0_4px_10px_rgba(20,24,32,0.14),inset_0_1px_0_rgba(255,244,204,0.5)] backdrop-blur-sm transition-[transform,box-shadow,background,color,border-color] duration-[240ms] ease-out hover:-translate-y-px hover:border-[rgba(181,132,31,0.78)] hover:!bg-[linear-gradient(135deg,rgba(231,192,101,0.97),rgba(206,158,52,0.95),rgba(224,181,80,0.96))] hover:!text-white hover:shadow-[0_13px_28px_rgba(92,62,14,0.25),0_5px_12px_rgba(20,24,32,0.16),inset_0_1px_0_rgba(255,244,204,0.58)] active:translate-y-0 active:shadow-[0_9px_20px_rgba(92,62,14,0.18)] focus-visible:-translate-y-px focus-visible:border-[rgba(181,132,31,0.78)] focus-visible:!bg-[linear-gradient(135deg,rgba(231,192,101,0.97),rgba(206,158,52,0.95),rgba(224,181,80,0.96))] focus-visible:!text-white focus-visible:shadow-[0_13px_28px_rgba(92,62,14,0.25),0_5px_12px_rgba(20,24,32,0.16),inset_0_1px_0_rgba(255,244,204,0.58)] focus-visible:ring-2 focus-visible:ring-[rgba(181,132,31,0.68)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--primary-light)] motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 motion-reduce:active:translate-y-0"
              style={{ borderRadius: "2rem" }}
            >
              <span className="absolute inset-0 z-10 flex translate-x-2.5 items-center justify-center pr-16 whitespace-nowrap text-[0.84rem] font-bold uppercase tracking-[0.07em] text-white transition-colors duration-[240ms] sm:text-[0.95rem]">
                {t.hero.cta}
              </span>
              <span aria-hidden="true" className="absolute right-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/16 text-white transition-[background-color,border-color,transform] duration-[240ms] ease-out group-hover:translate-x-1 group-hover:border-white/34 group-hover:bg-white/20 group-focus-visible:border-white/34 group-focus-visible:bg-white/20 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:right-4">
                <svg fill="none" height="22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="22">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-1 z-0 h-8 rounded-full bg-[radial-gradient(ellipse_at_25%_0%,rgba(255,255,255,0.38),rgba(255,245,204,0.14)_34%,transparent_72%)]" />
            </Button>
            )} />
          </div>
          <div className="relative flex h-[440px] flex-1 items-center justify-end">
          </div>
        </div>
      </Container>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-[calc(3rem+1px)] w-full md:h-[calc(4rem+1px)]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 96"
      >
        <path
          d="M0 46C240 92 472 20 736 54C1000 88 1204 22 1440 48V96H0Z"
          fill="white"
        />
      </svg>
      <style>{`
        @keyframes hero-dust-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(8px, -12px, 0); }
        }

        .hero-particle {
          animation-name: hero-dust-drift;
          animation-direction: alternate;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        .hero-showroom {
          background-image: url("/images/hero/herobg2.png");
          background-position: 64% center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .hero-showroom-overlay {
          background: linear-gradient(90deg, rgba(8, 8, 8, 0.82) 0%, rgba(8, 8, 8, 0.72) 28%, rgba(8, 8, 8, 0.36) 55%, rgba(8, 8, 8, 0) 78%);
        }

        @media (min-width: 768px) {
          .hero-showroom {
            background-position: 70% center;
          }
        }

        @media (min-width: 1024px) {
          .hero-showroom {
            background-position: center right;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-rotating-word {
            transition: none;
          }
        }

        @keyframes hero-typewriter-caret {
          0%, 45% { opacity: 1; }
          55%, 100% { opacity: 0; }
        }

        .hero-typewriter-caret {
          display: inline-block;
          width: 1px;
          height: 1.1em;
          margin-left: 2px;
          vertical-align: -0.15em;
          background: currentColor;
          animation: hero-typewriter-caret 900ms steps(1, end) infinite;
        }

        .hero-particle:nth-child(n + 13) {
          display: none;
        }

        @media (min-width: 768px) {
          .hero-particle:nth-child(n + 13) {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-particle {
            animation: none;
          }

          .hero-typewriter-caret {
            animation: none;
          }
        }
      `}</style>
      </section>
    </>
  )
}
