package com.draconias.algorithm.backtracking

import com.draconias.websockets.BackTrackGridCell
import com.draconias.websockets.GridCell

interface BackTracking {
    fun solve(gridCell: List<List<BackTrackGridCell>>, startNode: GridCell)
}