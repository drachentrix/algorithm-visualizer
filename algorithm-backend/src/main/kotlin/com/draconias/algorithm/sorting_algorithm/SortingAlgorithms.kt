package com.draconias.algorithm.sorting_algorithm

import com.draconias.algorithm.sorting_algorithm.logic.BubbleSort
import com.draconias.algorithm.sorting_algorithm.logic.SelectionSort

enum class SortingAlgorithms(val algorithm: SortingAlgorithm){
    SELECTION_SORT(SelectionSort()),
    BUBBLE_SORT(BubbleSort()),
}