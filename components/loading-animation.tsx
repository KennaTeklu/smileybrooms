// components/loading-animation.tsx

import type React from "react"
import styles from "./loading-animation.module.css"

const LoadingAnimation: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
    </div>
  )
}

export default LoadingAnimation

export { default as LoadingAnimation } from "./loading-animation"
