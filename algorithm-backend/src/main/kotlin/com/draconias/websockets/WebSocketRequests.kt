package com.draconias.websockets

import kotlinx.serialization.Serializable

interface WsRequest {
    val algorithmId: Int
    val type: String
}

@Serializable
data class SortingRequest(
    val items: MutableList<Int>,
    override val algorithmId: Int,
    override val type: String
): WsRequest

@Serializable
data class PathfindingRequest(
    val graph: Graph,
    val startNode: Node,
    val endNode: Node,
    override val algorithmId: Int,
    override val type: String
): WsRequest

@Serializable
data class Graph(val nodes: List<Node>, val connections: List<Connection>)

@Serializable
data class Node(
    val id: Int,
    val distanceToStart: Int = 0
)

@Serializable
data class Connection(val from: Node, val to: Node, val weight: Int)