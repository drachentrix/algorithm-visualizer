package com.draconias.algorithm.pathfinding_algorithm

import com.draconias.websockets.Graph
import com.draconias.websockets.Node

interface Pathfinder {
    fun findPath(graph: Graph, startNode: Node, endNode: Node)
}