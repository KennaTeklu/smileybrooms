export interface DataProcessingRecord {
  id: string
  userId: string
  dataType: "contact" | "service" | "payment" | "marketing"
  purpose: string
  legalBasis: "consent" | "contract" | "legitimate_interest" | "legal_obligation"
  timestamp: string
  retentionPeriod: string
  processingLocation: string
}

export interface UserDataRequest {
  id: string
  userId: string
  type: "access" | "rectification" | "erasure" | "portability" | "objection"
  status: "pending" | "processing" | "completed" | "rejected"
  requestDate: string
  completionDate?: string
  reason?: string
}

class GDPRComplianceManager {
  private processingRecords: DataProcessingRecord[] = []
  private userRequests: UserDataRequest[] = []

  // Log data processing activity
  logDataProcessing(record: Omit<DataProcessingRecord, "id" | "timestamp">) {
    const processingRecord: DataProcessingRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }

    this.processingRecords.push(processingRecord)

    // In production, this would be stored in a secure database
    console.log("Data processing logged:", processingRecord)
  }

  // Handle user data requests
  async submitDataRequest(request: Omit<UserDataRequest, "id" | "status" | "requestDate">) {
    const dataRequest: UserDataRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: "pending",
      requestDate: new Date().toISOString(),
    }

    this.userRequests.push(dataRequest)

    // Auto-process certain requests
    if (request.type === "access") {
      return this.processAccessRequest(dataRequest)
    }

    return dataRequest
  }

  // Process data access request
  private async processAccessRequest(request: UserDataRequest) {
    // Simulate data collection
    const userData = {
      personalData: {
        name: "User Name",
        email: "user@example.com",
        phone: "+1234567890",
      },
      serviceData: {
        bookings: [],
        preferences: {},
      },
      processingRecords: this.processingRecords.filter((r) => r.userId === request.userId),
    }

    request.status = "completed"
    request.completionDate = new Date().toISOString()

    return {
      request,
      data: userData,
    }
  }

  // Check consent status
  checkConsent(userId: string, purpose: string): boolean {
    const consent = localStorage.getItem(`consent-${userId}-${purpose}`)
    return consent === "true"
  }

  // Record consent
  recordConsent(userId: string, purpose: string, granted: boolean) {
    localStorage.setItem(`consent-${userId}-${purpose}`, granted.toString())

    this.logDataProcessing({
      userId,
      dataType: "marketing",
      purpose: `Consent ${granted ? "granted" : "withdrawn"} for ${purpose}`,
      legalBasis: "consent",
      retentionPeriod: "Until consent withdrawn",
      processingLocation: "Client browser",
    })
  }

  // Data retention check
  checkDataRetention() {
    const now = new Date()

    this.processingRecords.forEach((record) => {
      const recordDate = new Date(record.timestamp)
      const retentionMonths = this.parseRetentionPeriod(record.retentionPeriod)

      if (retentionMonths && now.getTime() - recordDate.getTime() > retentionMonths * 30 * 24 * 60 * 60 * 1000) {
        console.log(`Data retention period exceeded for record: ${record.id}`)
        // In production, trigger data deletion process
      }
    })
  }

  private parseRetentionPeriod(period: string): number | null {
    const match = period.match(/(\d+)\s*(month|year)s?/)
    if (!match) return null

    const value = Number.parseInt(match[1])
    const unit = match[2]

    return unit === "year" ? value * 12 : value
  }
}

export const gdprManager = new GDPRComplianceManager()

// Auto-check data retention daily
if (typeof window !== "undefined") {
  setInterval(
    () => {
      gdprManager.checkDataRetention()
    },
    24 * 60 * 60 * 1000,
  ) // 24 hours
}
