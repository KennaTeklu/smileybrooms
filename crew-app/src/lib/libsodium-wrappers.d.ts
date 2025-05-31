declare module "libsodium-wrappers" {
  export function init(): Promise<void>
  export function randombytes_buf(length: number): Uint8Array
  export function from_base64(s: string, variant?: string): Uint8Array
  export function to_base64(bin: Uint8Array, variant?: string): string
  export function crypto_pwhash_str(passwd: string | Uint8Array, opslimit: number, memlimit: number): Promise<string>
  export function crypto_pwhash_str_verify(hash: string, passwd: string | Uint8Array): Promise<boolean>

  export const crypto_pwhash_OPSLIMIT_INTERACTIVE: number
  export const crypto_pwhash_MEMLIMIT_INTERACTIVE: number
  export const crypto_pwhash_ALG_ARGON2ID13: number

  export function verify(hash: Uint8Array, password: Uint8Array): Promise<boolean>
}
