package com.draconias.websockets

import io.ktor.websocket.*

object WebSocketSessionContext {
    private val sessionIdHolder = ThreadLocal<WebSocketSession>()

    var sessionId: WebSocketSession?
        get() = sessionIdHolder.get()
        set(sessionId) {
            sessionIdHolder.set(sessionId)
        }

    suspend fun clear() {
        sessionId?.close()
        sessionIdHolder.remove()
    }
}
