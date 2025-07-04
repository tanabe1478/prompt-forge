import { openDB, IDBPDatabase } from 'idb'
import type { KnowledgeItem } from '@/types'

export const DB_NAME = 'PromptForgeDB'
export const DB_VERSION = 1

interface PromptForgeDB {
  knowledge: {
    key: string
    value: KnowledgeItem
    indexes: {
      title: string
      tags: string[]
      category: string
      lastUsed: Date
      createdAt: Date
    }
  }
}

let dbInstance: IDBPDatabase<PromptForgeDB> | null = null

export async function initializeDatabase(): Promise<
  IDBPDatabase<PromptForgeDB>
> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<PromptForgeDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // knowledge オブジェクトストアの作成
      if (!db.objectStoreNames.contains('knowledge')) {
        const knowledgeStore = db.createObjectStore('knowledge', {
          keyPath: 'id',
        })

        // インデックスの作成
        knowledgeStore.createIndex('title', 'humanReadable.title')
        knowledgeStore.createIndex('tags', 'humanReadable.tags', {
          multiEntry: true,
        })
        knowledgeStore.createIndex('category', 'aiReadable.category')
        knowledgeStore.createIndex('lastUsed', 'usage.lastUsed')
        knowledgeStore.createIndex('createdAt', 'metadata.createdAt')
      }
    },
  })

  return dbInstance
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}