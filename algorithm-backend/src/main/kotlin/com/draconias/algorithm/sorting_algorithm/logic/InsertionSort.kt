package com.draconias.algorithm.sorting_algorithm.logic

import com.draconias.algorithm.sorting_algorithm.SortingAlgorithm
import com.draconias.websockets.WebSocketManager

class InsertionSort: SortingAlgorithm {
    override suspend fun sort(items: MutableList<Int>) {
        for (i in 1..items.indices.last){
            var currentNumberIndex = i
            var indexToCompare = i-1
            var messageToSend = ""
            while(indexToCompare >= 0 && items[currentNumberIndex] < items[indexToCompare]){
                items.swap(currentNumberIndex, indexToCompare)
                messageToSend += "$currentNumberIndex:$indexToCompare;"
                currentNumberIndex--
                indexToCompare--
            }
            if (messageToSend.isNotEmpty()){
                messageToSend = messageToSend.removeSuffix(";")
                WebSocketManager.addToBuffer(messageToSend)
            }
        }
    }

    private fun MutableList<Int>.swap(index1: Int, index2: Int) {
        val temp = this[index1]
        this[index1] = this[index2]
        this[index2] = temp
    }
}