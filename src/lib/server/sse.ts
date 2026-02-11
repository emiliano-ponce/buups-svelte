import type { ReviewEventType, SSEMessage } from "$lib/stores/sse"

type SSEClient = ReadableStreamDefaultController

const clients = new Set<SSEClient>()

export function addSSEClient(controller: SSEClient) {
    clients.add(controller)
    console.log(`SSE client added. Total clients: ${clients.size}`)
}

export function removeSSEClient(controller: SSEClient) {
    clients.delete(controller)
    console.log(`SSE client removed. Total clients: ${clients.size}`)
}

interface ReviewEventData extends SSEMessage {
    type: ReviewEventType
    userId?: string
}

export function broadcastReviewUpdate(data: ReviewEventData) {
    const message = `data: ${JSON.stringify(data)}\n\n`
    console.log('Broadcasting review update:', data)
    const encoded = new TextEncoder().encode(message)

    let successCount = 0
    let failCount = 0

    clients.forEach(controller => {
        try {
            controller.enqueue(encoded)
            successCount++
        } catch (error) {
            console.error('Failed to send SSE message:', error)
            clients.delete(controller)
            failCount++
        }
    })

    console.log(`Broadcast sent to ${successCount} clients, ${failCount} failed`)
}

export function sendToClient(controller: SSEClient, data: any) {
    try {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
        console.error('Failed to send to client:', error)
        clients.delete(controller)
    }
}

export function getClientCount() {
    return clients.size
}
