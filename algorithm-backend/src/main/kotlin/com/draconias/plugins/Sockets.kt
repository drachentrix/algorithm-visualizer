package com.draconias.plugins

import com.draconias.algorithm.AlgorithmSelector
import com.draconias.logger.LoggerInstance
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

fun Application.configureSockets() {
    install(WebSockets) {
        timeout = Duration.ofSeconds(5)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    install(CORS) {
        allowHost("localhost:5173", listOf("http", "https"), listOf())
        allowMethod(HttpMethod.Get)
        allowHeader("Authorization")
        allowHeader("Content-Type")
    }
    routing {
        webSocket("/algorithm") {
            for (frame in incoming) {
                when (frame) {
                    is Text -> {
                        val receivedText = frame.readText()
                        LoggerInstance.getLogger().info("Received Package: $receivedText")
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

fun parseWebSocketRequest(jsonString: String): WsRequest {
    val modifiedJson = jsonString.substring(1, jsonString.length - 1).replace("\\", "")
    val jsonElement = Json.parseToJsonElement(modifiedJson)
    val jsonObject = jsonElement.jsonObject
    val type = jsonObject["type"]?.jsonPrimitive?.content ?: throw IllegalArgumentException("Invalid request: 'type' field missing")

    return when (type) {
        "sorting" -> Json.decodeFromString<SortingRequest>(modifiedJson)
        "pathfinding" -> Json.decodeFromString<PathfindingRequest>(modifiedJson)
        else -> throw IllegalArgumentException("Unknown request type: $type")
    }
}