package com.draconias.algorithm.sorting_algorithm.logic

import com.draconias.algorithm.sorting_algorithm.SortingAlgorithm
import com.draconias.websockets.WebSocketManager

class BubbleSort: SortingAlgorithm {

    override suspend fun sort(items: MutableList<Int>) {
        for (idx in 0  until items.size - 1){
            for (idx2 in 0 until items.size- idx-1){
                if (items[idx2] > items[idx2+1]){
                    items.swap(idx2, idx2+1)
                    WebSocketManager.sendMessageToSession("$idx2:${idx2+1}")
                }
            }
        }
        WebSocketManager.sendMessageToSession("FINISHED")
    }

    private fun MutableList<Int>.swap(index1: Int, index2: Int) {
        val temp = this[index1]
        this[index1] = this[index2]
        this[index2] = temp
    }
}