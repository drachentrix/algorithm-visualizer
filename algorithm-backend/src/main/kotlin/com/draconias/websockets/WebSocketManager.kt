package com.draconias.websockets

import com.draconias.logger.LoggerInstance
import io.ktor.websocket.*
import kotlinx.coroutines.sync.Mutex
import java.util.concurrent.atomic.AtomicInteger

object WebSocketManager {
    val messageCount = AtomicInteger(0)
    val ackCount = AtomicInteger(0)
    val mutex = Mutex()

    fun addSession(session: WebSocketSession) {
        WebSocketSessionContext.sessionId = session
    }

    suspend fun sendMessageToSession(message: String) {
        LoggerInstance.getLogger().info("Send Message to client: $message")
        WebSocketSessionContext.sessionId?.send(Frame.Text(message))
        messageCount.incrementAndGet()
    }

     suspend fun removeSession() {
        LoggerInstance.getLogger().info("Send all Messages to client! Connection gets closed")
         WebSocketSessionContext.clear()
    }
}