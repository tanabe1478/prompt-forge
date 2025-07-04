import React, { useState } from 'react'
import { createKnowledge, getAllKnowledge } from '@/services/knowledgeService'
import type { KnowledgeItem } from '@/types'

export const TestDatabase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [message, setMessage] = useState('')

  const handleCreateTest = async () => {
    try {
      const testItem = await createKnowledge({
        humanReadable: {
          title: 'テスト知識',
          description: 'これはテスト用の知識です',
          personalNotes: '動作確認用',
          tags: ['test', 'sample'],
          usageScenarios: ['testing'],
          examples: [],
        },
        aiReadable: {
          technique: 'Test Technique',
          category: 'Testing',
          template: 'Test template',
          parameters: {},
          constraints: [],
          effectiveness: {
            averageSatisfaction: 0,
            totalUses: 0,
            successfulUses: 0,
            failedUses: 0,
          },
        },
        relations: {
          relatedTechniques: [],
          prerequisites: [],
          alternatives: [],
        },
      })
      setMessage(`作成成功: ${testItem.id}`)
      await handleLoadAll()
    } catch (error) {
      setMessage(`エラー: ${error}`)
    }
  }

  const handleLoadAll = async () => {
    try {
      const allItems = await getAllKnowledge()
      setItems(allItems)
      setMessage(`${allItems.length}件の知識を読み込みました`)
    } catch (error) {
      setMessage(`エラー: ${error}`)
    }
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">IndexedDB動作確認</h3>
      <div className="space-x-2 mb-4">
        <button
          onClick={handleCreateTest}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          テストデータ作成
        </button>
        <button
          onClick={handleLoadAll}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          全データ読み込み
        </button>
      </div>
      {message && (
        <div className="mb-4 p-2 bg-gray-100 rounded">{message}</div>
      )}
      <div>
        <h4 className="font-semibold">保存された知識:</h4>
        <ul className="list-disc list-inside">
          {items.map((item) => (
            <li key={item.id}>
              {item.humanReadable.title} (ID: {item.id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}