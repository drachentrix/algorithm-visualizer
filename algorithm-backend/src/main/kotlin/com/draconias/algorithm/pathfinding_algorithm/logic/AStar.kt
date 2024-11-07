package com.draconias.algorithm.pathfinding_algorithm.logic

import com.draconias.algorithm.pathfinding_algorithm.Pathfinder
import com.draconias.websockets.GridCell
import com.draconias.websockets.WebSocketManager
import java.util.PriorityQueue
import kotlin.math.abs

class AStar : Pathfinder {
    override suspend fun findPath(gridCell: List<List<GridCell>>, startNode: GridCell, diagonalAllowed: Boolean) {
        val directions = if (diagonalAllowed) {
            listOf(
                Pair(-1, 0), Pair(1, 0), Pair(0, -1), Pair(0, 1),
                Pair(-1, -1), Pair(-1, 1), Pair(1, -1), Pair(1, 1)
            )
        } else {
            listOf(Pair(-1, 0), Pair(1, 0), Pair(0, -1), Pair(0, 1))
        }

        val gCosts = mutableMapOf<GridCell, Int>()
        val fCosts = mutableMapOf<GridCell, Int>()
        val cameFrom = mutableMapOf<GridCell, GridCell?>()

        gCosts[startNode] = 0
        fCosts[startNode] = heuristic(startNode, findEndNode(gridCell))

        val openList = PriorityQueue(compareBy<GridCell> { fCosts[it] ?: Int.MAX_VALUE })
        openList.add(startNode)

        while (openList.isNotEmpty()) {
            val current = openList.poll()

            if (!current.isStart){
                WebSocketManager.addToBuffer("${current.row} : ${current.col}")
            }

            if (current.isEnd) {
                reconstructPath(cameFrom, current)
                return
            }

            for ((dr, dc) in directions) {
                val neighbor = getNeighbor(gridCell, current.row + dr, current.col + dc)

                if (neighbor != null && !neighbor.isObstacle && !cameFrom.containsKey(neighbor)) {
                    val tentativeGCost = gCosts[current]!! + 1
                    if (tentativeGCost < (gCosts[neighbor] ?: Int.MAX_VALUE)) {
                        cameFrom[neighbor] = current
                        gCosts[neighbor] = tentativeGCost
                        fCosts[neighbor] = tentativeGCost + heuristic(neighbor, findEndNode(gridCell))

                        if (!openList.contains(neighbor)) {
                            openList.add(neighbor)
                        }
                    }
                }
            }
        }
    }

    private fun heuristic(cell: GridCell, endNode: GridCell?): Int {
        return if (endNode != null) {
            abs(cell.row - endNode.row) + abs(cell.col - endNode.col)
        } else {
            Int.MAX_VALUE
        }
    }

    private fun getNeighbor(grid: List<List<GridCell>>, row: Int, col: Int): GridCell? {
        return if (row in grid.indices && col in grid[row].indices) grid[row][col] else null
    }

    private fun findEndNode(grid: List<List<GridCell>>): GridCell? {
        return grid.flatten().find { it.isEnd }
    }

    private fun reconstructPath(cameFrom: Map<GridCell, GridCell?>, endNode: GridCell) {
        val path = mutableListOf<String>()
        var pathNode: GridCell? = endNode
        while (pathNode != null) {
            path.add("${pathNode.row}:${pathNode.col}")
            pathNode = cameFrom[pathNode]
        }
        path.reverse()
        WebSocketManager.addToBuffer("P" + path.joinToString(";"))
    }
}
