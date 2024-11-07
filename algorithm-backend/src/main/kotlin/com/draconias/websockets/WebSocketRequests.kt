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
    override val type: String,
): WsRequest

@Serializable
data class PathfindingRequest(
    val graph: List<List<GridCell>>,
    val startNode: GridCell,
    override val algorithmId: Int,
    override val type: String,
    val diagonalAllowed: Boolean
): WsRequest

@Serializable
data class GridCell(
    val row: Int,
    val col: Int,
    val isStart: Boolean,
    val isObstacle: Boolean,
    val isEnd: Boolean,
    val isPath: Boolean,
    val isVisited: Boolean
)