export interface Example {
  id: string
  code: string
  description: string
  result?: string
}

export interface UsageContext {
  id: string
  date: Date
  prompt: string
  response: string
  satisfaction: number
  notes?: string
}

export interface EffectivenessMetrics {
  averageSatisfaction: number
  totalUses: number
  successfulUses: number
  failedUses: number
}

export interface KnowledgeItem {
  id: string
  metadata: {
    createdAt: Date
    updatedAt: Date
    version: number
  }

  // 人間向けデータ
  humanReadable: {
    title: string
    description: string
    personalNotes: string
    tags: string[]
    usageScenarios: string[]
    examples: Example[]
  }

  // AI向けデータ
  aiReadable: {
    technique: string
    category: string
    template: string
    parameters: Record<string, unknown>
    constraints: string[]
    effectiveness: EffectivenessMetrics
  }

  // 使用統計
  usage: {
    count: number
    lastUsed: Date
    successRate: number
    contexts: UsageContext[]
  }

  // 関連情報
  relations: {
    relatedTechniques: string[]
    prerequisites: string[]
    alternatives: string[]
  }
}

export type CreateKnowledgeItem = Omit<
  KnowledgeItem,
  'id' | 'metadata' | 'usage'
> & {
  usage?: Partial<KnowledgeItem['usage']>
}

export type UpdateKnowledgeItem = Partial<
  Omit<KnowledgeItem, 'id' | 'metadata'>
>

export interface SearchOptions {
  query: string
  fields?: string[]
  limit?: number
  offset?: number
}

export interface SearchResult {
  item: KnowledgeItem
  score: number
  matches: {
    field: string
    text: string
  }[]
}

export interface Tag {
  name: string
  count: number
}

export interface Category {
  name: string
  description: string
  count: number
}

export interface DateRange {
  start: Date
  end: Date
}

export interface Range {
  min: number
  max: number
}