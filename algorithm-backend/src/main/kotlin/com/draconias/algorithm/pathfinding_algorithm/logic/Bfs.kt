package com.draconias.algorithm.pathfinding_algorithm.logic

import com.draconias.algorithm.pathfinding_algorithm.Pathfinder
import com.draconias.websockets.GridCell
import com.draconias.websockets.WebSocketManager
import java.util.LinkedList
import java.util.Queue

class Bfs : Pathfinder {

    override suspend fun findPath(gridCell: List<List<GridCell>>, startNode: GridCell, diagonalAllowed: Boolean) {
        val directions = if (diagonalAllowed) {
            listOf(Pair(-1, 0), Pair(1, 0), Pair(0, -1), Pair(0, 1), Pair(-1, -1), Pair(-1, 1), Pair(1, -1), Pair(1, 1))
        } else {
            listOf(Pair(-1, 0), Pair(1, 0), Pair(0, -1), Pair(0, 1))
        }

        val visited: MutableSet<GridCell> = mutableSetOf()
        val queue: Queue<GridCell> = LinkedList()
        val parentMap: MutableMap<GridCell, GridCell?> = mutableMapOf()

        queue.add(startNode)
        visited.add(startNode)
        parentMap[startNode] = null

        var endNode: GridCell? = null

        while (queue.isNotEmpty()) {
            val cell = queue.poll()
            if (!cell.equals(startNode)){
                WebSocketManager.addToBuffer("${cell.row}:${cell.col}")
            }

            if (cell.isEnd) {
                endNode = cell
                break
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
                    parentMap[newCell] = cell
                }
            }
        }

        if (endNode != null) {
            sendPath(endNode, parentMap)
        }
    }

    private fun sendPath(endNode: GridCell, parentMap: Map<GridCell, GridCell?>) {
        var current: GridCell? = endNode
        val path = mutableListOf<String>()

        while (current != null) {
            path.add("${current.row}:${current.col}")
            current = parentMap[current]
        }

        path.reverse()
        WebSocketManager.addToBuffer("P" + path.joinToString(";"))
    }
}
