package com.draconias.algorithm.pathfinding_algorithm.logic

import com.draconias.algorithm.pathfinding_algorithm.Pathfinder
import com.draconias.websockets.GridCell
import com.draconias.websockets.WebSocketManager
import kotlinx.coroutines.delay
import java.util.LinkedList
import java.util.Queue

class Bfs : Pathfinder {

    override suspend fun findPath(gridCell: List<List<GridCell>>, startNode: GridCell, diagonalAllowed: Boolean) {
        val directions = if (diagonalAllowed) {
            listOf(Pair(-1, 0), Pair(1, 0), Pair(0, -1), Pair(0, 1), Pair(-1, -1), Pair(-1, 1), Pair(1, -1), Pair(1, 1))
        } else {
            listOf(Pair(-1, 0), Pair(1, 0), Pair(0, -1), Pair(0, 1))
        }
        val visited: MutableList<GridCell> = mutableListOf()
        val queue: Queue<GridCell> = LinkedList()

        queue.add(startNode)
        visited.add(startNode)

        while (queue.isNotEmpty()) {
            val cell = queue.poll()
            WebSocketManager.sendMessageToSession("${cell.row}:${cell.col}")


            if (cell.isEnd) {
                return
            }
            for (direction in directions) {
                val newX = cell.row + direction.first
                val newY = cell.col + direction.second
                if (newX < 0 || newX >= gridCell.size || newY < 0 || newY >= gridCell[newX].size) {
                    continue
                }
                val newCell = gridCell[newX][newY]
                if (!newCell.isObstacle && !visited.contains(newCell)) {
                    queue.add(newCell)
                    visited.add(newCell)
                }
            }
        }
    }
}