'use client'

import { useEffect, useRef } from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        const isMobile = window.innerWidth < 768
        const pointsCount = isMobile ? 50 : 100

        const points: {
            x: number;
            y: number;
            vx: number;
            vy: number;
            isSpecial: boolean;
            color: string;
            alpha: number;
            alphaDirection: number;
        }[] = []

        function randomColor() {
            return Math.random() > 0.5 ? 'black' : 'red'
        }

        function randomizeSpecialPoints() {
            points.forEach(p => {
                p.isSpecial = Math.random() < 0.1 // ~10% of points are special
                if (p.isSpecial) {
                    p.color = randomColor()
                    p.alpha = Math.random()
                    p.alphaDirection = Math.random() > 0.5 ? 1 : -1
                }
            })
        }

        for (let i = 0; i < pointsCount; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                isSpecial: false,
                color: 'black',
                alpha: 1,
                alphaDirection: 1,
            })
        }

        randomizeSpecialPoints()
        setInterval(randomizeSpecialPoints, 4000) // reselect special dots every 4 seconds

        function draw() {
            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)

            for (let i = 0; i < points.length; i++) {
                let p = points[i]
                p.x += p.vx
                p.y += p.vy

                if (p.x < 0 || p.x > width) p.vx *= -1
                if (p.y < 0 || p.y > height) p.vy *= -1

                ctx.beginPath()
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)

                if (p.isSpecial) {
                    // Update alpha for fade in/out
                    p.alpha += 0.02 * p.alphaDirection
                    if (p.alpha >= 1) {
                        p.alpha = 1
                        p.alphaDirection = -1
                    }
                    if (p.alpha <= 0.2) {
                        p.alpha = 0.2
                        p.alphaDirection = 1
                    }
                    ctx.fillStyle = p.color
                    ctx.globalAlpha = p.alpha
                } else {
                    ctx.fillStyle = '#ccc'
                    ctx.globalAlpha = 1
                }

                ctx.fill()
            }

            ctx.globalAlpha = 1 // Reset alpha for lines

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    let dx = points[i].x - points[j].x
                    let dy = points[i].y - points[j].y
                    let dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 100) {
                        ctx.beginPath()
                        ctx.moveTo(points[i].x, points[i].y)
                        ctx.lineTo(points[j].x, points[j].y)
                        ctx.strokeStyle = 'rgba(200,200,200,0.3)'
                        ctx.lineWidth = 1
                        ctx.stroke()
                    }
                }
            }
        }

        function animate() {
            draw()
            requestAnimationFrame(animate)
        }

        animate()

        window.addEventListener('resize', () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        })
    }, [])

    return (
        <section className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32" style={{ height: "88vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", }}>
            {/* Background Canvas */}
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

            {/* Main Content */}
            <div className="container relative z-10 flex max-w-5xl flex-col items-center gap-4 text-center">
                <Link
                    href={siteConfig.links.twitter}
                    className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
                    target="_blank"
                >
                    Follow along on Twitter
                </Link>
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                    Revolutionize healthcare with Eddiecare.
                </h1>
                <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Eddiecare connects patients with healthcare providers for telemedicine, scheduling, and health tracking.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 space-x-4">
                    <Link href="#features" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Started
                    </Link>
                    <Link
                        href={"/#join-form"}
                        rel="noreferrer"
                        style={{ marginLeft: "0px" }}
                        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                    >
                        Join the Waitlist
                    </Link>
                </div>
            </div>
        </section>
    )
}
