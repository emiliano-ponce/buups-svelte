import { scrypt } from '@noble/hashes/scrypt.js'

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const hash = scrypt(password, salt, {
        N: 2 ** 16, // CPU/memory cost (65536)
        r: 8, // Block size
        p: 1, // Parallelization
        dkLen: 32, // Output length
    })

    // Return as "salt:hash" in hex format
    const saltHex = Array.from(salt)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    const hashHex = Array.from(hash)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    return `${saltHex}:${hashHex}`
}

export async function verifyPasswordHash(storedHash: string, password: string): Promise<boolean> {
    try {
        const [saltHex, hashHex] = storedHash.split(':')

        // Convert hex salt back to Uint8Array
        const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))

        // Hash the password with the same salt
        const hash = scrypt(password, salt, {
            N: 2 ** 16,
            r: 8,
            p: 1,
            dkLen: 32,
        })

        // Convert computed hash to hex and compare
        const computedHashHex = Array.from(hash)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')

        return computedHashHex === hashHex
    } catch (error) {
        console.error('Password verification error:', error)
        return false
    }
}
