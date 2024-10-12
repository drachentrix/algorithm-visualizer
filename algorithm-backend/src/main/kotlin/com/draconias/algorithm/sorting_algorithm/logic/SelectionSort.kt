package com.draconias.algorithm.sorting_algorithm.logic

import com.draconias.algorithm.sorting_algorithm.SortingAlgorithm
import com.draconias.websockets.WebSocketManager

class SelectionSort : SortingAlgorithm {

    override suspend fun sort(items: MutableList<Int>) {
        for (i in items.indices) {
            val lowestIndex = findLowest(items.subList(i, items.size)) + i
            if (i != lowestIndex) {
                items.swap(i, lowestIndex)
                WebSocketManager.sendMessageToSession("$lowestIndex:$i")
            }
        }
        WebSocketManager.sendMessageToSession("FINISHED")

    }

    fun findLowest(items: List<Int>): Int {
        var lowestIndex = 0
        for (i in items.indices) {
            if (items[i] < items[lowestIndex]) {
                lowestIndex = i
            }
        }
        return lowestIndex
    }

    private fun MutableList<Int>.swap(index1: Int, index2: Int) {
        val temp = this[index1]
        this[index1] = this[index2]
        this[index2] = temp
    }
}