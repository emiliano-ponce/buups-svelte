import { browser } from '$app/environment'
import { writable } from 'svelte/store'

export type ReviewEventType = 'review_created' | 'review_updated' | 'review_deleted'

export type SSEMessage = {
    type: ReviewEventType | 'connected'
    reviewId?: number
    timestamp?: string
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

function createSSEStore() {
    const { subscribe, set } = writable<SSEMessage | null>(null)
    const status = writable<ConnectionStatus>('disconnected')
    const lastEventTime = writable<Date | null>(null)

    let eventSource: EventSource | null = null
    let reconnectAttempts = 0
    const MAX_RECONNECT_ATTEMPTS = 5

    function connect() {
        if (!browser) return

        disconnect()

        status.set('connecting')
        console.log('Connecting to SSE stream...')

        try {
            eventSource = new EventSource('/api/reviews/stream')

            eventSource.onopen = () => {
                console.log('SSE connected')
                status.set('connected')
                reconnectAttempts = 0
            }

            eventSource.onmessage = event => {
                try {
                    const data = JSON.parse(event.data) as SSEMessage
                    console.log('SSE message received:', data)

                    lastEventTime.set(new Date())
                    set(data)
                } catch (error) {
                    console.error('Failed to parse SSE message:', error)
                }
            }

            eventSource.onerror = error => {
                console.error('SSE error:', error)
                status.set('error')

                // EventSource automatically tries to reconnect
                // but we can track attempts
                reconnectAttempts++

                if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
                    console.error('Max reconnection attempts reached')
                    disconnect()
                }
            }
        } catch (error) {
            console.error('Failed to create EventSource:', error)
            status.set('error')
        }
    }

    function disconnect() {
        if (eventSource) {
            console.log('Disconnecting from SSE stream')
            eventSource.close()
            eventSource = null
            status.set('disconnected')
        }
    }

    return {
        subscribe,
        status: { subscribe: status.subscribe },
        lastEventTime: { subscribe: lastEventTime.subscribe },
        connect,
        disconnect,
        reconnect: () => {
            reconnectAttempts = 0
            connect()
        },
    }
}

export const sseStore = createSSEStore()
