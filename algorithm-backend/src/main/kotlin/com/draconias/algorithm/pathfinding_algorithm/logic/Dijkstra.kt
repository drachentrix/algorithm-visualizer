package com.draconias.algorithm.pathfinding_algorithm.logic

import com.draconias.algorithm.pathfinding_algorithm.Pathfinder
import com.draconias.websockets.Graph
import com.draconias.websockets.Node

class Dijkstra: Pathfinder {
    val visited: MutableList<Node> = mutableListOf()
    override fun findPath(graph: Graph, startNode: Node, endNode: Node) {
        TODO("Not yet implemented")
    }
}