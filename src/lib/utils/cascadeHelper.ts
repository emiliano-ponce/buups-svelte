function randInt(min: number, max: number, pad?: number): string {
    const n = Math.floor(Math.random() * (max - min + 1)) + min
    return pad ? String(n).padStart(pad, '0') : String(n)
}

function themedRand(): string {
    const roll = Math.random()
    if (roll < 0.2) {
        // 20 % chance: a short 2‑digit code, padded to 2
        return randInt(0, 99, 2)
    } else if (roll < 0.7) {
        // 50 % chance: a medium 4‑digit code
        return randInt(0, 9999, 4)
    } else {
        // 30 % chance: a larger 6‑digit number
        return randInt(0, 999999, 6)
    }
}


type Cell = string;
type Column = Cell[];
export type CascadeData = Column[];

export function makeCascade(
    colCount = 24,
    rowsPerCol = 9
    
): CascadeData {
    const data: CascadeData = []

    for (let c = 0; c < colCount; ++c) {
        const column: Column = []
        for (let r = 0; r < rowsPerCol; ++r) {
            column.push(themedRand())
        }
        data.push(column)
    }

    return data
}
