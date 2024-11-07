package com.draconias.websockets

import com.draconias.logger.LoggerInstance
import io.ktor.websocket.*
import kotlinx.coroutines.sync.Mutex
import java.util.concurrent.atomic.AtomicInteger

object WebSocketManager {
    val messageCount = AtomicInteger(0)
    val ackCount = AtomicInteger(0)
    val mutex = Mutex()
    private val messageBuffer: MutableList<String> = mutableListOf()

    fun addSession(session: WebSocketSession) {
        WebSocketSessionContext.sessionId = session
    }

    fun addToBuffer(message: String){
        messageBuffer.add(message)
    }

    suspend fun sendMessageToSession() {
        if (messageBuffer.size == 0){
            return
        }
        val message = messageBuffer[0]
        messageBuffer.removeAt(0)
        LoggerInstance.getLogger().info("Send Message to client: $message")
        WebSocketSessionContext.sessionId?.send(Frame.Text(message))
        messageCount.incrementAndGet()
    }

     suspend fun removeSession() {
        LoggerInstance.getLogger().info("Send all Messages to client! Connection gets closed")
         WebSocketSessionContext.clear()
    }
}