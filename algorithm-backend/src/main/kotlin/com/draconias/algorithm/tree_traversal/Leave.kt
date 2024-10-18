package com.draconias.algorithm.tree_traversal

import kotlinx.serialization.Serializable

data class Leave(val left: Leave?, val right: Leave?, val value: Int)