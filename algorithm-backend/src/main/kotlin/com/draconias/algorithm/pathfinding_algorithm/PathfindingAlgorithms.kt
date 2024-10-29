package com.draconias.algorithm.pathfinding_algorithm

import com.draconias.algorithm.pathfinding_algorithm.logic.Dijkstra
import com.draconias.websockets.PathfindingRequest

enum class PathfindingAlgorithms(val pathfinder: Pathfinder){
    Dijkstra(Dijkstra());

    companion object{
        suspend fun selectPathfinder(request: PathfindingRequest){
            entries[request.algorithmId - 1].pathfinder.findPath(request.graph, request.startNode, request.endNode)
        }
    }
}