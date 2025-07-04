import { deleteDB } from 'idb'
import { DB_NAME } from '../database'
import {
  createKnowledge,
  getKnowledge,
  getAllKnowledge,
  updateKnowledge,
  deleteKnowledge,
  searchKnowledge,
} from '../knowledgeService'
import type { CreateKnowledgeItem, KnowledgeItem } from '@/types'

describe('KnowledgeService', () => {
  beforeEach(async () => {
    await deleteDB(DB_NAME)
  })

  afterEach(async () => {
    await deleteDB(DB_NAME)
  })

  const createMockKnowledgeItem = (): CreateKnowledgeItem => ({
    humanReadable: {
      title: 'Test Knowledge',
      description: 'Test description',
      personalNotes: 'Personal notes',
      tags: ['test', 'example'],
      usageScenarios: ['testing'],
      examples: [
        {
          id: '1',
          code: 'console.log("test")',
          description: 'Example code',
        },
      ],
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

    it('should generate unique IDs for multiple items', async () => {
      const item1 = await createKnowledge(createMockKnowledgeItem())
      const item2 = await createKnowledge(createMockKnowledgeItem())

      expect(item1.id).not.toBe(item2.id)
    })
  })

  describe('getKnowledge', () => {
    it('should retrieve a knowledge item by ID', async () => {
      const created = await createKnowledge(createMockKnowledgeItem())
      const retrieved = await getKnowledge(created.id)

      expect(retrieved).toEqual(created)
    })

    it('should return null for non-existent ID', async () => {
      const retrieved = await getKnowledge('non-existent-id')
      expect(retrieved).toBeNull()
    })
  })

  describe('getAllKnowledge', () => {
    it('should retrieve all knowledge items', async () => {
      const item1 = await createKnowledge(createMockKnowledgeItem())
      const item2 = await createKnowledge(createMockKnowledgeItem())
      const item3 = await createKnowledge(createMockKnowledgeItem())

      const allItems = await getAllKnowledge()

      expect(allItems).toHaveLength(3)
      expect(allItems.map((item) => item.id)).toContain(item1.id)
      expect(allItems.map((item) => item.id)).toContain(item2.id)
      expect(allItems.map((item) => item.id)).toContain(item3.id)
    })

    it('should return empty array when no items exist', async () => {
      const allItems = await getAllKnowledge()
      expect(allItems).toEqual([])
    })
  })

  describe('updateKnowledge', () => {
    it('should update an existing knowledge item', async () => {
      const created = await createKnowledge(createMockKnowledgeItem())
      const updateData = {
        humanReadable: {
          ...created.humanReadable,
          title: 'Updated Title',
        },
      }

      const updated = await updateKnowledge(created.id, updateData)

      expect(updated).not.toBeNull()
      expect(updated!.humanReadable.title).toBe('Updated Title')
      expect(updated!.metadata.updatedAt.getTime()).toBeGreaterThan(
        created.metadata.updatedAt.getTime(),
      )
      expect(updated!.metadata.version).toBe(2)
    })

    it('should return null when updating non-existent item', async () => {
      const updated = await updateKnowledge('non-existent-id', {
        humanReadable: { title: 'New Title' } as any,
      })

      expect(updated).toBeNull()
    })

    it('should increment usage count', async () => {
      const created = await createKnowledge(createMockKnowledgeItem())
      const updated = await updateKnowledge(created.id, {
        usage: {
          count: created.usage.count + 1,
          lastUsed: new Date(),
        },
      })

      expect(updated!.usage.count).toBe(1)
      expect(updated!.usage.lastUsed).toBeInstanceOf(Date)
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

    it('should return false when deleting non-existent item', async () => {
      const deleted = await deleteKnowledge('non-existent-id')
      expect(deleted).toBe(false)
    })
  })

  describe('searchKnowledge', () => {
    beforeEach(async () => {
      // テスト用のデータを作成
      await createKnowledge({
        ...createMockKnowledgeItem(),
        humanReadable: {
          ...createMockKnowledgeItem().humanReadable,
          title: 'React Hooks',
          tags: ['react', 'hooks', 'frontend'],
        },
      })

      await createKnowledge({
        ...createMockKnowledgeItem(),
        humanReadable: {
          ...createMockKnowledgeItem().humanReadable,
          title: 'Vue Composition API',
          tags: ['vue', 'composition', 'frontend'],
        },
      })

      await createKnowledge({
        ...createMockKnowledgeItem(),
        humanReadable: {
          ...createMockKnowledgeItem().humanReadable,
          title: 'Angular Services',
          tags: ['angular', 'services', 'frontend'],
        },
      })
    })

    it('should search by title', async () => {
      const results = await searchKnowledge({ query: 'React' })
      expect(results).toHaveLength(1)
      expect(results[0].item.humanReadable.title).toBe('React Hooks')
    })

    it('should search by tags', async () => {
      const results = await searchKnowledge({ query: 'frontend' })
      expect(results).toHaveLength(3)
    })

    it('should return empty array for no matches', async () => {
      const results = await searchKnowledge({ query: 'backend' })
      expect(results).toEqual([])
    })

    it('should limit results', async () => {
      const results = await searchKnowledge({
        query: 'frontend',
        limit: 2,
      })
      expect(results).toHaveLength(2)
    })
  })
})