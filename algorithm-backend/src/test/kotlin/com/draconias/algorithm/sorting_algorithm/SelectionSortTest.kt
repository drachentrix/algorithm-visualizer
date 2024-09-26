package com.draconias.algorithm.sorting_algorithm

import com.draconias.websockets.WebSocketManager
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.*

class SelectionSortTest {

    @Mock
    lateinit var websocketController: WebSocketManager

    private lateinit var selectionSort: SelectionSort

    @BeforeEach
    fun setUp() {
        selectionSort = SelectionSort()
    }

    @Test
    fun `test selectionSort sends correct messages`() = runBlocking {
        val items = mutableListOf(5, 3, 8, 2, 7)

        doNothing().`when`(websocketController).sendMessageToSession(anyString())

        selectionSort.sort(items)

        verify(websocketController).sendMessageToSession("3:0")
        verify(websocketController).sendMessageToSession("1:1")
        verify(websocketController).sendMessageToSession("0:2")
        verify(websocketController).sendMessageToSession("4:3")
        verify(websocketController).sendMessageToSession("2:4")
        verify(websocketController).sendMessageToSession("FINISHED")
    }

    @Test
    fun `test findLowest works correctly`() {
        val items = listOf(5, 3, 8, 2, 7)
        val lowestIndex = selectionSort.findLowest(items)
        assert(lowestIndex == 3)
    }
}
