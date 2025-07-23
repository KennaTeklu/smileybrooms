export interface TOSConfig {
  service: string
  location: string
  businessType: "residential" | "commercial"
  additionalClauses?: string[]
}

export interface TOSSection {
  id: string
  title: string
  content: string
  required: boolean
  jurisdiction?: string
}

// Service-specific terms templates
const serviceTerms = {
  deep_clean: {
    duration: "4-8 hours depending on property size",
    includes: ["All rooms", "Deep scrubbing", "Appliance cleaning", "Window cleaning"],
    liability: "Extended coverage for deep cleaning procedures",
    cancellation: "48-hour notice required for deep cleaning services",
  },
  regular_clean: {
    duration: "2-4 hours depending on property size",
    includes: ["Surface cleaning", "Vacuuming", "Bathroom sanitization", "Kitchen cleaning"],
    liability: "Standard cleaning coverage",
    cancellation: "24-hour notice required",
  },
  move_out: {
    duration: "6-10 hours depending on property condition",
    includes: ["Complete property cleaning", "Appliance deep clean", "Cabinet interiors", "Deposit guarantee"],
    liability: "Deposit return guarantee coverage",
    cancellation: "72-hour notice required for move-out cleaning",
  },
}

// Location-specific legal requirements
const jurisdictionRules = {
  CA: {
    name: "California",
    requiresLicense: true,
    licenseNumber: "CA-CLEAN-2024-001",
    additionalClauses: [
      "California Consumer Privacy Act (CCPA) compliance",
      "Right to cancel within 72 hours of service agreement",
      "Mandatory background checks for all cleaning staff",
    ],
    disputeResolution: "California state courts",
  },
  TX: {
    name: "Texas",
    requiresLicense: false,
    additionalClauses: ["Texas Property Code compliance", "Liability limitations under Texas Civil Practice"],
    disputeResolution: "Texas state courts",
  },
  NY: {
    name: "New York",
    requiresLicense: true,
    licenseNumber: "NY-HOME-SERVICES-2024",
    additionalClauses: ["New York General Business Law compliance", "Consumer protection under NY law"],
    disputeResolution: "New York state courts",
  },
}

export function generateTOS(config: TOSConfig): TOSSection[] {
  const { service, location, businessType } = config
  const serviceInfo = serviceTerms[service as keyof typeof serviceTerms]
  const jurisdictionInfo = jurisdictionRules[location as keyof typeof jurisdictionRules]

  const sections: TOSSection[] = [
    {
      id: "service_description",
      title: "Service Description",
      content: `
        SmileyBrooms will provide ${service.replace("_", " ")} services for your ${businessType} property.
        
        Service Details:
        • Estimated Duration: ${serviceInfo?.duration || "2-6 hours"}
        • Services Included: ${serviceInfo?.includes.join(", ") || "Standard cleaning services"}
        • Cancellation Policy: ${serviceInfo?.cancellation || "24-hour notice required"}
        
        All services are performed by trained, insured professionals using eco-friendly cleaning products.
      `,
      required: true,
    },
    {
      id: "pricing_payment",
      title: "Pricing and Payment",
      content: `
        Pricing is determined based on property size, service type, and frequency. All prices are quoted upfront with no hidden fees.
        
        Payment Terms:
        • Payment is due upon completion of service
        • Accepted payment methods: Credit/debit cards, digital wallets
        • Automatic billing for recurring services
        • 3% processing fee for same-day bookings
        
        Cancellation fees may apply based on notice period provided.
      `,
      required: true,
    },
    {
      id: "liability_insurance",
      title: "Liability and Insurance",
      content: `
        SmileyBrooms maintains comprehensive general liability insurance and bonding for all cleaning staff.
        
        Coverage Details:
        • General Liability: $2,000,000 per occurrence
        • Bonding: $500,000 per employee
        • Property Damage: Up to $50,000 per incident
        
        ${serviceInfo?.liability || "Standard liability coverage applies"}
        
        Customers are responsible for securing valuable items and providing access to the property.
      `,
      required: true,
      jurisdiction: location,
    },
    {
      id: "privacy_data",
      title: "Privacy and Data Protection",
      content: `
        We collect and process personal information in accordance with our Privacy Policy and applicable laws.
        
        Data Collection:
        • Contact information for service delivery
        • Property access details and preferences
        • Payment information (processed securely)
        • Service feedback and communications
        
        ${jurisdictionInfo?.additionalClauses.find((clause) => clause.includes("Privacy") || clause.includes("CCPA")) || ""}
        
        Your data is never sold to third parties and is used solely for service delivery and improvement.
      `,
      required: true,
      jurisdiction: location,
    },
  ]

  // Add jurisdiction-specific sections
  if (jurisdictionInfo) {
    sections.push({
      id: "legal_jurisdiction",
      title: "Legal Jurisdiction and Compliance",
      content: `
        This agreement is governed by the laws of ${jurisdictionInfo.name}.
        
        ${jurisdictionInfo.requiresLicense ? `Business License: ${jurisdictionInfo.licenseNumber}` : ""}
        
        Additional Legal Requirements:
        ${jurisdictionInfo.additionalClauses.map((clause) => `• ${clause}`).join("\n")}
        
        Dispute Resolution: Any disputes will be resolved in ${jurisdictionInfo.disputeResolution}.
      `,
      required: true,
      jurisdiction: location,
    })
  }

  return sections
}

export function generateTOSUrl(config: TOSConfig): string {
  const params = new URLSearchParams({
    service: config.service,
    location: config.location,
    type: config.businessType,
    ...(config.additionalClauses && { clauses: config.additionalClauses.join(",") }),
  })

  return `/terms?${params.toString()}`
}
