import { openDB, deleteDB } from 'idb'
import { initializeDatabase, DB_NAME, DB_VERSION } from '../database'

describe('Database Initialization', () => {
  beforeEach(async () => {
    // テスト前にデータベースを削除
    await deleteDB(DB_NAME)
  })

  afterEach(async () => {
    // テスト後にデータベースを削除
    await deleteDB(DB_NAME)
  })

  it('should create database with correct version', async () => {
    const db = await initializeDatabase()
    expect(db.version).toBe(DB_VERSION)
    expect(db.name).toBe(DB_NAME)
    db.close()
  })

  it('should create knowledge object store', async () => {
    const db = await initializeDatabase()
    expect(db.objectStoreNames.contains('knowledge')).toBe(true)
    db.close()
  })

  it('should create indexes on knowledge store', async () => {
    const db = await initializeDatabase()
    const transaction = db.transaction('knowledge', 'readonly')
    const store = transaction.objectStore('knowledge')
    
    // インデックスの存在確認
    expect(store.indexNames.contains('title')).toBe(true)
    expect(store.indexNames.contains('tags')).toBe(true)
    expect(store.indexNames.contains('category')).toBe(true)
    expect(store.indexNames.contains('lastUsed')).toBe(true)
    expect(store.indexNames.contains('createdAt')).toBe(true)
    
    await transaction.done
    db.close()
  })

  it('should handle database upgrade', async () => {
    // 最初のバージョンでデータベースを作成
    let db = await initializeDatabase()
    db.close()

    // 同じバージョンで再度開く（アップグレードなし）
    db = await initializeDatabase()
    expect(db.version).toBe(DB_VERSION)
    db.close()
  })

  it('should reuse existing connection', async () => {
    const db1 = await initializeDatabase()
    const db2 = await initializeDatabase()
    
    // 同じインスタンスが返されることを確認
    expect(db1).toBe(db2)
    
    db1.close()
  })
})