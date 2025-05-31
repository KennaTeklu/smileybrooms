// This file is typically used for global layout and context providers.
// For Next.js, a simple layout.tsx is often sufficient, but including _app.tsx for completeness.
import type { AppProps } from "next/app"
import "../styles/globals.css" // Import global styles

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
