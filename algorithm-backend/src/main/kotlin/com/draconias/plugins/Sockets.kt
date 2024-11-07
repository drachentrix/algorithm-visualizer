package com.draconias.plugins

import com.draconias.algorithm.AlgorithmSelector
import com.draconias.websockets.*
import io.ktor.http.HttpMethod
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import io.ktor.websocket.Frame.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.time.Duration
import kotlinx.coroutines.channels.consumeEach
import kotlinx.coroutines.sync.withLock

fun Application.configureSockets() {
    install(WebSockets) {
        maxFrameSize = Long.MAX_VALUE
        masking = false
        pingPeriod = Duration.ofSeconds(10)
    }
    install(CORS) {
        allowHost("localhost:5173", listOf("http", "https"), listOf())
        allowMethod(HttpMethod.Get)
        allowHeader("Authorization")
        allowHeader("Content-Type")
    }
    routing {
        webSocket("/algorithm") {
            incoming.consumeEach { frame ->
                when (frame) {
                    is Text -> {
                        WebSocketManager.addSession(this)
                        val receivedText = frame.readText()
                        if (receivedText == "\"ACK\"") {
                            WebSocketManager.ackCount.incrementAndGet()
                            WebSocketManager.sendMessageToSession()
                        }
                        else {
                            val request = parseWebSocketRequest(receivedText)
                            AlgorithmSelector().selectAlgorithm(request)
                            WebSocketManager.sendMessageToSession()

                        }
                    }
                    else -> {}
                }
                WebSocketManager.mutex.withLock {
                    if (WebSocketManager.ackCount.get() >= WebSocketManager.messageCount.get()) {
                        WebSocketManager.removeSession()
                    }
                }
            }
        }
    }
}

fun parseWebSocketRequest(jsonString: String): WsRequest {
    val modifiedJson = jsonString.substring(1, jsonString.length - 1).replace("\\", "")
    val jsonElement = Json.parseToJsonElement(modifiedJson)
    val jsonObject = jsonElement.jsonObject
    val type = jsonObject["type"]?.jsonPrimitive?.content ?: throw IllegalArgumentException("Invalid request: 'type' field missing")

    return when (type) {
        "sorting" -> Json.decodeFromString<SortingRequest>(modifiedJson)
        "pathfinder" -> Json.decodeFromString<PathfindingRequest>(modifiedJson)
        else -> throw IllegalArgumentException("Unknown request type: $type")
    }
}
