import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'

// IndexedDBのグローバル設定
import { IDBFactory } from 'fake-indexeddb'
global.indexedDB = new IDBFactory()

// structuredCloneのポリフィル（Node.js 16以下で必要）
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj))
}