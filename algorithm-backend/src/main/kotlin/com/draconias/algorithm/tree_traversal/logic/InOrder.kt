package com.draconias.algorithm.tree_traversal.logic

import com.draconias.algorithm.tree_traversal.Leave
import com.draconias.algorithm.tree_traversal.TreeTraversal
import com.draconias.websockets.WebSocketManager

class InOrder: TreeTraversal {
    override suspend fun traverse(node: Leave) {
        if(node.left != null){
            traverse(node.left)
        }
        WebSocketManager.sendMessageToSession(node.value.toString())
        if (node.right != null){
            traverse(node.right)
        }
    }

}