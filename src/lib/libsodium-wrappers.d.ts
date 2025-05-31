// This is a minimal declaration file for libsodium-wrappers
// You might need a more comprehensive one or install @types/libsodium-wrappers
declare module "libsodium-wrappers" {
  export function ready(): Promise<void>
  export function randombytes_buf(length: number): Uint8Array
  export function from_base64(s: string, variant?: number): Uint8Array
  export function to_base64(bin: Uint8Array, variant?: number): string
  export function crypto_pwhash_SALTBYTES(): number
  export const crypto_pwhash_OPSLIMIT_MODERATE: number
  export const crypto_pwhash_MEMLIMIT_MODERATE: number
  export const crypto_pwhash_ALG_ARGON2ID13: number
  export function crypto_pwhash(
    outlen: number,
    passwd: Uint8Array,
    salt: Uint8Array,
    opslimit: number,
    memlimit: number,
    alg: number,
  ): Uint8Array
  export function verify(hashedPin: Uint8Array, providedPin: Uint8Array): boolean
}
