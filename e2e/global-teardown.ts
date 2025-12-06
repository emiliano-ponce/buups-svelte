// e2e/global-teardown.ts
import { existsSync, unlinkSync } from 'fs'

async function globalTeardown() {
    const dbPath = './test.db'
    
    if (existsSync(dbPath)) {
        unlinkSync(dbPath)
        console.log('✅ Test database cleaned up')
    }
}

export default globalTeardown