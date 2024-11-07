package com.draconias.algorithm.pathfinding_algorithm

import com.draconias.algorithm.pathfinding_algorithm.logic.AStar
import com.draconias.algorithm.pathfinding_algorithm.logic.Bfs
import com.draconias.websockets.PathfindingRequest
import com.draconias.websockets.WebSocketManager

enum class PathfindingAlgorithms(val pathfinder: Pathfinder){
    BFS(Bfs()),
    ASTAR(AStar());

    companion object{
        suspend fun selectPathfinder(request: PathfindingRequest){
            if (request.graph.isEmpty()){
                WebSocketManager.removeSession()
                return
            }
            entries[request.algorithmId - 1].pathfinder.findPath(request.graph, request.startNode, request.diagonalAllowed)
        }
    }
}