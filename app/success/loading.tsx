"use client"

import { motion } from "framer-motion"

export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
      >
        {/* Animated Loading Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Processing Your Request...
        </motion.h2>

        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Please wait while we confirm your service request and prepare your confirmation details.
        </motion.p>

        {/* Progress Steps */}
        <div className="space-y-3">
          {[
            { step: "Verifying payment", delay: 0 },
            { step: "Preparing confirmation", delay: 0.5 },
            { step: "Sending notifications", delay: 1 },
            { step: "Finalizing details", delay: 1.5 },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: item.delay,
                }}
              />
              <span className="text-sm text-muted-foreground">{item.step}</span>
            </motion.div>
          ))}
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="mt-8 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p className="text-xs text-muted-foreground">🧹 Preparing your SmileyBrooms service confirmation</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
