import PoetryCanvas from "@/components/poetry-canvas"
import PromptForm from "@/components/prompt-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-light text-center mb-8">AI Poetry Canvas</h1>
        <PromptForm />
        <PoetryCanvas />
      </div>
    </main>
  )
}
