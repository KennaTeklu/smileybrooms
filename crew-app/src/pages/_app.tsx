import type { AppProps } from "next/app"
import "@/crew-app/src/styles/globals.css"
import CleanerPortalLayout from "@/crew-app/src/components/layout"

export default function App({ Component, pageProps }: AppProps) {
  // Apply layout to all pages except login
  const isLoginPage = Component.name === "LoginPage" // Assuming LoginPage is the component name

  return isLoginPage ? (
    <Component {...pageProps} />
  ) : (
    <CleanerPortalLayout>
      <Component {...pageProps} />
    </CleanerPortalLayout>
  )
}
