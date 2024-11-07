package com.draconias.algorithm.backtracking

import com.draconias.algorithm.backtracking.problems.KnightsTourProblem
import com.draconias.websockets.BackTrackingRequest
import com.draconias.websockets.WebSocketManager

enum class BackTrackingProblems(val backTracking: BackTracking) {
    KNIGHTSTOUR(KnightsTourProblem())
    ;

    companion object {
        suspend fun selectBackTrack(request: BackTrackingRequest) {
            if (request.graph.isEmpty()) {
                WebSocketManager.removeSession()
                return
            }
            BackTrackingProblems.entries[request.algorithmId - 1].backTracking.solve(request.graph, request.startNode)
        }
    }
}