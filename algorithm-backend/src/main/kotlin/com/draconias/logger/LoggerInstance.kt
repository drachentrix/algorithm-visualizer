package com.draconias.logger

import org.slf4j.LoggerFactory

class LoggerInstance {
    companion object {
        private val loggerInstance = LoggerFactory.getLogger(LoggerInstance::class.java)
        fun  getLogger(): org.slf4j.Logger{
            return loggerInstance;
        }
    }

}