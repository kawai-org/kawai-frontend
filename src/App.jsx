import { useState } from 'react'
import { Button } from '@/components/ui/button'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-2xl mx-auto p-8 space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Kawai Frontend
          </h1>
          <p className="text-muted-foreground">
            Vite + React + Tailwind CSS v3 + shadcn/ui
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => setCount((count) => count + 1)}>
              Count is {count}
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ✅ Shadcn/ui is working correctly!
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Edit <code className="bg-muted px-2 py-1 rounded">src/App.jsx</code> and save to test HMR</p>
        </div>
      </div>
    </div>
  )
}

export default App
