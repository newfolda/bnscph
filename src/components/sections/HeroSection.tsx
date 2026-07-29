"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Container from "../ui/Container"
import Button from "../ui/Button"
import SellCarModal from "../sell-car/SellCarModal"
import { useLanguage } from "../language/LanguageProvider"
export default function HeroSection() {
  const { t } = useLanguage()
  const rotatingWordsKey = t.hero.rotatingWords.join("\u0000")
  const typewriterWordsKey = t.hero.typewriterWords.join("\u0000")
  const rotatingWords = useMemo(() => rotatingWordsKey.split("\u0000"), [rotatingWordsKey])
  const typewriterWords = useMemo(() => typewriterWordsKey.split("\u0000"), [typewriterWordsKey])
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const rotatingWordMeasureRef = useRef<HTMLSpanElement>(null)
  const rotationIntervalRef = useRef<number | null>(null)
  const rotationTransitionTimerRef = useRef<number | null>(null)
  const typewriterTimerRef = useRef<number | null>(null)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [wordPhase, setWordPhase] = useState<"idle" | "enter" | "exit">("idle")
  const [rotatingWordWidth, setRotatingWordWidth] = useState<number>()
  const [typedWord, setTypedWord] = useState("")
  const activeRotatingWord = rotatingWords[activeWordIndex] ?? rotatingWords[0] ?? ""

  const playMobileHeroVideo = useCallback(() => {
    const video = mobileVideoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    playMobileHeroVideo()
  }, [playMobileHeroVideo])

  useLayoutEffect(() => {
    const measuredWidth = rotatingWordMeasureRef.current?.getBoundingClientRect().width

    if (measuredWidth) {
      setRotatingWordWidth(measuredWidth)
    }
  }, [activeWordIndex, rotatingWordsKey])

  useEffect(() => {
    const words = typewriterWordsKey ? typewriterWordsKey.split("\u0000") : []
    let currentWordIndex = 0
    let characterIndex = 0
    let isDeleting = false

    const clearTypewriter = () => {
      if (typewriterTimerRef.current !== null) {
        window.clearTimeout(typewriterTimerRef.current)
        typewriterTimerRef.current = null
      }
    }

    const typeNextCharacter = () => {
      const currentWord = words[currentWordIndex]

      if (isDeleting) {
        characterIndex -= 1
        setTypedWord(currentWord.slice(0, characterIndex))

        if (characterIndex === 0) {
          isDeleting = false
          currentWordIndex = (currentWordIndex + 1) % words.length
          typewriterTimerRef.current = window.setTimeout(typeNextCharacter, 300)
          return
        }

        typewriterTimerRef.current = window.setTimeout(typeNextCharacter, 65)
        return
      }

      characterIndex += 1
      setTypedWord(currentWord.slice(0, characterIndex))

      if (characterIndex === currentWord.length) {
        isDeleting = true
        typewriterTimerRef.current = window.setTimeout(typeNextCharacter, 1400)
        return
      }

      typewriterTimerRef.current = window.setTimeout(typeNextCharacter, 95)
    }

    clearTypewriter()

    if (words.length === 0) {
      setTypedWord("")
      return clearTypewriter
    }

    setTypedWord("")
    typewriterTimerRef.current = window.setTimeout(typeNextCharacter, 250)

    return clearTypewriter
  }, [typewriterWordsKey])

  useEffect(() => {
    const words = rotatingWordsKey ? rotatingWordsKey.split("\u0000") : []

    const clearRotation = () => {
      if (rotationIntervalRef.current !== null) {
        window.clearInterval(rotationIntervalRef.current)
        rotationIntervalRef.current = null
      }

      if (rotationTransitionTimerRef.current !== null) {
        window.clearTimeout(rotationTransitionTimerRef.current)
        rotationTransitionTimerRef.current = null
      }
    }

    const rotateWord = () => {
      setWordPhase("exit")

      rotationTransitionTimerRef.current = window.setTimeout(() => {
        setActiveWordIndex((currentIndex) => (currentIndex + 1) % words.length)
        setWordPhase("enter")

        rotationTransitionTimerRef.current = window.setTimeout(() => {
          setWordPhase("idle")
          rotationTransitionTimerRef.current = null
        }, 30)
      }, 350)
    }

    clearRotation()
    rotationTransitionTimerRef.current = window.setTimeout(() => {
      setActiveWordIndex(0)
      setWordPhase("idle")

      if (words.length >= 2) {
        rotationIntervalRef.current = window.setInterval(rotateWord, 2800)
      }

      rotationTransitionTimerRef.current = null
    }, 0)

    return clearRotation
  }, [rotatingWordsKey])

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[Hero rotating word]", {
        activeWordIndex,
        word: activeRotatingWord,
      })
    }
  }, [activeRotatingWord, activeWordIndex])

  return (
    <>
      <section
      className="hero-showroom relative isolate overflow-hidden bg-[var(--primary-light)]"
      data-hero-word-index={process.env.NODE_ENV === "development" ? activeWordIndex : undefined}
    >
      <video
        aria-hidden="true"
        autoPlay
        className="hero-mobile-video pointer-events-none absolute inset-0 z-0 h-full w-full object-cover sm:hidden"
        controls={false}
        disablePictureInPicture
        loop
        muted
        onCanPlay={playMobileHeroVideo}
        onError={() => {
          if (process.env.NODE_ENV === "development") {
            console.error("[Mobile hero video] failed to load")
          }
        }}
        onLoadedMetadata={() => {
          if (process.env.NODE_ENV === "development") {
            console.debug("[Mobile hero video] metadata loaded")
          }
        }}
        onPlaying={() => {
          if (process.env.NODE_ENV === "development") {
            console.debug("[Mobile hero video] playing")
          }
        }}
        playsInline
        poster="/images/hero/herobg2.png"
        preload="metadata"
        ref={mobileVideoRef}
        tabIndex={-1}
      >
        <source src="/videos/heromobile.webm" type="video/webm" />
      </video>
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] hidden overflow-hidden sm:block">
        <div className="absolute bottom-12 right-[5%] h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.07] blur-3xl md:h-96 md:w-96" />
      </div>
      <SellCarModal trigger={(openSellCarModal) => (
        <button
          type="button"
          aria-label="Sell my car"
          className="absolute inset-0 z-[3] cursor-pointer sm:hidden"
          onClick={openSellCarModal}
        />
      )} />
      <Container className="relative z-20 hidden h-full !px-0 sm:block sm:h-auto sm:!px-5 md:!px-8 lg:!px-10">
        <div className="absolute inset-0 flex gap-8 px-6 pb-20 pt-7 sm:static sm:px-0 sm:pb-48 sm:pt-20 md:pb-52 lg:pb-60">
          <div className="flex flex-1 flex-col justify-center">
            <h1
              aria-label={t.hero.ariaLabel}
              className="max-w-xl text-[clamp(2.35rem,11vw,3rem)] font-bold leading-[1.04] tracking-[-0.025em] text-white sm:text-5xl sm:leading-[1.1] sm:tracking-tight"
            >
              <span className="block lg:whitespace-nowrap">
                {t.hero.prefix}{" "}
                <span
                  aria-hidden="true"
                  className="hero-rotating-word relative inline-block align-baseline leading-[1.1] transition-[width] duration-[350ms] ease-out"
                  style={rotatingWordWidth ? { width: `${rotatingWordWidth}px` } : undefined}
                >
                  <span ref={rotatingWordMeasureRef} className="invisible whitespace-nowrap">
                    {activeRotatingWord}
                  </span>
                  <span
                    className={`absolute inset-0 inline-block text-[#D7A93F] transition-[transform,opacity] duration-[400ms] ease-out ${
                      wordPhase === "exit" ? "-translate-y-1 opacity-0" : wordPhase === "enter" ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    {activeRotatingWord}
                  </span>
                </span>{" "}
                {t.hero.wordSuffix}
              </span>
              <span className="block">{t.hero.lineTwo}</span>
              <span className="mt-2 block text-[0.72em] font-semibold text-white">
                {t.hero.lineThree}
              </span>
            </h1>
            <p aria-label={`${t.hero.supportingPrefix} ${typewriterWords[0] ?? ""}`} className="mt-4 max-w-md overflow-hidden text-base font-medium leading-relaxed text-white/90 sm:mt-5 sm:overflow-visible sm:text-lg sm:whitespace-nowrap">
              <span aria-hidden="true">
                {t.hero.supportingPrefix}{" "}
                <span className="relative inline-block align-baseline text-[#D7A93F]">
                  <span className="invisible">{typewriterWords.reduce((longestWord, word) => word.length > longestWord.length ? word : longestWord, "")}</span>
                  <span className="absolute left-0 top-0 inline-flex items-baseline whitespace-nowrap">
                    {typedWord}
                    <span className="hero-typewriter-caret" />
                  </span>
                </span>
              </span>
            </p>
            <SellCarModal trigger={(openSellCarModal) => (
              <Button
                aria-label={t.hero.cta}
                onClick={openSellCarModal}
                className="group mt-5 inline-flex h-[52px] w-fit min-w-[280px] items-center justify-center rounded-full !bg-[var(--primary)] !px-6 !text-white shadow-[0_7px_16px_rgba(143,104,25,0.16)] transition-[transform,box-shadow,opacity] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_10px_20px_rgba(143,104,25,0.22)] active:translate-y-0 active:shadow-[0_4px_10px_rgba(143,104,25,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                style={{ borderRadius: "9999px" }}
              >
                <span className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-[20px] font-bold text-white">
                  <span className="sm:hidden">SELL MY CAR</span>
                  <span className="hidden sm:inline">{t.hero.cta}</span>
                  <svg aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" viewBox="0 0 24 24" width="20">
                    <path d="m8 5 7 7-7 7" />
                  </svg>
                </span>
              </Button>
            )} />
          </div>
          <div className="relative hidden h-[440px] flex-1 items-center justify-end sm:flex">
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
        .hero-showroom {
          background-color: var(--primary-light);
          background-image: none;
        }

        @media (max-width: 639px) {
          .hero-showroom {
            aspect-ratio: 4 / 5;
          }
        }

        .hero-showroom-overlay {
          background: transparent;
        }

        .hero-mobile-video {
          object-position: center center;
        }

        @media (min-width: 640px) {
          .hero-showroom {
            background-image: url("/images/hero/herobg2.png");
            background-position: 70% center;
            background-repeat: no-repeat;
            background-size: cover;
          }

          .hero-showroom-overlay {
            background: linear-gradient(90deg, rgba(8, 8, 8, 0.82) 0%, rgba(8, 8, 8, 0.72) 28%, rgba(8, 8, 8, 0.36) 55%, rgba(8, 8, 8, 0) 78%);
          }
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

        @media (prefers-reduced-motion: reduce) {
          .hero-typewriter-caret {
            animation: none;
          }
        }

      `}</style>
      </section>
    </>
  )
}
