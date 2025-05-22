"use client"

import { useState } from "react"
import { useEncryptedForm } from "@/hooks/use-encrypted-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LockIcon, UnlockIcon, EyeIcon, EyeOffIcon, KeyIcon, RefreshCwIcon } from "lucide-react"

export default function EncryptedFormExample() {
  const [showEncryptedData, setShowEncryptedData] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [decryptedData, setDecryptedData] = useState<any>(null)

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    sensitiveFields,
    encryptFields,
    decryptValues,
    encryptionKey,
    regenerateKey,
    isFieldSensitive,
  } = useEncryptedForm({
    initialValues: {
      name: "",
      email: "",
      creditCard: "",
      ssn: "",
      notes: "",
    },
    sensitiveFields: ["creditCard", "ssn"],
    autoDetectSensitiveFields: true,
    persistKey: true,
    formId: "payment_form",
    onSubmit: async (values) => {
      // In a real app, you would send the encrypted data to your server
      console.log("Submitting encrypted form data:", values)
      setSubmittedData(values)
    },
  })

  const handleDecrypt = async () => {
    if (submittedData) {
      const decrypted = await decryptValues(submittedData)
      setDecryptedData(decrypted)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockIcon className="h-5 w-5" />
          Encrypted Form Example
        </CardTitle>
        <CardDescription>Sensitive fields are automatically encrypted before submission</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="creditCard">Credit Card</Label>
              {isFieldSensitive("creditCard") && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <LockIcon className="h-3 w-3" />
                  Encrypted
                </Badge>
              )}
            </div>
            <Input
              id="creditCard"
              name="creditCard"
              value={values.creditCard}
              onChange={(e) => handleChange("creditCard", e.target.value)}
              placeholder="4111 1111 1111 1111"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ssn">Social Security Number</Label>
              {isFieldSensitive("ssn") && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <LockIcon className="h-3 w-3" />
                  Encrypted
                </Badge>
              )}
            </div>
            <Input
              id="ssn"
              name="ssn"
              value={values.ssn}
              onChange={(e) => handleChange("ssn", e.target.value)}
              placeholder="123-45-6789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={values.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional information"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <KeyIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Encryption Key:</span>
          </div>
          <Button variant="outline" size="sm" onClick={regenerateKey} className="h-8 gap-1">
            <RefreshCwIcon className="h-3 w-3" />
            Regenerate
          </Button>
        </div>

        <div className="w-full">
          <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
            {encryptionKey.substring(0, 8)}...{encryptionKey.substring(encryptionKey.length - 8)}
          </code>
        </div>

        {submittedData && (
          <div className="w-full space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Submitted Data</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEncryptedData(!showEncryptedData)}
                className="h-8 gap-1"
              >
                {showEncryptedData ? (
                  <>
                    <EyeOffIcon className="h-3 w-3" />
                    Hide
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-3 w-3" />
                    Show
                  </>
                )}
              </Button>
            </div>

            {showEncryptedData && (
              <pre className="text-xs bg-muted p-2 rounded block overflow-x-auto h-40">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            )}

            <Button variant="outline" size="sm" onClick={handleDecrypt} className="w-full gap-1">
              <UnlockIcon className="h-4 w-4" />
              Decrypt Data
            </Button>

            {decryptedData && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Decrypted Data</h4>
                <pre className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                  {JSON.stringify(decryptedData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
