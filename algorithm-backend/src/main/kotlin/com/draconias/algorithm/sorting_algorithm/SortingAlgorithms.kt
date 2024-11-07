package com.draconias.algorithm.sorting_algorithm

import com.draconias.algorithm.sorting_algorithm.logic.BubbleSort
import com.draconias.algorithm.sorting_algorithm.logic.InsertionSort
import com.draconias.algorithm.sorting_algorithm.logic.SelectionSort
import com.draconias.websockets.SortingRequest

enum class SortingAlgorithms(val algorithm: SortingAlgorithm){
    SELECTION_SORT(SelectionSort()),
    BUBBLE_SORT(BubbleSort()),
    INSERTION_SORT(InsertionSort());

    companion object{

        suspend fun selectSort(request: SortingRequest){
            entries[request.algorithmId - 1].algorithm.sort(request.items)
        }
    }
}