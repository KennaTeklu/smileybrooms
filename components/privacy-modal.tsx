"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6 py-4 text-sm">
          <p className="text-muted-foreground text-right">Last Updated: July 17, 2025</p>

          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              This Privacy Policy ("Policy") explains how SmileyBrooms ("we," "our," "us") collects, uses, and protects
              your personal information when you access and use our services, including our website, platform, and
              related services (collectively referred to as the "Service"). By using the Service, you consent to the
              practices described in this Policy. We are committed to protecting your privacy and ensuring the security
              of your personal data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when using the Service, including but
              not limited to your name, email address, phone number, physical address, and any other information you
              submit through forms on our website or platform (e.g., booking forms, contact forms, career applications).
              We may also collect non-personally identifiable information, such as usage data, IP addresses, browser
              types, and cookies, to improve the Service and for analytics purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Use of Information</h2>
            <p>We use your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>To provide, operate, and maintain our Service;</li>
              <li>To process your bookings and payments;</li>
              <li>To send you service-related communications, including confirmations, updates, and reminders;</li>
              <li>To respond to your inquiries, comments, or requests;</li>
              <li>To improve and personalize the Service, including tailoring content and offers;</li>
              <li>To analyze usage patterns and optimize our website performance;</li>
              <li>To manage your position on our waitlist (if applicable);</li>
              <li>To send you updates about the launch of our service (if applicable);</li>
              <li>To process career applications;</li>
              <li>For marketing and promotional purposes, with your consent where required;</li>
              <li>To detect, prevent, and address technical issues or security incidents.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was
              collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. The
              specific retention periods depend on the type of data and the purpose of processing.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                **Account Information:** Retained as long as your account is active or as needed to provide you
                services. If you close your account, we may retain certain data for a limited period to comply with
                legal obligations or for legitimate business purposes (e.g., fraud prevention).
              </li>
              <li>
                **Transaction Data:** Financial transaction records are retained for a period required by tax and
                accounting laws (typically 7 years).
              </li>
              <li>
                **Communication Data:** Records of communications (e.g., customer support inquiries) may be retained for
                up to 2 years to improve our service and for dispute resolution.
              </li>
              <li>
                **Usage Data:** Non-personally identifiable usage data may be retained indefinitely for analytics and
                service improvement, but it is anonymized or aggregated where possible.
              </li>
            </ul>
            <p className="mt-2">
              After the retention period expires, your personal data will be securely deleted or anonymized.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Data Sharing with Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties for their direct marketing
              purposes. However, we may share your data with trusted third-party service providers who assist us in
              operating our Service, conducting our business, or serving our users, provided that these parties agree to
              keep this information confidential and comply with data protection laws.
            </p>
            <p className="mt-2 font-semibold">Details of Third-Party Services:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-2">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data Shared
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Purpose
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Privacy Policy
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">Stripe</td>
                    <td className="px-4 py-2">Payment info (tokenized), billing details, transaction data</td>
                    <td className="px-4 py-2">Payment processing, fraud prevention</td>
                    <td className="px-4 py-2">United States (global infrastructure)</td>
                    <td className="px-4 py-2">
                      <a
                        href="https://stripe.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">Google Analytics</td>
                    <td className="px-4 py-2">Anonymized IP, browsing behavior, device info, referral source</td>
                    <td className="px-4 py-2">Website analytics, performance monitoring</td>
                    <td className="px-4 py-2">Global (primarily US servers)</td>
                    <td className="px-4 py-2">
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">Google Sheets</td>
                    <td className="px-4 py-2">Form submissions (contact, service preferences, custom quote details)</td>
                    <td className="px-4 py-2">Store custom quote requests, internal record-keeping</td>
                    <td className="px-4 py-2">Global (primarily US servers)</td>
                    <td className="px-4 py-2">
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">Vercel</td>
                    <td className="px-4 py-2">Application logs, deployment metadata, user requests (IP, timestamps)</td>
                    <td className="px-4 py-2">Hosting, deployment, logging, performance monitoring</td>
                    <td className="px-4 py-2">Global (various data centers)</td>
                    <td className="px-4 py-2">
                      <a
                        href="https://vercel.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap">Email Service Provider (e.g., SendGrid)</td>
                    <td className="px-4 py-2">Email address, name, message content, delivery status</td>
                    <td className="px-4 py-2">Sending transactional and marketing emails</td>
                    <td className="px-4 py-2">Primarily United States (global infrastructure)</td>
                    <td className="px-4 py-2">
                      <a
                        href="https://sendgrid.com/legal/privacy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Link
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              We may also disclose your information when required by law, to enforce our site policies, or protect ours
              or others' rights, property, or safety.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">6. Cookie Usage</h2>
            <p>
              Our website uses "cookies" to enhance your experience. Cookies are small files placed on your device that
              enable the Service to recognize your browser and capture and remember certain information.
            </p>
            <p className="mt-2">We use the following types of cookies for these purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                **Strictly Necessary Cookies:** Essential for the website to function and cannot be switched off in our
                systems. They are usually only set in response to actions made by you which amount to a request for
                services, such as setting your privacy preferences, logging in, or filling in forms.
              </li>
              <li>
                **Performance Cookies (Analytics):** These cookies allow us to count visits and traffic sources so we
                can measure and improve the performance of our site. They help us to know which pages are the most and
                least popular and see how visitors move around the site.
              </li>
              <li>
                **Functionality Cookies:** These enable the website to provide enhanced functionality and
                personalization. They may be set by us or by third-party providers whose services we have added to our
                pages.
              </li>
              <li>
                **Targeting/Advertising Cookies:** These cookies may be set through our site by our advertising
                partners. They may be used by those companies to build a profile of your interests and show you relevant
                adverts on other sites.
              </li>
            </ul>
            <p className="mt-2">
              You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn
              off all cookies through your browser settings. If you turn cookies off, some of our Service features may
              not function properly. For more detailed information on managing cookies, please refer to your browser's
              help documentation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p>Under applicable data protection laws, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>**Access:** Request a copy of the personal information we hold about you.</li>
              <li>**Rectification:** Request that we correct any inaccurate or incomplete personal information.</li>
              <li>
                **Erasure (Right to be Forgotten):** Request the deletion of your personal data under certain conditions
                (e.g., if the data is no longer necessary for the purposes for which it was collected).
              </li>
              <li>
                **Restriction of Processing:** Request that we restrict the processing of your personal data under
                certain conditions.
              </li>
              <li>
                **Data Portability:** Request that we transfer the data that we have collected to another organization,
                or directly to you, under certain conditions.
              </li>
              <li>
                **Object to Processing:** Object to our processing of your personal data under certain conditions.
              </li>
              <li>
                **Withdraw Consent:** Withdraw your consent at any time where we are relying on consent to process your
                personal information.
              </li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us using the information provided in Section 9. We will
              respond to your request within a reasonable timeframe and in accordance with applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Data Breach Notification Procedures</h2>
            <p>
              In the unlikely event of a data breach that compromises your personal information, we have established
              procedures to respond promptly and effectively.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                **Detection & Assessment:** We will immediately investigate the breach to determine its nature, scope,
                and potential impact.
              </li>
              <li>
                **Containment & Mitigation:** We will take all necessary steps to contain the breach and mitigate any
                further unauthorized access or damage.
              </li>
              <li>
                **Notification:** If the breach is likely to result in a high risk to your rights and freedoms, we will
                notify you and the relevant supervisory authority without undue delay, and where feasible, not later
                than 72 hours after having become aware of it. The notification will include the nature of the breach,
                the categories of data involved, the likely consequences, and the measures taken or proposed to be
                taken.
              </li>
              <li>
                **Remediation:** We will implement additional security measures to prevent future occurrences and
                continuously review and improve our security protocols.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, our data practices, or if you wish to exercise any of
              your rights, please contact us:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>**Email:** privacy@smileybrooms.com</li>
              <li>**Phone:** +1 (555) 123-4567</li>
              <li>**Mailing Address:** 123 Privacy Lane, Data City, PC 98765, USA</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">10. Updates to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
              revised Policy on our website and updating the "Last Updated" date at the top of this Policy. Continued
              use of the Service after the posting of any updates constitutes your acceptance of the new terms.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
