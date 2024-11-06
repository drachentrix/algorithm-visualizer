package com.draconias.algorithm.pathfinding_algorithm

import com.draconias.algorithm.pathfinding_algorithm.logic.Bfs
import com.draconias.websockets.PathfindingRequest

enum class PathfindingAlgorithms(val pathfinder: Pathfinder){
    BFS(Bfs());

    companion object{
        suspend fun selectPathfinder(request: PathfindingRequest){
            entries[request.algorithmId - 1].pathfinder.findPath(request.graph, request.startNode, request.diagonalAllowed)
        }
    }
}