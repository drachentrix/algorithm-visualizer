package com.draconias.websockets

import kotlinx.serialization.Serializable

@Serializable
data class WebSocketRequest(
    val id: String,
    val algorithmType: String,
    val items: MutableList<Int>
)