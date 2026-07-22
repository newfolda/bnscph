"use client"

import { type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import Container from "../ui/Container"
import Button from "../ui/Button"
import SellCarModal from "../sell-car/SellCarModal"
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

const rotatingWords = ["Smartest", "Easiest", "Fastest", "Simplest"]
const typewriterWords = ["hassle.", "headache.", "time wasted."]


export default function HeroSection() {
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
  }, [activeWordIndex])

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
        setTypedWord("hassle.")
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
  }, [])

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
  }, [])

  return (
    <>
      <section
      className="mobee-hero-showroom relative isolate overflow-hidden bg-[var(--primary-light)]"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
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
      <div aria-hidden="true" className="mobee-hero-showroom-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute bottom-12 right-[5%] h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.07] blur-3xl md:h-96 md:w-96" />
      </div>
      <div
        ref={particleLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] transform-gpu will-change-transform"
      >
        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className={`mobee-hero-particle absolute rounded-full transform-gpu ${particle.blur ? "blur-[1px]" : ""}`}
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
        <div className="flex gap-8 pb-40 pt-20">
          <div className="flex flex-1 flex-col justify-center">
            <h1
              aria-label="The Smartest Way to Sell Your Car in the Philippines."
              className="max-w-xl text-5xl font-bold leading-[1.1] tracking-tight text-white"
            >
              <span className="block lg:whitespace-nowrap">
                The{" "}
                <span
                  aria-hidden="true"
                  className="mobee-hero-rotating-word relative inline-block align-baseline leading-[1.1] transition-[width] duration-[350ms] ease-out"
                  style={rotatingWordWidth ? { width: `${rotatingWordWidth}px` } : undefined}
                >
                  <span ref={rotatingWordMeasureRef} className="invisible whitespace-nowrap">
                    {rotatingWords[activeWordIndex]}
                  </span>
                  <span
                    className={`absolute inset-0 inline-block text-[var(--primary)] transition-[transform,opacity] duration-[400ms] ease-out ${
                      wordPhase === "exit" ? "-translate-y-1 opacity-0" : wordPhase === "enter" ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    {rotatingWords[activeWordIndex]}
                  </span>
                </span>{" "}
                Way
              </span>
              <span className="block">to Sell Your Car</span>
              <span className="mt-2 block text-[0.72em] font-semibold text-white">
                in the Philippines.
              </span>
            </h1>
            <p aria-label="Maximum value. Zero hassle." className="mt-5 max-w-md text-lg font-medium leading-relaxed text-white/90 sm:whitespace-nowrap">
              <span aria-hidden="true">
                Maximum value. Zero{" "}
                <span className="relative inline-block align-baseline text-[var(--primary-hover)]">
                  <span className="invisible">time wasted.</span>
                  <span className="absolute left-0 top-0 inline-flex items-baseline whitespace-nowrap">
                    {typedWord}
                    {!isTypewriterReducedMotion && <span className="mobee-hero-typewriter-caret" />}
                  </span>
                </span>
              </span>
            </p>
            <SellCarModal trigger={(openSellCarModal) => (
            <Button
              aria-label="See My Car's Value"
              onClick={openSellCarModal}
              className="group relative mt-5 h-16 w-full max-w-[15.5rem] overflow-hidden border border-[var(--primary-hover)] !bg-[var(--primary)] !p-0 font-semibold !text-white shadow-[0_12px_28px_rgba(31,31,31,0.12),0_8px_20px_rgba(200,160,68,0.16)] transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:!bg-[var(--primary-hover)] hover:shadow-[0_16px_34px_rgba(31,31,31,0.14),0_12px_24px_rgba(200,160,68,0.22)] active:translate-y-0 active:shadow-[0_9px_20px_rgba(31,31,31,0.1),0_6px_16px_rgba(200,160,68,0.14)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--primary-light)] motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0"
              style={{ borderRadius: "2rem" }}
            >
              <span className="absolute inset-0 z-10 flex items-center justify-center pr-16 whitespace-nowrap text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white sm:text-[0.9rem]">
                See My Car&apos;s Value
              </span>
              <span aria-hidden="true" className="absolute right-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition-[background-color,transform] duration-200 ease-out group-hover:translate-x-1 group-hover:bg-white/30 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:right-4">
                <svg fill="none" height="22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="22">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
              <span aria-hidden="true" className="pointer-events-none absolute -top-8 left-[12%] z-0 h-14 w-2/3 rounded-full bg-white/35 blur-2xl" />
            </Button>
            )} />
          </div>
          <div className="relative flex h-[440px] flex-1 items-center justify-end">
          </div>
        </div>
      </Container>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 w-full md:h-24"
        preserveAspectRatio="none"
        viewBox="0 0 1440 96"
      >
        <path d="M0 46C240 92 472 20 736 54C1000 88 1204 22 1440 48V96H0Z" fill="var(--background)" />
      </svg>
      <style>{`
        @keyframes mobee-hero-dust-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(8px, -12px, 0); }
        }

        .mobee-hero-particle {
          animation-name: mobee-hero-dust-drift;
          animation-direction: alternate;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        .mobee-hero-showroom {
          background-image: url("/images/hero/hero-showroom.png");
          background-position: 64% center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .mobee-hero-showroom-overlay {
          background: linear-gradient(90deg, rgba(8, 8, 8, 0.88) 0%, rgba(8, 8, 8, 0.78) 28%, rgba(8, 8, 8, 0.42) 55%, rgba(8, 8, 8, 0) 78%);
        }

        @media (min-width: 768px) {
          .mobee-hero-showroom {
            background-position: 70% center;
          }
        }

        @media (min-width: 1024px) {
          .mobee-hero-showroom {
            background-position: center right;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobee-hero-rotating-word {
            transition: none;
          }
        }

        @keyframes mobee-hero-typewriter-caret {
          0%, 45% { opacity: 1; }
          55%, 100% { opacity: 0; }
        }

        .mobee-hero-typewriter-caret {
          display: inline-block;
          width: 1px;
          height: 1.1em;
          margin-left: 2px;
          vertical-align: -0.15em;
          background: currentColor;
          animation: mobee-hero-typewriter-caret 900ms steps(1, end) infinite;
        }

        .mobee-hero-particle:nth-child(n + 13) {
          display: none;
        }

        @media (min-width: 768px) {
          .mobee-hero-particle:nth-child(n + 13) {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobee-hero-particle {
            animation: none;
          }

          .mobee-hero-typewriter-caret {
            animation: none;
          }
        }
      `}</style>
      </section>
    </>
  )
}
