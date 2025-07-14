export const saveContact = (phoneNumber: string) => {
  const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:Smiley Brooms Support
TEL:${phoneNumber}
END:VCARD`

  const blob = new Blob([vCardContent], { type: "text/vcard" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "SmileyBroomsSupport.vcf"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
