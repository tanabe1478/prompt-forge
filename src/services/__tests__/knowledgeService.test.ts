import { deleteDB } from 'idb'
import { DB_NAME, closeDatabase } from '../database'
import {
  createKnowledge,
  getKnowledge,
  getAllKnowledge,
  updateKnowledge,
  deleteKnowledge,
  searchKnowledge,
} from '../knowledgeService'
import type { CreateKnowledgeItem } from '@/types'

describe('KnowledgeService', () => {
  beforeEach(async () => {
    // データベース接続を先にクローズしてからDBを削除
    await closeDatabase()
    try {
      await deleteDB(DB_NAME)
    } catch (error) {
      // deleteDBが失敗しても続行（fake-indexeddbでは時々失敗する）
      console.warn('Failed to delete database in beforeEach:', error)
    }
  }, 5000)

  afterEach(async () => {
    // データベース接続を先にクローズしてからDBを削除
    await closeDatabase()
    try {
      await deleteDB(DB_NAME)
    } catch (error) {
      // deleteDBが失敗しても続行（fake-indexeddbでは時々失敗する）
      console.warn('Failed to delete database in afterEach:', error)
    }
  }, 5000)

  const createMockKnowledgeItem = (): CreateKnowledgeItem => ({
    humanReadable: {
      title: 'Test Knowledge',
      description: 'Test description',
      personalNotes: 'Personal notes',
      tags: ['test', 'example'],
      usageScenarios: ['testing'],
      examples: [],
    },
    aiReadable: {
      technique: 'Test Technique',
      category: 'Testing',
      template: 'Test template',
      parameters: { key: 'value' },
      constraints: ['constraint1'],
      effectiveness: {
        averageSatisfaction: 4.5,
        totalUses: 10,
        successfulUses: 9,
        failedUses: 1,
      },
    },
    relations: {
      relatedTechniques: ['technique1'],
      prerequisites: ['prerequisite1'],
      alternatives: ['alternative1'],
    },
  })

  describe('createKnowledge', () => {
    it('should create a new knowledge item', async () => {
      const mockItem = createMockKnowledgeItem()
      const created = await createKnowledge(mockItem)

      expect(created.id).toBeDefined()
      expect(created.metadata.createdAt).toBeInstanceOf(Date)
      expect(created.metadata.updatedAt).toBeInstanceOf(Date)
      expect(created.metadata.version).toBe(1)
      expect(created.humanReadable.title).toBe(mockItem.humanReadable.title)
      expect(created.usage.count).toBe(0)
      expect(created.usage.contexts).toEqual([])
    })
  })

  describe('getKnowledge', () => {
    it('should retrieve a knowledge item by ID', async () => {
      const created = await createKnowledge(createMockKnowledgeItem())
      const retrieved = await getKnowledge(created.id)

      expect(retrieved).not.toBeNull()
      expect(retrieved!.id).toBe(created.id)
    })

    it('should return null for non-existent ID', async () => {
      const retrieved = await getKnowledge('non-existent-id')
      expect(retrieved).toBeNull()
    })
  })

  describe('updateKnowledge', () => {
    it('should update an existing knowledge item', async () => {
      const created = await createKnowledge(createMockKnowledgeItem())
      const updateData = {
        humanReadable: {
          title: 'Updated Title',
        } as any,
      }

      const updated = await updateKnowledge(created.id, updateData)

      expect(updated).not.toBeNull()
      expect(updated!.humanReadable.title).toBe('Updated Title')
    })
  })

  describe('deleteKnowledge', () => {
    it('should delete an existing knowledge item', async () => {
      const created = await createKnowledge(createMockKnowledgeItem())
      const deleted = await deleteKnowledge(created.id)

      expect(deleted).toBe(true)

      const retrieved = await getKnowledge(created.id)
      expect(retrieved).toBeNull()
    })
  })

  describe('searchKnowledge', () => {
    it('should return empty array for empty query', async () => {
      const results = await searchKnowledge({ query: '' })
      expect(results).toEqual([])
    })
  })
})