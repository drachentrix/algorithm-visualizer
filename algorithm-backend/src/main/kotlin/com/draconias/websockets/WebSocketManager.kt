package com.draconias.websockets

import io.ktor.websocket.*

object WebSocketManager {

    fun addSession(session: WebSocketSession) {
        WebSocketSessionContext.sessionId = session
    }

    suspend fun sendMessageToSession(message: String) {
        WebSocketSessionContext.sessionId.send(Frame.Text(message))
        if (message.contains(";FINISHED", ignoreCase = true)) {
            removeSession()
        }
    }

    private fun removeSession() {
        WebSocketSessionContext.clear()
    }
}