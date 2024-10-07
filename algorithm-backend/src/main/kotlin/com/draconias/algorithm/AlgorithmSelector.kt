package com.draconias.algorithm

import com.draconias.algorithm.sorting_algorithm.SortingAlgorithms
import com.draconias.websockets.WebSocketManager
import com.draconias.websockets.WebSocketRequest

class AlgorithmSelector {

    suspend fun selectAlgorithm(webSocketRequest: WebSocketRequest){
        try{
            when(webSocketRequest.algorithmType.toInt()){
                1 -> SortingAlgorithms.entries[webSocketRequest.id.toInt() - 1].algorithm.sort(webSocketRequest.items)// todo: change to with ordinal
            }
        } catch (e: Exception){
            WebSocketManager.sendMessageToSession(e.toString())
        }
    }
}