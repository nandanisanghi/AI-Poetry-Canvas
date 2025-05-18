import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const poetryPrompt = `Generate a short visual poem (4-6 lines) on the theme of "${prompt}". 
    The poem should be evocative, minimalist, and visually oriented. 
    Each line should create a distinct visual image. 
    Format as a JSON array of objects, each with "line" and "image" properties.
    The "image" should be a very brief description (3-5 words) of a minimal vector illustration that complements the line.
    Example format: 
    [
      {"line": "Shadows stretch across empty rooms", "image": "elongated shadows on floor"},
      {"line": "Light filters through dusty blinds", "image": "sunbeams through window slats"}
    ]`

    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: poetryPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse the JSON response
    let poemData
    try {
      poemData = JSON.parse(text)
    } catch (e) {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        poemData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse poem data")
      }
    }

    return NextResponse.json({ poem: poemData })
  } catch (error) {
    console.error("Error generating poem:", error)
    return NextResponse.json({ error: "Failed to generate poem" }, { status: 500 })
  }
}
