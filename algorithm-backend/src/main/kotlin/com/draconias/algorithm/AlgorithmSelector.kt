package com.draconias.algorithm

import com.draconias.algorithm.sorting_algorithm.SortingAlgorithms
import com.draconias.algorithm.tree_traversal.TreeTraversals
import com.draconias.logger.LoggerInstance
import com.draconias.websockets.WebSocketManager
import com.draconias.websockets.WebSocketRequest

class AlgorithmSelector {

    suspend fun selectAlgorithm(webSocketRequest: WebSocketRequest){
        try{
            when(webSocketRequest.algorithmType.toInt()){
                1 -> SortingAlgorithms.entries[webSocketRequest.id.toInt() - 1].algorithm.sort(webSocketRequest.items!!)
                2 -> TreeTraversals.entries[webSocketRequest.id.toInt() - 1].treeTraversal.traverse(webSocketRequest.node!!)
            }
        } catch (e: Exception){
            LoggerInstance.getLogger().error("There was a problem: $e")
        }
        WebSocketManager.removeSession()
    }
}