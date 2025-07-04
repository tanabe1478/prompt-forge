import { initializeDatabase } from './database'
import type {
  KnowledgeItem,
  CreateKnowledgeItem,
  UpdateKnowledgeItem,
  SearchOptions,
  SearchResult,
} from '@/types'

/**
 * ユニークなIDを生成
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 新しい知識アイテムを作成
 */
export async function createKnowledge(
  item: CreateKnowledgeItem,
): Promise<KnowledgeItem> {
  // バリデーション
  if (!item.humanReadable?.title?.trim()) {
    throw new Error('Title is required')
  }

  const db = await initializeDatabase()
  
  const now = new Date()
  const newItem: KnowledgeItem = {
    id: generateId(),
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: 1,
    },
    humanReadable: item.humanReadable,
    aiReadable: item.aiReadable,
    usage: {
      count: 0,
      lastUsed: now,
      successRate: 0,
      contexts: [],
      ...item.usage,
    },
    relations: item.relations,
  }

  try {
    await db.add('knowledge', newItem)
    return newItem
  } catch (error) {
    throw new Error(`Failed to create knowledge: ${error}`)
  }
}

/**
 * IDで知識アイテムを取得
 */
export async function getKnowledge(id: string): Promise<KnowledgeItem | null> {
  if (!id) {
    return null
  }

  try {
    const db = await initializeDatabase()
    const item = await db.get('knowledge', id)
    return item || null
  } catch (error) {
    console.error(`Failed to get knowledge: ${error}`)
    return null
  }
}

/**
 * すべての知識アイテムを取得
 */
export async function getAllKnowledge(): Promise<KnowledgeItem[]> {
  try {
    const db = await initializeDatabase()
    return await db.getAll('knowledge')
  } catch (error) {
    console.error(`Failed to get all knowledge: ${error}`)
    return []
  }
}

/**
 * 知識アイテムを更新
 */
export async function updateKnowledge(
  id: string,
  updates: UpdateKnowledgeItem,
): Promise<KnowledgeItem | null> {
  if (!id) {
    return null
  }

  try {
    const db = await initializeDatabase()
    const existing = await db.get('knowledge', id)

    if (!existing) {
      return null
    }

    const updatedItem: KnowledgeItem = {
      ...existing,
      ...updates,
      id: existing.id, // IDは変更しない
      metadata: {
        ...existing.metadata,
        updatedAt: new Date(),
        version: existing.metadata.version + 1,
      },
      humanReadable: {
        ...existing.humanReadable,
        ...updates.humanReadable,
      },
      aiReadable: {
        ...existing.aiReadable,
        ...updates.aiReadable,
      },
      usage: {
        ...existing.usage,
        ...updates.usage,
      },
      relations: {
        ...existing.relations,
        ...updates.relations,
      },
    }

    await db.put('knowledge', updatedItem)
    return updatedItem
  } catch (error) {
    console.error(`Failed to update knowledge: ${error}`)
    throw error
  }
}

/**
 * 知識アイテムを削除
 */
export async function deleteKnowledge(id: string): Promise<boolean> {
  if (!id) {
    return false
  }

  try {
    const db = await initializeDatabase()
    const existing = await db.get('knowledge', id)

    if (!existing) {
      return false
    }

    await db.delete('knowledge', id)
    return true
  } catch (error) {
    console.error(`Failed to delete knowledge: ${error}`)
    return false
  }
}

/**
 * 知識アイテムを検索（簡易版）
 */
export async function searchKnowledge(
  options: SearchOptions,
): Promise<SearchResult[]> {
  try {
    const db = await initializeDatabase()
    const { query, limit = 10 } = options

    if (!query) {
      return []
    }

    // 簡易的な検索実装（後でasearchライブラリを使った実装に置き換え）
    const allItems = await db.getAll('knowledge')
    
    const results: SearchResult[] = allItems
      .filter((item) => {
        const searchText = query.toLowerCase()
        
        // タイトルで検索
        if (item.humanReadable.title.toLowerCase().includes(searchText)) {
          return true
        }
        
        // タグで検索
        if (
          item.humanReadable.tags.some((tag) =>
            tag.toLowerCase().includes(searchText),
          )
        ) {
          return true
        }
        
        // 説明で検索
        if (item.humanReadable.description.toLowerCase().includes(searchText)) {
          return true
        }
        
        return false
      })
      .slice(0, limit)
      .map((item) => ({
        item,
        score: 1, // 簡易版なのでスコアは固定
        matches: [],
      }))

    return results
  } catch (error) {
    console.error(`Failed to search knowledge: ${error}`)
    return []
  }
}