export interface TermsConfig {
  service: "standard" | "deep_clean" | "move_out" | "commercial"
  location: string
  date: string
  customClauses?: string[]
}

export interface LegalTemplate {
  id: string
  title: string
  content: string
  variables: Record<string, string>
  lastUpdated: string
  jurisdiction: string
}

const LEGAL_TEMPLATES: Record<string, LegalTemplate> = {
  "terms-base": {
    id: "terms-base",
    title: "Terms of Service - Base",
    content: `
# Terms of Service

**Effective Date:** {{effectiveDate}}
**Service Type:** {{serviceType}}
**Jurisdiction:** {{jurisdiction}}

## 1. Service Agreement
SmileyBrooms ("Company") agrees to provide {{serviceDescription}} cleaning services at the address specified in your booking confirmation.

## 2. Service Scope
{{serviceScope}}

## 3. Pricing and Payment
- Base service fee: As quoted in your booking
- Additional services: Charged at current rates
- Payment due: {{paymentTerms}}
- Cancellation policy: {{cancellationPolicy}}

## 4. Liability and Insurance
- Company is fully insured and bonded
- Insurance coverage: {{insuranceCoverage}}
- Liability limitations: {{liabilityLimits}}

## 5. Customer Responsibilities
{{customerResponsibilities}}

## 6. Governing Law
These terms are governed by the laws of {{jurisdiction}}.
    `,
    variables: {},
    lastUpdated: "2024-01-15",
    jurisdiction: "California",
  },
  "privacy-gdpr": {
    id: "privacy-gdpr",
    title: "Privacy Policy - GDPR Compliant",
    content: `
# Privacy Policy

## Data We Collect
- Contact information (name, email, phone)
- Service address and access instructions
- Payment information (processed securely)
- Service preferences and history

## Legal Basis for Processing
- Contract performance: To provide cleaning services
- Legitimate interest: Service improvement and communication
- Consent: Marketing communications (opt-in)

## Your Rights (GDPR)
- Right to access your data
- Right to rectification
- Right to erasure ("right to be forgotten")
- Right to data portability
- Right to object to processing

## Data Retention
- Service data: Retained for 7 years for tax purposes
- Marketing data: Until consent is withdrawn
- Payment data: As required by payment processors

## Contact Our DPO
Email: privacy@smileybrooms.com
Phone: 1-800-PRIVACY
    `,
    variables: {},
    lastUpdated: "2024-01-15",
    jurisdiction: "EU",
  },
}

const SERVICE_CONFIGS = {
  standard: {
    description: "standard residential",
    scope: "General cleaning of specified rooms including dusting, vacuuming, mopping, and sanitizing surfaces.",
    paymentTerms: "Upon completion of service",
    cancellationPolicy: "24-hour notice required",
  },
  deep_clean: {
    description: "deep cleaning",
    scope:
      "Comprehensive cleaning including baseboards, inside appliances, detailed bathroom cleaning, and all standard services.",
    paymentTerms: "Upon completion of service",
    cancellationPolicy: "48-hour notice required",
  },
  move_out: {
    description: "move-out",
    scope:
      "Complete property cleaning for move-out including inside all appliances, cabinets, closets, and detailed cleaning of all surfaces.",
    paymentTerms: "Upon completion of service",
    cancellationPolicy: "72-hour notice required",
  },
  commercial: {
    description: "commercial",
    scope: "Professional commercial cleaning services as specified in the service agreement.",
    paymentTerms: "Net 30 days",
    cancellationPolicy: "As per service contract",
  },
}

const JURISDICTION_CONFIGS = {
  CA: {
    name: "California",
    insuranceCoverage: "$2,000,000 general liability",
    liabilityLimits: "Limited to service fee amount",
    customerResponsibilities: "Provide safe access, secure valuables, disclose any hazardous materials",
  },
  TX: {
    name: "Texas",
    insuranceCoverage: "$1,000,000 general liability",
    liabilityLimits: "Limited to service fee amount",
    customerResponsibilities: "Provide safe access, secure valuables, disclose any hazardous materials",
  },
  NY: {
    name: "New York",
    insuranceCoverage: "$2,000,000 general liability",
    liabilityLimits: "As per New York state regulations",
    customerResponsibilities:
      "Provide safe access, secure valuables, disclose any hazardous materials, comply with building regulations",
  },
}

export function generateTerms(config: TermsConfig): string {
  const template = LEGAL_TEMPLATES["terms-base"]
  const serviceConfig = SERVICE_CONFIGS[config.service]
  const jurisdictionConfig =
    JURISDICTION_CONFIGS[config.location as keyof typeof JURISDICTION_CONFIGS] || JURISDICTION_CONFIGS.CA

  const variables = {
    effectiveDate: config.date,
    serviceType: config.service.replace("_", " "),
    serviceDescription: serviceConfig.description,
    serviceScope: serviceConfig.scope,
    paymentTerms: serviceConfig.paymentTerms,
    cancellationPolicy: serviceConfig.cancellationPolicy,
    jurisdiction: jurisdictionConfig.name,
    insuranceCoverage: jurisdictionConfig.insuranceCoverage,
    liabilityLimits: jurisdictionConfig.liabilityLimits,
    customerResponsibilities: jurisdictionConfig.customerResponsibilities,
  }

  let content = template.content
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), value)
  })

  return content
}

export function generatePrivacyPolicy(jurisdiction: "US" | "EU" = "US"): string {
  const template = jurisdiction === "EU" ? LEGAL_TEMPLATES["privacy-gdpr"] : LEGAL_TEMPLATES["terms-base"]
  return template.content
}
