package com.draconias.websockets

import io.ktor.websocket.*
import org.slf4j.LoggerFactory

object WebSocketManager {
    private val logger = LoggerFactory.getLogger(WebSocketManager::class.java)

    fun addSession(session: WebSocketSession) {
        WebSocketSessionContext.sessionId = session
    }

    suspend fun sendMessageToSession(message: String) {
        if (message != "FINISHED") {
            logger.info("Send Message to client: $message")
            WebSocketSessionContext.sessionId.send(Frame.Text(message))
        } else {
            logger.info("Send all Messages to client! Connection gets closed")
            WebSocketSessionContext.sessionId.close()
            removeSession()
        }
    }

    private fun removeSession() {
        WebSocketSessionContext.clear()
    }
}