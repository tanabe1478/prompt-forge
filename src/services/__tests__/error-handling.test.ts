import { deleteDB } from 'idb'
import { DB_NAME, initializeDatabase, closeDatabase } from '../database'
import {
  createKnowledge,
  getKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from '../knowledgeService'
import type { CreateKnowledgeItem } from '@/types'

describe('Error Handling', () => {
  beforeEach(async () => {
    await deleteDB(DB_NAME)
  })

  afterEach(async () => {
    await closeDatabase()
    await deleteDB(DB_NAME)
  })

  const createMockKnowledgeItem = (): CreateKnowledgeItem => ({
    humanReadable: {
      title: 'Test Knowledge',
      description: 'Test description',
      personalNotes: 'Personal notes',
      tags: ['test'],
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

  describe('Database Connection Errors', () => {
    it('should handle database initialization errors gracefully', async () => {
      // IndexedDBをモックして強制的にエラーを発生させる
      const originalOpen = indexedDB.open
      indexedDB.open = jest.fn().mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      try {
        await expect(initializeDatabase()).rejects.toThrow(
          'Database connection failed',
        )
      } finally {
        // モックを元に戻す
        indexedDB.open = originalOpen
      }
    })
  })

  describe('Invalid Data Handling', () => {
    it('should validate required fields when creating knowledge', async () => {
      const invalidItem = {
        humanReadable: {
          title: '', // 空のタイトル
          description: 'Test',
          personalNotes: '',
          tags: [],
          usageScenarios: [],
          examples: [],
        },
      } as CreateKnowledgeItem

      await expect(createKnowledge(invalidItem)).rejects.toThrow(
        'Title is required',
      )
    })

    it('should handle invalid ID formats', async () => {
      const result = await getKnowledge('')
      expect(result).toBeNull()
    })

    it('should handle partial updates safely', async () => {
      const item = await createKnowledge(createMockKnowledgeItem())
      
      // 部分的な更新でも既存のデータが保持されることを確認
      const updated = await updateKnowledge(item.id, {
        humanReadable: {
          title: 'Updated Title Only',
        } as any,
      })

      expect(updated).not.toBeNull()
      expect(updated!.humanReadable.title).toBe('Updated Title Only')
      expect(updated!.humanReadable.description).toBe('Test description')
    })
  })

  describe('Transaction Errors', () => {
    it('should rollback on transaction failure', async () => {
      const db = await initializeDatabase()
      const originalAdd = db.add.bind(db)
      
      // addメソッドをモックしてエラーを発生させる
      db.add = jest.fn().mockRejectedValue(new Error('Transaction failed'))

      const mockItem = createMockKnowledgeItem()
      
      await expect(createKnowledge(mockItem)).rejects.toThrow(
        'Transaction failed',
      )

      // エラー後もデータベースが正常に動作することを確認
      db.add = originalAdd
      const item = await createKnowledge(mockItem)
      expect(item).toBeDefined()
    })
  })

  describe('Concurrent Access', () => {
    it('should handle concurrent create operations', async () => {
      const mockItem = createMockKnowledgeItem()
      
      // 同時に複数の作成操作を実行
      const promises = Array(5)
        .fill(null)
        .map(() => createKnowledge(mockItem))

      const results = await Promise.all(promises)
      
      // すべて成功し、異なるIDが割り当てられることを確認
      const ids = results.map((item) => item.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(5)
    })

    it('should handle concurrent update operations', async () => {
      const item = await createKnowledge(createMockKnowledgeItem())
      
      // 同じアイテムに対して同時に更新を実行
      const updates = Array(3)
        .fill(null)
        .map((_, index) => 
          updateKnowledge(item.id, {
            humanReadable: {
              title: `Update ${index}`,
            } as any,
          })
        )

      const results = await Promise.all(updates)
      
      // すべての更新が成功することを確認
      expect(results.every((r) => r !== null)).toBe(true)
    })
  })

  describe('Data Integrity', () => {
    it('should not allow deletion of non-existent items', async () => {
      const result = await deleteKnowledge('non-existent-id')
      expect(result).toBe(false)
    })

    it('should maintain data consistency after errors', async () => {
      const item1 = await createKnowledge(createMockKnowledgeItem())
      
      // 存在しないアイテムの更新を試みる
      await updateKnowledge('non-existent', {
        humanReadable: { title: 'Should not exist' } as any,
      })
      
      // 元のアイテムが影響を受けていないことを確認
      const retrieved = await getKnowledge(item1.id)
      expect(retrieved).toEqual(item1)
    })
  })
})