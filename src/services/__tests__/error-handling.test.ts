import { deleteDB } from 'idb'
import { DB_NAME, closeDatabase } from '../database'
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
  }, 15000)

  afterEach(async () => {
    await closeDatabase()
    await deleteDB(DB_NAME)
  }, 15000)

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
      expect(retrieved).not.toBeNull()
      expect(retrieved!.id).toBe(item1.id)
      expect(retrieved!.humanReadable.title).toBe(item1.humanReadable.title)
      expect(retrieved!.humanReadable.description).toBe(item1.humanReadable.description)
    })
  })
})