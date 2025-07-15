# Smiley Brooms Cleaning Service Application

This is the frontend application for Smiley Brooms, a modern cleaning service booking platform built with Next.js, React, and Tailwind CSS.

## Features

*   **Multi-step Checkout:** A streamlined process for booking cleaning services, including contact, address, payment, and review steps.
*   **Dynamic Pricing Calculator:** Allows users to customize their cleaning service based on room types, add-ons, and frequency, with real-time price updates.
*   **Cart Management:** Add, remove, and update cleaning services in the cart.
*   **Persistent Cart Data:** Cart and checkout data are cached in the browser's local storage to prevent data loss on refresh.
*   **Responsive Design:** Optimized for various devices and screen sizes.
*   **Accessibility Features:** Includes an accessibility toolbar and considerations for enhanced user experience.
*   **Stripe Integration:** Supports secure payment processing.
*   **AI Chatbot Integration:** (Optional) Provides AI-powered assistance to users.
*   **Theming:** Supports light and dark modes.

## Getting Started

### Prerequisites

*   Node.js (v18.x or later)
*   npm or Yarn

### Installation

1.  Clone the repository:
    \`\`\`bash
    git clone https://github.com/your-username/smiley-brooms.git
    cd smiley-brooms
    \`\`\`
2.  Install dependencies:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`
3.  Create a `.env.local` file in the root directory and add your environment variables. You'll need at least:
    \`\`\`
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
    STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECRET=whsec_YOUR_STRIPE_WEBHOOK_SECRET
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api # Or your deployed API URL
    \`\`\`
    *   For Stripe keys, refer to the [Stripe documentation](https://stripe.com/docs/keys).
    *   For webhook secret, you'll need to set up a webhook endpoint in your Stripe dashboard pointing to `/api/webhooks/stripe` on your deployed application.

4.  Run the development server:
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

*   `app/`: Next.js App Router pages and layouts.
*   `components/`: Reusable React components, including Shadcn UI components.
*   `hooks/`: Custom React hooks for shared logic.
*   `lib/`: Utility functions, data, and API integrations.
*   `public/`: Static assets like images.
*   `styles/`: Global CSS.

## Deployment

This application is designed to be deployed on Vercel.

1.  Connect your Git repository to Vercel.
2.  Ensure your environment variables are configured in the Vercel project settings.
3.  Deploy!

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
