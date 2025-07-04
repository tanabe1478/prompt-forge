import React from 'react'
import { TestDatabase } from './components/TestDatabase'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">PromptForge</h1>
        <p className="mt-2 text-gray-600">知識ベース管理アプリケーション</p>
        
        <div className="mt-8">
          <TestDatabase />
        </div>
      </div>
    </div>
  )
}

export default App