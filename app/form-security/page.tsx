import EncryptedFormExample from "@/components/encrypted-form-example"

export default function FormSecurityPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Form Security Features</h1>
          <p className="text-muted-foreground">
            Demonstrating advanced form security features including field encryption
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Field Encryption</h2>
          <p className="text-muted-foreground">
            Sensitive form fields like credit card numbers and social security numbers are automatically encrypted
            before submission to protect user data.
          </p>

          <EncryptedFormExample />
        </div>
      </div>
    </div>
  )
}
