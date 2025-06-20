import type { RecaptchaVerifier } from "firebase/auth"

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier
    grecaptcha: any // Google Recaptcha global object
  }
}
