"use client"

import { useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { usePoetryStore } from "@/lib/store"
import PoemLine from "./poem-line"

export default function PoetryCanvas() {
  const { poem, isGenerating } = usePoetryStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Function to generate random positions within the canvas
  const getRandomPosition = () => {
    if (!canvasRef.current) return { x: 0, y: 0 }

    const width = canvasRef.current.offsetWidth
    const height = canvasRef.current.offsetHeight

    // Keep positions within bounds and avoid edges
    const margin = 100
    const x = margin + Math.random() * (width - 2 * margin)
    const y = margin + Math.random() * (height - 2 * margin)

    return { x, y }
  }

  return (
    <div
      ref={canvasRef}
      className="w-full h-[60vh] bg-gray-50 rounded-lg relative overflow-hidden border border-gray-200"
    >
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-lg text-gray-500 animate-pulse">Crafting your poem...</div>
        </div>
      )}

      <AnimatePresence>
        {poem && poem.length > 0 && !isGenerating && (
          <div className="absolute inset-0">
            {poem.map((line, index) => {
              const position = getRandomPosition()
              return (
                <PoemLine
                  key={index}
                  line={line.line}
                  image={line.image}
                  position={position}
                  index={index}
                  canvasRef={canvasRef}
                />
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
