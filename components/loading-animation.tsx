"use client"
import { motion } from "framer-motion"

export default function LoadingAnimation() {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const emojiVariants = {
    initial: { opacity: 0, scale: 0, rotate: -180 },
    animate: {
      opacity: 1,
      scale: [0, 1.2, 1], // Pop out then settle
      rotate: [0, 360, 0], // Spin
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="flex space-x-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div variants={emojiVariants} className="text-6xl">
          😊
        </motion.div>
        <motion.div variants={emojiVariants} className="text-6xl">
          🧹
        </motion.div>
      </motion.div>
    </div>
  )
}
