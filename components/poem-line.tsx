"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { usePoetryStore } from "@/lib/store"

interface PoemLineProps {
  line: string
  image: string
  position: { x: number; y: number }
  index: number
  canvasRef: React.RefObject<HTMLDivElement>
}

export default function PoemLine({ line, image, position, index, canvasRef }: PoemLineProps) {
  const [pos, setPos] = useState(position)
  const [isDragging, setIsDragging] = useState(false)
  const { rearrangeLine } = usePoetryStore()
  const lineRef = useRef<HTMLDivElement>(null)

  // Generate a simple vector illustration based on the image description
  const generateIllustration = () => {
    // This is a simplified version - in a real app, you might use more complex SVGs
    const shapes = [
      <circle key="circle" cx="25" cy="25" r="20" className="fill-none stroke-current stroke-[1.5]" />,
      <rect key="rect" x="5" y="5" width="40" height="40" className="fill-none stroke-current stroke-[1.5]" />,
      <path key="wave" d="M5,25 Q17,5 25,25 T45,25" className="fill-none stroke-current stroke-[1.5]" />,
      <line key="line" x1="5" y1="25" x2="45" y2="25" className="stroke-current stroke-[1.5]" />,
      <path key="triangle" d="M25,5 L45,45 L5,45 Z" className="fill-none stroke-current stroke-[1.5]" />,
    ]

    // Use the index to select a shape, but could be more sophisticated based on the image text
    return shapes[index % shapes.length]
  }

  const handleClick = () => {
    if (!isDragging) {
      // Generate a new random position
      if (canvasRef.current) {
        const width = canvasRef.current.offsetWidth
        const height = canvasRef.current.offsetHeight
        const margin = 100
        const newX = margin + Math.random() * (width - 2 * margin)
        const newY = margin + Math.random() * (height - 2 * margin)

        setPos({ x: newX, y: newY })
        rearrangeLine(index, { x: newX, y: newY })
      }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.3,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={lineRef}
      className="absolute cursor-pointer"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: isDragging ? 10 : 1,
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      drag
      dragConstraints={canvasRef}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false)
        if (lineRef.current) {
          const rect = lineRef.current.getBoundingClientRect()
          const canvasRect = canvasRef.current?.getBoundingClientRect()
          if (canvasRect) {
            const newX = rect.left - canvasRect.left + rect.width / 2
            const newY = rect.top - canvasRect.top + rect.height / 2
            setPos({ x: newX, y: newY })
          }
        }
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center max-w-[200px]">
        <div className="mb-2 w-12 h-12 text-gray-600">
          <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            {generateIllustration()}
          </svg>
        </div>
        <p className="text-center font-light text-gray-800 text-sm md:text-base">{line}</p>
        <span className="text-xs text-gray-400 mt-1 opacity-70">{image}</span>
      </div>
    </motion.div>
  )
}
