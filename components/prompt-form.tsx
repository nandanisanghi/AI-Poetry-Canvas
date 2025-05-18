"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { usePoetryStore } from "@/lib/store"

export default function PromptForm() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { setPoem, setIsGenerating } = usePoetryStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Enter a theme for your visual poem",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate poem")
      }

      const data = await response.json()
      setPoem(data.poem)

      toast({
        title: "Poem generated",
        description: "Your visual poem has been created",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error generating poem",
        description: "Please try again with a different prompt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-12">
      <div className="flex flex-col space-y-4">
        <label htmlFor="prompt" className="text-sm font-medium">
          Enter a theme for your visual poem
        </label>
        <div className="flex space-x-2">
          <Input
            id="prompt"
            placeholder="e.g., solitude and light"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </form>
  )
}
