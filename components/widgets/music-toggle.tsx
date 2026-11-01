"use client"

import * as React from "react"
import {
  ArrowUpRightIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react"

import type { DayNightMode } from "@/components/widgets/day-night-switch"
import { cn } from "@/lib/utils"

type MusicToggleProps = {
  targetRef: React.RefObject<HTMLElement | null>
  mode: DayNightMode
  className?: string
}

function MusicBars(): React.ReactElement {
  return (
    <span className="music-bars" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  )
}

const TRACKS = {
  day: {
    src: "/assets/projects/295-music.mp3",
    video:
      "https://www.youtube.com/watch?v=n_FCrCQ6-bA&list=RDn_FCrCQ6-bA&start_radio=1",
  },
  night: {
    src: "/assets/projects/background-music.mp3",
    video:
      "https://www.youtube.com/watch?v=vM6NQ23BRK4&list=RDvM6NQ23BRK4&start_radio=1",
  },
} as const

export function MusicToggle({
  targetRef,
  mode,
  className,
}: MusicToggleProps): React.ReactElement {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const frameRef = React.useRef<number | null>(null)
  const positionsRef = React.useRef<Record<DayNightMode, number>>({
    day: 0,
    night: 0,
  })
  const previousModeRef = React.useRef<DayNightMode>(mode)
  const [enabled, setEnabled] = React.useState(true)
  const track = TRACKS[mode]

  const fadeTo = React.useCallback((targetVolume: number) => {
    const audio = audioRef.current
    if (!audio) return

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    const step = () => {
      const difference = targetVolume - audio.volume
      if (Math.abs(difference) < 0.01) {
        audio.volume = targetVolume
        if (targetVolume === 0) audio.pause()
        frameRef.current = null
        return
      }

      audio.volume += difference * 0.08
      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
  }, [])

  const playMusic = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio || !enabled) return

    audio.volume = 0
    void audio.play().then(() => fadeTo(0.18)).catch(() => {
      // Browsers may require a user gesture before allowing audible autoplay.
    })
  }, [enabled, fadeTo])

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (previousModeRef.current !== mode) {
      positionsRef.current[previousModeRef.current] = audio.currentTime
      previousModeRef.current = mode
      fadeTo(0)
      audio.pause()
      audio.src = track.src
      audio.load()
      audio.currentTime = positionsRef.current[mode]
    } else if (!audio.src) {
      audio.src = track.src
      audio.load()
      audio.currentTime = positionsRef.current[mode]
    }

    if (!enabled) {
      return
    }

    const switchTimer = window.setTimeout(() => {
      playMusic()
    }, 180)

    return () => window.clearTimeout(switchTimer)
  }, [enabled, fadeTo, mode, playMusic, track.src])

  React.useEffect(() => {
    const audio = audioRef.current
    const target = targetRef.current
    if (!audio || !target) return

    audio.volume = 0
    playMusic()

    const startAfterGesture = () => playMusic()
    window.addEventListener("pointerdown", startAfterGesture, { once: true })
    window.addEventListener("keydown", startAfterGesture, { once: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && enabled) {
          playMusic()
          fadeTo(0.18 * entry.intersectionRatio)
        } else {
          fadeTo(0)
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
      window.removeEventListener("pointerdown", startAfterGesture)
      window.removeEventListener("keydown", startAfterGesture)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      audio.pause()
    }
  }, [enabled, fadeTo, playMusic, targetRef])

  const toggleMusic = () => {
    const nextEnabled = !enabled
    setEnabled(nextEnabled)
    if (nextEnabled) {
      playMusic()
    } else {
      fadeTo(0)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        aria-hidden="true"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMusic}
          aria-pressed={enabled}
          aria-label={
            enabled ? "Mute background music" : "Play background music"
          }
          className={cn(
            "caption-uppercase inline-flex items-center gap-2 rounded-full border border-overlay-cream/20 bg-overlay-ink/35 px-3 py-1.5 text-overlay-cream/75 backdrop-blur-[2px] transition-colors hover:border-overlay-cream/40 hover:text-overlay-cream focus-visible:ring-2 focus-visible:ring-overlay-cream/45 focus-visible:outline-none",
            className
          )}
        >
          {enabled ? (
            <SpeakerHighIcon size={14} weight="regular" aria-hidden />
          ) : (
            <SpeakerSlashIcon size={14} weight="regular" aria-hidden />
          )}
          {enabled ? <MusicBars /> : <span>off</span>}
        </button>
        <a
          href={track.video}
          target="_blank"
          rel="noreferrer"
          aria-label="Open music video on YouTube"
          className="caption-uppercase inline-flex items-center gap-1 rounded-full border border-overlay-cream/20 bg-overlay-ink/35 px-2.5 py-1.5 text-overlay-cream/65 backdrop-blur-[2px] transition-colors hover:border-overlay-cream/40 hover:text-overlay-cream focus-visible:ring-2 focus-visible:ring-overlay-cream/45 focus-visible:outline-none"
        >
          <span>Watch</span>
          <ArrowUpRightIcon size={12} weight="regular" aria-hidden />
        </a>
      </div>
    </>
  )
}
