import type { AppProps } from "next/app"
import "@/crew-app/src/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
