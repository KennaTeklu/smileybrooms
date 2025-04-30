# Generate a Certificate Signing Request (CSR) for code signing
# In production, you would purchase a real code signing certificate from a trusted CA

$cert = New-SelfSignedCertificate -Subject "CN=Smiley Brooms Cleaning Services" -KeyAlgorithm RSA -KeyLength 2048 -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" -KeyExportPolicy Exportable -KeyUsage DigitalSignature -Type CodeSigningCert -CertStoreLocation Cert:\CurrentUser\My

# Export the certificate to a PFX file
$CertPassword = ConvertTo-SecureString -String "YourStrongPassword" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath ".\certificate.pfx" -Password $CertPassword

Write-Host "Self-signed certificate created for testing purposes."
Write-Host "For production, purchase a code signing certificate from a trusted Certificate Authority."
