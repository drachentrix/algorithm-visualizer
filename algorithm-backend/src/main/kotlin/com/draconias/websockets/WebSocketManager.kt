package com.draconias.websockets

import com.draconias.logger.LoggerInstance
import io.ktor.websocket.*

object WebSocketManager {
    fun addSession(session: WebSocketSession) {
        WebSocketSessionContext.sessionId = session
    }

    suspend fun sendMessageToSession(message: String) {
        LoggerInstance.getLogger().info("Send Message to client: $message")
        WebSocketSessionContext.sessionId?.send(Frame.Text(message))
    }

     suspend fun removeSession() {
        LoggerInstance.getLogger().info("Send all Messages to client! Connection gets closed")
         WebSocketSessionContext.clear()
    }
}