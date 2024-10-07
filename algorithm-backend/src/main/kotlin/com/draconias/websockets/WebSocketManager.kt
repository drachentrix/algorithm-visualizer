package com.draconias.websockets

import io.ktor.websocket.*

object WebSocketManager {

    fun addSession(session: WebSocketSession) {
        WebSocketSessionContext.sessionId = session
    }

    suspend fun sendMessageToSession(message: String) {
        val indexOfSemicolon = message.indexOf(";")
        var modifiedMessage = message;
        if (indexOfSemicolon != -1){
            modifiedMessage = message.substring(0, message.indexOf(";"))
        }
        WebSocketSessionContext.sessionId.send(Frame.Text(modifiedMessage))
        if (message.contains(";FINISHED", ignoreCase = true)) {
            WebSocketSessionContext.sessionId.close()
            removeSession()

        }
    }

    private fun removeSession() {
        WebSocketSessionContext.clear()
    }
}