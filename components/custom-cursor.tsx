"use client"

import * as React from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"

const CURSOR_COLOR = "#26251E"
const ACTIVE_CLASS = "custom-cursor-active"
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='interactive']"

// Trail settings
const TRAIL_LIFE_MS = 260 // how long each point lives (shorter = slighter)
const TRAIL_MAX_WIDTH = 1.6 // thickness near the cursor (px)
const TRAIL_MIN_WIDTH = 0.3 // thickness at the tail (px)
const TRAIL_OPACITY = 0.3 // overall trail strength
const TRAIL_MIN_DISTANCE = 0.5 // ignore tiny movements

type TrailPoint = { x: number; y: number; t: number }

export function CustomCursor(): React.ReactElement | null {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = React.useState(false)
  const [interactive, setInteractive] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 })

  // Cursor + interaction state
  React.useEffect(() => {
    if (prefersReducedMotion) return

    const root = document.documentElement

    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse") return

      root.classList.add(ACTIVE_CLASS)
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)

      const target = event.target
      setInteractive(
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
      )
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (event.pointerType === "mouse") setPressed(true)
    }
    const handlePointerUp = (): void => setPressed(false)
    const handleLeave = (): void => {
      setVisible(false)
      setPressed(false)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointerup", handlePointerUp)
    root.addEventListener("mouseleave", handleLeave)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      root.removeEventListener("mouseleave", handleLeave)
      root.classList.remove(ACTIVE_CLASS)
    }
  }, [prefersReducedMotion, x, y])

  // Trail
  React.useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const points: TrailPoint[] = []
    let rafId = 0
    let running = false

    const resize = (): void => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = (now: number): void => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Add the newest point from the smoothed cursor position
      const px = springX.get()
      const py = springY.get()
      const last = points[points.length - 1]
      if (
        px > -50 &&
        (!last || Math.hypot(px - last.x, py - last.y) > TRAIL_MIN_DISTANCE)
      ) {
        points.push({ x: px, y: py, t: now })
      }

      // Remove expired points
      while (points.length > 0 && now - points[0].t > TRAIL_LIFE_MS) {
        points.shift()
      }

      if (points.length > 1) {
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = CURSOR_COLOR

        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1]
          const p1 = points[i]
          const age = (now - p1.t) / TRAIL_LIFE_MS // 0 = fresh, 1 = gone
          const life = Math.max(0, 1 - age)
          const eased = life * life // faster fade toward the tail

          ctx.globalAlpha = eased * TRAIL_OPACITY
          ctx.lineWidth = Math.max(
            TRAIL_MIN_WIDTH,
            TRAIL_MAX_WIDTH * eased
          )

          // Smooth the line with midpoint quadratic curves
          const mx0 = (p0.x + p1.x) / 2
          const my0 = (p0.y + p1.y) / 2
          const prev = points[i - 2]
          const sx = prev ? (prev.x + p0.x) / 2 : p0.x
          const sy = prev ? (prev.y + p0.y) / 2 : p0.y

          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.quadraticCurveTo(p0.x, p0.y, mx0, my0)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      if (points.length > 0 || springX.isAnimating() || springY.isAnimating()) {
        rafId = requestAnimationFrame(draw)
      } else {
        running = false
      }
    }

    const start = (): void => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(draw)
    }

    const handleMove = (event: PointerEvent): void => {
      if (event.pointerType === "mouse") start()
    }
    window.addEventListener("pointermove", handleMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("resize", resize)
    }
  }, [prefersReducedMotion, springX, springY])

  if (prefersReducedMotion) return null

  return (
    <>
      {/* Trail */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
      />

      {/* Cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x: springX, y: springY }}
      >
        <motion.svg
          width={18}
          height={18}
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block origin-top-left"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.85 : interactive ? 1.18 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.6 }}
        >
          <path
            d="M0.439383 0.439383C0.855314 0.0234519 1.47597 -0.110987 2.02673 0.0955492L13.0267 4.22055C13.6416 4.45111 14.035 5.05477 13.9976 5.71034C13.9603 6.36592 13.5009 6.921 12.8638 7.08026L8.23697 8.23697L7.08026 12.8638C6.921 13.5009 6.36592 13.9603 5.71034 13.9976C5.05477 14.035 4.45111 13.6416 4.22055 13.0267L0.0955492 2.02673C-0.110987 1.47597 0.0234519 0.855314 0.439383 0.439383Z"
            fill="white"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path
            d="M1.6756 1.03188C1.49202 0.963033 1.28513 1.00785 1.14649 1.14649C1.00785 1.28513 0.963033 1.49202 1.03188 1.6756L5.15688 12.6756C5.23373 12.8805 5.43495 13.0117 5.65348 12.9992C5.872 12.9868 6.05703 12.8337 6.11011 12.6213L7.41235 7.41235L12.6213 6.11011C12.8337 6.05703 12.9868 5.872 12.9992 5.65348C13.0117 5.43495 12.8805 5.23373 12.6756 5.15688L1.6756 1.03188Z"
            fill={CURSOR_COLOR}
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.div>
    </>
  )
}