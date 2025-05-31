// This file is typically used for custom Document setup (e.g., adding custom fonts, scripts).
// For Next.js, it's often not strictly necessary as the environment handles basic HTML structure.
// Including a minimal version for completeness.
import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
