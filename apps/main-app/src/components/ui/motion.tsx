'use client'

import { motion, HTMLMotionProps } from 'motion/react'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MotionProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
    className?: string
}

export function FadeIn({ children, delay = 0, className, ...props }: MotionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function SlideUp({ children, delay = 0, className, ...props }: MotionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 50 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function ScaleIn({ children, delay = 0, className, ...props }: MotionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function GlowCard({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0, 255, 128, 0.2)" }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden",
                "hover:border-primary/50 transition-colors",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
