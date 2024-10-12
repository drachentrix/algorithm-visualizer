package com.draconias.plugins

import com.draconias.algorithm.AlgorithmSelector
import com.draconias.websockets.WebSocketManager
import com.draconias.websockets.WebSocketRequest
import io.ktor.http.HttpMethod
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import io.ktor.websocket.Frame.*
import kotlinx.serialization.json.Json
import java.time.Duration

fun Application.configureSockets() {
    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(15)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    install(CORS){
        allowHost("localhost:5173", listOf("http", "https"), listOf())
        allowMethod(HttpMethod.Get)
        allowHeader("Authorization")
        allowHeader("Content-Type")
    }
    routing {
        webSocket("/algorithm/sorting") {
            for (frame in incoming) {
                when (frame) {
                    is Text -> {
                        val receivedText = frame.readText()
                        println("Received: $receivedText")

                        WebSocketManager.addSession(this)
                        val request = parseWebSocketRequest(receivedText)
                        AlgorithmSelector().selectAlgorithm(request)
                    }
                    else -> {}
                }
            }
        }
    }
}
fun parseWebSocketRequest(jsonString: String): WebSocketRequest {
    val modifiedJson = jsonString.substring(1, jsonString.length - 1).replace("\\", "")
    return Json.decodeFromString<WebSocketRequest>(modifiedJson)
}