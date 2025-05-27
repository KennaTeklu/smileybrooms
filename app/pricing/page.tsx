import { RequestQuoteButton } from "@/components/request-quote-button"

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-semibold text-center mb-8">Pricing & Plans</h1>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Basic</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Perfect for individuals or small teams just getting started.
          </p>
          <div className="mt-4">
            <span className="text-3xl font-bold">$9</span>
            <span className="text-gray-600 dark:text-gray-400">/month</span>
          </div>
          <ul className="mt-4 space-y-2">
            <li>&#10003; 1 User</li>
            <li>&#10003; Basic Features</li>
            <li>&#10007; Priority Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pro</h2>
          <p className="text-gray-600 dark:text-gray-400">For growing teams that need more advanced features.</p>
          <div className="mt-4">
            <span className="text-3xl font-bold">$29</span>
            <span className="text-gray-600 dark:text-gray-400">/month</span>
          </div>
          <ul className="mt-4 space-y-2">
            <li>&#10003; 5 Users</li>
            <li>&#10003; Advanced Features</li>
            <li>&#10003; Priority Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Enterprise</h2>
          <p className="text-gray-600 dark:text-gray-400">Custom solutions for large organizations.</p>
          <div className="mt-4">
            <span className="text-3xl font-bold">Contact Us</span>
          </div>
          <ul className="mt-4 space-y-2">
            <li>&#10003; Unlimited Users</li>
            <li>&#10003; Custom Features</li>
            <li>&#10003; Dedicated Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Contact Sales
          </button>
        </div>
      </div>

      {/* Room Customization (Example - Replace with actual room customization component) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Customize Your Room</h2>
        <p className="text-gray-600 dark:text-gray-400">Select your room type and add any special requests.</p>
        {/* SimpleCustomizationPanel or room selection area would go here */}
        <div>
          {/* Example Room Selection */}
          <select className="mt-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Office</option>
          </select>
        </div>
      </div>

      {/* Custom Quote Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">Need Something Custom?</h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4 max-w-md mx-auto">
            Have special requirements or unique spaces? Get a personalized quote tailored to your specific needs.
          </p>
          <RequestQuoteButton
            showIcon={true}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 px-6 py-3 text-lg font-medium"
          />
        </div>
      </div>

      {/* Checkout Section (Example) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
        <p className="text-gray-600 dark:text-gray-400">Review your order and proceed to checkout.</p>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
