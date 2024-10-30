package com.draconias.algorithm.pathfinding_algorithm

import com.draconias.websockets.GridCell

interface Pathfinder {
    suspend fun findPath(gridCell: List<List<GridCell>>, startNode: GridCell)
}