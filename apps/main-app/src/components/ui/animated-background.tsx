'use client'

import { useRef, useEffect } from 'react'

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const animate = () => {
            time += 0.005
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Dark gradient base
            const gradient = ctx.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.5, 0,
                canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7
            )
            gradient.addColorStop(0, 'rgba(10, 10, 10, 1)')
            gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Animated gradient orbs
            const orbs = [
                { x: 0.3, y: 0.4, r: 300, color: '0, 255, 128' },     // Neon Green
                { x: 0.7, y: 0.6, r: 250, color: '0, 200, 255' },     // Neon Blue
                { x: 0.5, y: 0.3, r: 200, color: '100, 255, 218' },   // Cyan Accent
            ]

            orbs.forEach((orb, i) => {
                const ox = canvas.width * orb.x + Math.sin(time + i * 2) * 100
                const oy = canvas.height * orb.y + Math.cos(time + i * 1.5) * 80
                const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r)
                g.addColorStop(0, `rgba(${orb.color}, 0.15)`)
                g.addColorStop(1, `rgba(${orb.color}, 0)`)
                ctx.fillStyle = g
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            })

            // Grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
            ctx.lineWidth = 1
            for (let x = 0; x < canvas.width; x += 80) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, canvas.height)
                ctx.stroke()
            }
            for (let y = 0; y < canvas.height; y += 80) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(canvas.width, y)
                ctx.stroke()
            }

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
}
