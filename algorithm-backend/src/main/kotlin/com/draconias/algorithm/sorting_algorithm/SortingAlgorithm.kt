package com.draconias.algorithm.sorting_algorithm

interface SortingAlgorithm{
    suspend fun sort(items: MutableList<Int>)
}