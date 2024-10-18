package com.draconias.websockets

import com.draconias.algorithm.tree_traversal.Leave
import kotlinx.serialization.Serializable

@Serializable
data class WebSocketRequest(
    val id: String,
    val algorithmType: String,
    val items: MutableList<Int>?,
)