/**
 * Custom Quote Email Utilities
 * Formats quote requests into professional HTML emails with styling
 */

export interface QuoteFormData {
  serviceType: string
  propertyType: string
  squareFootage: string
  frequency: string
  specialRequests: string[]
  customRequest: string
  urgency: string
  budget: string
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  preferredContact: string
  additionalNotes: string
}

/**
 * Generate a comprehensive HTML email for custom quote requests
 */
export function generateCustomQuoteHTML(formData: QuoteFormData): string {
  const timestamp = new Date().toLocaleString()
  const quoteId = `CQ-${Date.now()}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Quote Request - ${formData.fullName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .quote-id {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 0 8px 8px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            color: #2c3e50;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #ecf0f1;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .info-table th,
        .info-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }
        .info-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
            width: 30%;
        }
        .info-table tr:last-child td {
            border-bottom: none;
        }
        .info-table tr:hover {
            background: #f8f9fa;
        }
        .checklist {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        .checklist-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding: 5px 0;
        }
        .checklist-item:last-child {
            margin-bottom: 0;
        }
        .checkbox {
            width: 18px;
            height: 18px;
            background: #4caf50;
            border-radius: 3px;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
        .priority-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .priority-asap {
            background: #ffebee;
            color: #c62828;
        }
        .priority-this-week {
            background: #fff3e0;
            color: #ef6c00;
        }
        .priority-flexible {
            background: #e8f5e8;
            color: #2e7d32;
        }
        .budget-highlight {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 6px;
            padding: 10px 15px;
            font-weight: 600;
            color: #1565c0;
        }
        .contact-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .contact-card h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
        }
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        .footer {
            background: #2c3e50;
            color: white;
            padding: 20px 30px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .next-steps {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .next-steps h3 {
            color: #2e7d32;
            margin: 0 0 10px 0;
        }
        /* Custom highlight for "brooms" */
        .brooms-highlighted-word {
            background-color: #667eea; /* Primary blue for light mode */
            color: white; /* White text on blue background */
            font-weight: 600;
            padding: 2px 4px;
            border-radius: 4px;
            display: inline-block; /* Ensure padding and background apply correctly */
        }
        @media (prefers-color-scheme: dark) {
            .brooms-highlighted-word {
                background-color: white; /* White background for dark mode */
                color: #667eea; /* Primary blue text on white background */
            }
        }

        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 20px;
            }
            .header {
                padding: 20px;
            }
            .info-table th,
            .info-table td {
                padding: 8px 10px;
                font-size: 14px;
            }
            .contact-info {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🧹 Custom Quote Request</h1>
            <p>smiley<span class="brooms-highlighted-word">brooms</span> Professional Cleaning Services</p>
        </div>
        
        <div class="content">
            <div class="quote-id">
                <strong>Quote ID:</strong> ${quoteId} | <strong>Submitted:</strong> ${timestamp}
            </div>

            <div class="section">
                <h2 class="section-title">📋 Service Requirements</h2>
                <table class="info-table">
                    <tr>
                        <th>Service Type</th>
                        <td><strong>${formData.serviceType || "Not specified"}</strong></td>
                    </tr>
                    <tr>
                        <th>Property Type</th>
                        <td>${formData.propertyType || "Not specified"}</td>
                    </tr>
                    <tr>
                        <th>Square Footage</th>
                        <td>${formData.squareFootage || "Not specified"}</td>
                    </tr>
                    <tr>
                        <th>Cleaning Frequency</th>
                        <td>${formData.frequency || "Not specified"}</td>
                    </tr>
                    <tr>
                        <th>Urgency</th>
                        <td>
                            ${formData.urgency ? `<span class="priority-badge priority-${formData.urgency.replace(/[^a-z]/g, "-")}">${formData.urgency}</span>` : "Not specified"}
                        </td>
                    </tr>
                    <tr>
                        <th>Budget Range</th>
                        <td>
                            ${formData.budget ? `<div class="budget-highlight">${formData.budget}</div>` : "Not specified"}
                        </td>
                    </tr>
                </table>
            </div>

            ${
              formData.specialRequests.length > 0
                ? `
            <div class="section">
                <h2 class="section-title">✅ Special Services Requested</h2>
                <div class="checklist">
                    ${formData.specialRequests
                      .map(
                        (request) => `
                        <div class="checklist-item">
                            <div class="checkbox">✓</div>
                            <span>${request}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            `
                : ""
            }

            ${
              formData.customRequest
                ? `
            <div class="section">
                <h2 class="section-title">💬 Custom Requirements</h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                    <p style="margin: 0; font-style: italic;">"${formData.customRequest}"</p>
                </div>
            </div>
            `
                : ""
            }

            <div class="contact-card">
                <h3>👤 Customer Information</h3>
                <div class="contact-info">
                    <div><strong>Name:</strong> ${formData.fullName}</div>
                    <div><strong>Email:</strong> ${formData.email}</div>
                    <div><strong>Phone:</strong> ${formData.phone}</div>
                    <div><strong>Preferred Contact:</strong> ${formData.preferredContact || "Any method"}</div>
                </div>
            </div>

            ${
              formData.address || formData.city || formData.state || formData.zipCode
                ? `
            <div class="section">
                <h2 class="section-title">📍 Service Location</h2>
                <table class="info-table">
                    ${formData.address ? `<tr><th>Address</th><td>${formData.address}</td></tr>` : ""}
                    ${formData.city ? `<tr><th>City</th><td>${formData.city}</td></tr>` : ""}
                    ${formData.state ? `<tr><th>State</th><td>${formData.state}</td></tr>` : ""}
                    ${formData.zipCode ? `<tr><th>ZIP Code</th><td>${formData.zipCode}</td></tr>` : ""}
                </table>
            </div>
            `
                : ""
            }

            ${
              formData.additionalNotes
                ? `
            <div class="section">
                <h2 class="section-title">📝 Additional Notes</h2>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800;">
                    <p style="margin: 0;">${formData.additionalNotes}</p>
                </div>
            </div>
            `
                : ""
            }

            <div class="next-steps">
                <h3>🚀 Next Steps</h3>
                <p><strong>Response Time:</strong> We'll contact you within 24 hours with a detailed quote.</p>
                <p><strong>Quote Validity:</strong> Custom quotes are valid for 30 days from the date of issue.</p>
                <p><strong>Questions?</strong> Call us at (555) 123-4567 or reply to this email.</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>smiley<span class="brooms-highlighted-word">brooms</span> Professional Cleaning Services</strong></p>
            <p>Making your space sparkle, one room at a time! ✨</p>
            <p>📧 custom@smileybrooms.com | 📞 (555) 123-4567</p>
        </div>
    </div>

    <script>
        // Add interactive elements for email clients that support JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Animate checklist items
            const checklistItems = document.querySelectorAll('.checklist-item');
            checklistItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            });
            
            // Add hover effects
            const tableRows = document.querySelectorAll('.info-table tr');
            tableRows.forEach(row => {
                row.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f0f8ff';
                });
                row.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = '';
                });
            });
        });
    </script>
</body>
</html>
  `.trim()
}

/**
 * Generate email subject line
 */
export function generateEmailSubject(formData: QuoteFormData): string {
  const urgencyPrefix = formData.urgency === "asap" ? "🚨 URGENT - " : ""
  return `${urgencyPrefix}Custom Quote Request - ${formData.fullName} (${formData.serviceType})`
}

/**
 * Detect if user is on mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Open Gmail with the formatted quote request
 */
export function openGmailWithQuote(formData: QuoteFormData): void {
  const subject = generateEmailSubject(formData)
  const htmlBody = generateCustomQuoteHTML(formData)
  const emailTo = "custom@smileybrooms.com" // Email address, no highlighting

  if (isMobileDevice()) {
    // On mobile, try to open Gmail app first, fallback to mailto
    const gmailAppUrl = `googlegmail://co?to=${encodeURIComponent(emailTo)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`

    // Try Gmail app first
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    iframe.src = gmailAppUrl
    document.body.appendChild(iframe)

    // Fallback to mailto after a short delay
    setTimeout(() => {
      document.body.removeChild(iframe)
      const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`
      window.location.href = mailtoUrl
    }, 1000)
  } else {
    // On desktop, open Gmail web interface
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`

    // Open in new tab
    const newWindow = window.open(gmailWebUrl, "_blank")

    // Fallback if popup blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      // Fallback to mailto
      const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`
      window.location.href = mailtoUrl
    }
  }
}

/**
 * Generate a preview of the email for testing
 */
export function previewQuoteEmail(formData: QuoteFormData): void {
  const htmlContent = generateCustomQuoteHTML(formData)
  const previewWindow = window.open("", "_blank")

  if (previewWindow) {
    previewWindow.document.write(htmlContent)
    previewWindow.document.close()
  }
}
