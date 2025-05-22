/**
 * Form Field Encryption Utilities
 *
 * This module provides utilities for encrypting and decrypting sensitive form field data.
 * It uses the Web Crypto API to perform secure encryption operations.
 */

"use client"

import { useState, useCallback } from "react"

// Constants for encryption
const ALGORITHM = "AES-GCM"
const KEY_LENGTH = 256
const IV_LENGTH = 12
const SALT_LENGTH = 16
const ITERATIONS = 100000
const HASH = "SHA-256"

/**
 * Interface for encrypted data
 */
export interface EncryptedData {
  /**
   * Base64-encoded initialization vector
   */
  iv: string

  /**
   * Base64-encoded encrypted data
   */
  data: string

  /**
   * Base64-encoded salt used for key derivation
   */
  salt: string
}

/**
 * Converts an ArrayBuffer to a Base64 string
 * @param buffer - The ArrayBuffer to convert
 * @returns Base64 string representation
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Converts a Base64 string to an ArrayBuffer
 * @param base64 - The Base64 string to convert
 * @returns ArrayBuffer representation
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Generates a random initialization vector
 * @returns Promise resolving to the IV as ArrayBuffer
 */
async function generateIV(): Promise<ArrayBuffer> {
  return window.crypto.getRandomValues(new Uint8Array(IV_LENGTH)).buffer
}

/**
 * Generates a random salt
 * @returns Promise resolving to the salt as ArrayBuffer
 */
async function generateSalt(): Promise<ArrayBuffer> {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH)).buffer
}

/**
 * Derives an encryption key from a password
 * @param password - The password to derive the key from
 * @param salt - The salt to use for key derivation
 * @returns Promise resolving to the derived key
 */
async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  // Convert password to key material
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, ["deriveKey"])

  // Derive the actual encryption key
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: HASH,
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  )
}

/**
 * Encrypts a string value
 * @param value - The string to encrypt
 * @param password - The password to use for encryption
 * @returns Promise resolving to the encrypted data
 */
export async function encryptValue(value: string, password: string): Promise<EncryptedData> {
  try {
    // Generate IV and salt
    const iv = await generateIV()
    const salt = await generateSalt()

    // Derive the encryption key
    const key = await deriveKey(password, salt)

    // Encode the data
    const encoder = new TextEncoder()
    const data = encoder.encode(value)

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data,
    )

    // Return the encrypted data with IV and salt
    return {
      iv: arrayBufferToBase64(iv),
      data: arrayBufferToBase64(encryptedData),
      salt: arrayBufferToBase64(salt),
    }
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * Decrypts an encrypted value
 * @param encryptedData - The encrypted data object
 * @param password - The password used for encryption
 * @returns Promise resolving to the decrypted string
 */
export async function decryptValue(encryptedData: EncryptedData, password: string): Promise<string> {
  try {
    // Convert Base64 strings back to ArrayBuffers
    const iv = base64ToArrayBuffer(encryptedData.iv)
    const data = base64ToArrayBuffer(encryptedData.data)
    const salt = base64ToArrayBuffer(encryptedData.salt)

    // Derive the decryption key (same process as encryption)
    const key = await deriveKey(password, salt)

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      data,
    )

    // Decode the data
    const decoder = new TextDecoder()
    return decoder.decode(decryptedData)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

/**
 * Generates a secure encryption key
 * @returns A secure random string to use as an encryption key
 */
export function generateEncryptionKey(): string {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Encrypts multiple form field values
 * @param values - Object containing field values to encrypt
 * @param fieldsToEncrypt - Array of field names to encrypt
 * @param password - The password to use for encryption
 * @returns Promise resolving to an object with encrypted values
 */
export async function encryptFormFields(
  values: Record<string, string>,
  fieldsToEncrypt: string[],
  password: string,
): Promise<Record<string, string | EncryptedData>> {
  const result: Record<string, string | EncryptedData> = { ...values }

  for (const field of fieldsToEncrypt) {
    if (values[field]) {
      // Only encrypt fields that have values
      result[field] = await encryptValue(values[field], password)
    }
  }

  return result
}

/**
 * Decrypts multiple encrypted form field values
 * @param values - Object containing encrypted field values
 * @param fieldsToDecrypt - Array of field names to decrypt
 * @param password - The password used for encryption
 * @returns Promise resolving to an object with decrypted values
 */
export async function decryptFormFields(
  values: Record<string, string | EncryptedData>,
  fieldsToDecrypt: string[],
  password: string,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(values)) {
    if (fieldsToDecrypt.includes(key) && typeof value !== "string") {
      // Decrypt the field
      result[key] = await decryptValue(value as EncryptedData, password)
    } else {
      // Keep the original value
      result[key] = value as string
    }
  }

  return result
}

/**
 * React hook for managing encrypted form fields
 * @param initialPassword - The initial password to use for encryption/decryption
 * @param sensitiveFields - Array of field names that should be encrypted
 * @returns Object with encryption utilities
 */
export function useFieldEncryption(initialPassword?: string, sensitiveFields: string[] = []) {
  const [encryptionKey, setEncryptionKey] = useState<string>(initialPassword || generateEncryptionKey())

  /**
   * Encrypts a single form field value
   */
  const encryptField = useCallback(
    async (fieldName: string, value: string): Promise<EncryptedData> => {
      return encryptValue(value, encryptionKey)
    },
    [encryptionKey],
  )

  /**
   * Decrypts a single form field value
   */
  const decryptField = useCallback(
    async (fieldName: string, encryptedValue: EncryptedData): Promise<string> => {
      return decryptValue(encryptedValue, encryptionKey)
    },
    [encryptionKey],
  )

  /**
   * Encrypts multiple form field values
   */
  const encryptFields = useCallback(
    async (values: Record<string, string>): Promise<Record<string, string | EncryptedData>> => {
      return encryptFormFields(values, sensitiveFields, encryptionKey)
    },
    [encryptionKey, sensitiveFields],
  )

  /**
   * Decrypts multiple form field values
   */
  const decryptFields = useCallback(
    async (values: Record<string, string | EncryptedData>): Promise<Record<string, string>> => {
      return decryptFormFields(values, sensitiveFields, encryptionKey)
    },
    [encryptionKey, sensitiveFields],
  )

  /**
   * Changes the encryption key
   * @param newKey - The new encryption key
   */
  const changeEncryptionKey = useCallback((newKey: string) => {
    setEncryptionKey(newKey)
  }, [])

  /**
   * Generates a new random encryption key
   */
  const regenerateKey = useCallback(() => {
    setEncryptionKey(generateEncryptionKey())
  }, [])

  return {
    encryptionKey,
    encryptField,
    decryptField,
    encryptFields,
    decryptFields,
    changeEncryptionKey,
    regenerateKey,
    sensitiveFields,
  }
}

/**
 * Determines if a field should be encrypted based on its name or content
 * @param fieldName - The name of the field
 * @param value - The value of the field
 * @returns Whether the field should be encrypted
 */
export function shouldEncryptField(fieldName: string, value: string): boolean {
  // List of field names that typically contain sensitive data
  const sensitiveFieldNames = [
    "password",
    "creditCard",
    "ssn",
    "socialSecurity",
    "taxId",
    "passport",
    "driverLicense",
    "accountNumber",
    "routingNumber",
    "pin",
    "securityCode",
    "cvv",
    "cvc",
  ]

  // Check if the field name contains any sensitive keywords
  const lowercaseFieldName = fieldName.toLowerCase()
  if (sensitiveFieldNames.some((name) => lowercaseFieldName.includes(name))) {
    return true
  }

  // Check for credit card patterns
  const creditCardPattern = /^(?:\d{4}[- ]?){3}\d{4}$/
  if (creditCardPattern.test(value)) {
    return true
  }

  // Check for SSN patterns
  const ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/
  if (ssnPattern.test(value)) {
    return true
  }

  return false
}

/**
 * Creates a secure storage mechanism for encryption keys
 */
export class SecureKeyStorage {
  private storagePrefix: string

  constructor(prefix = "secure_key_") {
    this.storagePrefix = prefix
  }

  /**
   * Stores an encryption key securely
   * @param keyId - Identifier for the key
   * @param key - The encryption key to store
   */
  async storeKey(keyId: string, key: string): Promise<void> {
    try {
      // In a real implementation, this would use a more secure storage mechanism
      // For now, we'll use sessionStorage with a prefix
      sessionStorage.setItem(`${this.storagePrefix}${keyId}`, key)
    } catch (error) {
      console.error("Error storing encryption key:", error)
      throw new Error("Failed to store encryption key")
    }
  }

  /**
   * Retrieves an encryption key
   * @param keyId - Identifier for the key
   * @returns The retrieved encryption key
   */
  async retrieveKey(keyId: string): Promise<string | null> {
    try {
      return sessionStorage.getItem(`${this.storagePrefix}${keyId}`)
    } catch (error) {
      console.error("Error retrieving encryption key:", error)
      throw new Error("Failed to retrieve encryption key")
    }
  }

  /**
   * Removes an encryption key
   * @param keyId - Identifier for the key
   */
  async removeKey(keyId: string): Promise<void> {
    try {
      sessionStorage.removeItem(`${this.storagePrefix}${keyId}`)
    } catch (error) {
      console.error("Error removing encryption key:", error)
      throw new Error("Failed to remove encryption key")
    }
  }

  /**
   * Generates and stores a new encryption key
   * @param keyId - Identifier for the key
   * @returns The generated encryption key
   */
  async generateAndStoreKey(keyId: string): Promise<string> {
    const key = generateEncryptionKey()
    await this.storeKey(keyId, key)
    return key
  }
}
