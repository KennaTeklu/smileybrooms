# Stripe Checkout Example

This is a simplified example of a Stripe checkout flow, demonstrating key components and interactions.

## Features

- **Service Selection:** Users can select various cleaning services.
- **Email Summary:** Displays a summary of selected services.
- **Dynamic UI:** Collapsible panels for settings, sharing, and chatbot support.
- **Web Worker Integration:** Price calculation offloads to a web worker for performance.
- **Framer Motion:** Smooth animations for UI elements.

## Getting Started

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`
2.  **Run the Development Server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
-   `components/`: Reusable React components, including Shadcn UI components.
-   `hooks/`: Custom React hooks for various functionalities.
-   `lib/`: Utility functions, constants, and business logic.
-   `public/`: Static assets like images.
-   `styles/`: Global CSS.

## Key Components

-   `app/page.tsx`: The main homepage, integrating various collapsible panels.
-   `components/service-selections.tsx`: Component for selecting cleaning services.
-   `app/email-summary/page.tsx`: Displays a summary of selected services.
-   `components/collapsible-settings-panel.tsx`: Panel for application settings.
-   `components/collapsible-share-panel.tsx`: Panel for sharing the page URL.
-   `components/collapsible-chatbot-panel.tsx`: Panel for customer support chatbot.
-   `lib/use-price-worker.ts`: Custom hook to interact with the price calculation web worker.
-   `lib/workers/price-calculator.worker.ts`: Web worker for offloading heavy price calculations.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/com/vercel/next.js/) - your feedback and contributions are welcome!
\`\`\`
