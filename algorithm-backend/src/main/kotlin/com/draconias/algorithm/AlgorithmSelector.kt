package com.draconias.algorithm

import com.draconias.algorithm.pathfinding_algorithm.PathfindingAlgorithms
import com.draconias.algorithm.sorting_algorithm.SortingAlgorithms
import com.draconias.logger.LoggerInstance
import com.draconias.websockets.PathfindingRequest
import com.draconias.websockets.SortingRequest
import com.draconias.websockets.WebSocketManager
import com.draconias.websockets.WsRequest

class AlgorithmSelector {

    suspend fun selectAlgorithm(request: WsRequest){
        try{
            when (request.type) {
                "sorting" -> SortingAlgorithms.selectSort(request as SortingRequest)
                "pathfinder" -> PathfindingAlgorithms.selectPathfinder(request as PathfindingRequest)
                else -> throw IllegalArgumentException("Unknown algorithm type")
            }
        } catch (e: Exception){
            LoggerInstance.getLogger().error("There was a problem: $e")
        }
    }
}