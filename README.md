# Smiley Brooms Website

Welcome to the official web application for [Smiley Brooms Cleaning Services](https://www.smileybrooms.com/)!  
This site lets you browse, book, and manage professional cleaning services—right from your browser.

---

## 🌟 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Local Development](#local-development)
  - [Static Export & Deployment](#static-export--deployment)
- [Navigation & Menus](#navigation--menus)
  - [Top Navigation Bar](#top-navigation-bar)
  - [Sidebar](#sidebar)
  - [Dropdown, Context, & Menubar](#dropdown-context--menubar)
- [Booking & Services](#booking--services)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Links & Resources](#links--resources)
- [License](#license)

---

## Overview

**Smiley Brooms** is an easy-to-use website for discovering and booking cleaning services.  
The app is built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and advanced [Radix UI](https://www.radix-ui.com/) components to deliver a modern, responsive, and accessible experience.

---

## Features

- **Responsive Navigation:**  
  - Desktop and mobile support out of the box.
  - Hamburger menu for mobile, sidebar for advanced navigation.

- **Advanced Menus:**  
  - Menubar, Sidebar, Dropdown, NavigationMenu, and ContextMenu.
  - Keyboard-accessible, animated, and theme-aware.

- **Booking Platform:**  
  - Browse cleaning services & pricing.
  - Book appointments and manage bookings.
  - View booking history.

- **Additional:**  
  - Cart functionality.
  - Theme switching (Light/Dark).
  - Fully static export for GitHub Pages.

---

## Live Demo

Visit the website:  
👉 [https://KennaTeklu.github.io/smileybrooms](https://KennaTeklu.github.io/smileybrooms)

---

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/KennaTeklu/smileybrooms.git
cd smileybrooms
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

### Static Export & Deployment

To generate a static version for GitHub Pages:

```bash
npm run build
npm run export
```

The static files will be in the `out/` directory.

Deployment to GitHub Pages is automated via GitHub Actions (`.github/workflows/deploy.yml`).  
For details, see the [Next.js GitHub Pages guide](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#github-pages).

---

## Navigation & Menus

### Top Navigation Bar

- Located at the top of every page.
- Links: `Home`, `About`, `Contact`, `Pricing`, `Careers`
- Cart icon for booking management.
- Theme toggle (Light/Dark).
- Mobile users see a hamburger menu.

Component: [`components/enhanced-navigation.tsx`](components/enhanced-navigation.tsx)

### Sidebar

- Used for advanced navigation (e.g. admin dashboards, user panels).
- Supports submenus, groups, and active state highlighting.

Component: [`components/ui/sidebar.tsx`](components/ui/sidebar.tsx)

### Dropdown, Context, & Menubar

- **Dropdown Menus:** Right-click or button-triggered menus.
- **Context Menus:** Custom right-click context actions.
- **Menubar:** Desktop-style menubar with keyboard navigation.
- **NavigationMenu:** Horizontal navigation with expandable groups.

All menu primitives use [Radix UI](https://www.radix-ui.com/).

Components can be found in:
- [`components/ui/menubar.tsx`](components/ui/menubar.tsx)
- [`components/ui/navigation-menu.tsx`](components/ui/navigation-menu.tsx)
- [`components/ui/context-menu.tsx`](components/ui/context-menu.tsx)
- [`components/ui/dropdown-menu.tsx`](components/ui/dropdown-menu.tsx)

---

## Booking & Services

- Browse available cleaning services and their prices.
- Book a cleaning appointment directly from the website.
- View your booking history and manage appointments.
- Receive notifications about upcoming bookings.

---

## Technology Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [clsx](https://www.npmjs.com/package/clsx)
- **UI Components:** [Radix UI Primitives](https://www.radix-ui.com/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Other:** [Framer Motion](https://www.framer.com/motion/), [date-fns](https://date-fns.org/), [React Query](https://tanstack.com/query), [Stripe](https://stripe.com/)

---

## Folder Structure

```
components/         # Reusable UI & app components (navigation, menus, forms, etc.)
pages/              # Next.js pages (routes)
public/             # Static assets (favicon, images)
styles/             # Global and Tailwind CSS
lib/                # Utility functions and helpers
out/                # Static export (created by `next export`)
.github/workflows/  # GitHub Actions workflows
```

---

## Contributing

We welcome contributions!  
To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Commit and push (`git commit -am 'Add my feature' && git push origin feature/my-feature`).
5. Open a [pull request](https://github.com/KennaTeklu/smileybrooms/pulls).

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contribution Guidelines](CONTRIBUTING.md) (add these files if you wish to enforce guidelines).

---

## FAQ

**Q: Can I run this site on my own domain?**  
A: Yes! See [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

**Q: Do I need Node.js to use the site?**  
A: No, you only need Node.js if you're developing or building the site yourself.

**Q: How do I add a new menu item?**  
A: See the navigation items array in [`components/enhanced-navigation.tsx`](components/enhanced-navigation.tsx).

**Q: Where can I get support?**  
A: Open an issue on [GitHub](https://github.com/KennaTeklu/smileybrooms/issues).

---

## Links & Resources

- [Smiley Brooms Website (Live)](https://KennaTeklu.github.io/smileybrooms)
- [Smiley Brooms Main Site](https://www.smileybrooms.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

## License

© 2025 Smiley Brooms Cleaning Services.  
All rights reserved.
