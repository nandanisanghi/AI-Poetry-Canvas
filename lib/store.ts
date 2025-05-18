import { create } from "zustand"

interface PoemLine {
  line: string
  image: string
  position?: { x: number; y: number }
}

interface PoetryState {
  poem: PoemLine[]
  isGenerating: boolean
  setPoem: (poem: PoemLine[]) => void
  setIsGenerating: (isGenerating: boolean) => void
  rearrangeLine: (index: number, position: { x: number; y: number }) => void
}

export const usePoetryStore = create<PoetryState>((set) => ({
  poem: [],
  isGenerating: false,
  setPoem: (poem) => set({ poem }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  rearrangeLine: (index, position) =>
    set((state) => {
      const newPoem = [...state.poem]
      if (newPoem[index]) {
        newPoem[index] = { ...newPoem[index], position }
      }
      return { poem: newPoem }
    }),
}))
