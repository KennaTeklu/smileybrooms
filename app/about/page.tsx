import { Header } from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-4xl font-bold mb-6">About Our Payment Gateway</h1>

          <div className="prose prose-lg dark:prose-invert">
            <p>
              Our payment gateway integration provides a seamless and secure way to process online payments. Built with
              modern technologies and best practices, our solution offers a reliable payment experience for both
              merchants and customers.
            </p>

            <h2>Key Features</h2>
            <ul>
              <li>Secure payment processing with Stripe</li>
              <li>Support for multiple payment methods</li>
              <li>Real-time transaction monitoring</li>
              <li>Detailed reporting and analytics</li>
              <li>Seamless integration with your existing systems</li>
              <li>Mobile-friendly checkout experience</li>
            </ul>

            <h2>Our Technology</h2>
            <p>We've built our payment gateway using cutting-edge technologies:</p>
            <ul>
              <li>Next.js for server-side rendering and optimal performance</li>
              <li>React for a dynamic and responsive user interface</li>
              <li>Tailwind CSS for beautiful, consistent styling</li>
              <li>TypeScript for type safety and improved developer experience</li>
              <li>Stripe API for secure payment processing</li>
            </ul>

            <h2>Security</h2>
            <p>
              Security is our top priority. Our payment gateway implements industry-standard security measures to
              protect sensitive payment information:
            </p>
            <ul>
              <li>PCI DSS compliance</li>
              <li>End-to-end encryption</li>
              <li>Fraud detection and prevention</li>
              <li>Secure authentication methods</li>
              <li>Regular security audits and updates</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
