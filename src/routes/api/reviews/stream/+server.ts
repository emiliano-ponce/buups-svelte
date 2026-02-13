import { addSSEClient, removeSSEClient } from '$lib/server/sse'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ request }) => {
    const stream = new ReadableStream({
        start(controller) {
            addSSEClient(controller)

            const data = `data: ${JSON.stringify({
                type: 'connected',
                timestamp: new Date().toISOString(),
            })}\n\n`
            controller.enqueue(new TextEncoder().encode(data))

            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'))
                } catch {
                    clearInterval(heartbeat)
                }
            }, 30000) // Every 30 seconds

            request.signal.addEventListener('abort', () => {
                clearInterval(heartbeat)
                removeSSEClient(controller)
                try {
                    controller.close()
                } catch {
                    // Controller already closed
                }
            })
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}
