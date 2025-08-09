"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UnifiedFooter() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under development and will be available shortly.",
      variant: "default",
    })
  }

  return (
    <footer className="bg-gray-900 text-gray-200 p-8 md:py-16 w-full shadow-lg">
      <div className="container max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 text-sm relative">
        {/* Invisible backdrop for closing panels */}
        <div
          className="fixed inset-0 z-[998] bg-transparent pointer-events-auto"
          onClick={() => {
            // Close all collapsible panels when clicking outside
            const panels = document.querySelectorAll('[data-collapsible-panel="true"]')
            panels.forEach((panel) => {
              const closeButton = panel.querySelector("[data-close-panel]")
              if (closeButton) {
                ;(closeButton as HTMLElement).click()
              }
            })

            // Dispatch custom event for panels to listen to
            window.dispatchEvent(new CustomEvent("closeAllPanels"))
          }}
          style={{
            display: document.querySelector('[data-collapsible-panel="true"][data-panel-open="true"]')
              ? "block"
              : "none",
          }}
        />
        {/* Enhanced panel management system */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced collapsible panel management
              (function() {
                let panelObserver;
                
                function initPanelManager() {
                  // Listen for panel state changes
                  window.addEventListener('closeAllPanels', () => {
                    const openPanels = document.querySelectorAll('[data-collapsible-panel="true"][data-panel-open="true"]');
                    openPanels.forEach(panel => {
                      panel.setAttribute('data-panel-open', 'false');
                      panel.style.display = 'none';
                    });
                    updateBackdrop();
                  });
                  
                  // Monitor panel visibility changes
                  panelObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                      if (mutation.type === 'attributes' && 
                          (mutation.attributeName === 'data-panel-open' || 
                           mutation.attributeName === 'style')) {
                        updateBackdrop();
                      }
                    });
                  });
                  
                  // Observe all collapsible panels
                  document.querySelectorAll('[data-collapsible-panel="true"]').forEach(panel => {
                    panelObserver.observe(panel, { 
                      attributes: true, 
                      attributeFilter: ['data-panel-open', 'style'] 
                    });
                  });
                }
                
                function updateBackdrop() {
                  const backdrop = document.querySelector('[data-backdrop="collapsible-panels"]');
                  const hasOpenPanels = document.querySelector('[data-collapsible-panel="true"][data-panel-open="true"]');
                  
                  if (backdrop) {
                    backdrop.style.display = hasOpenPanels ? 'block' : 'none';
                    backdrop.style.zIndex = hasOpenPanels ? '998' : '-1';
                  }
                }
                
                // Enhanced click outside detection
                document.addEventListener('click', (e) => {
                  const clickedElement = e.target;
                  const openPanels = document.querySelectorAll('[data-collapsible-panel="true"][data-panel-open="true"]');
                  
                  openPanels.forEach(panel => {
                    // Check if click is outside panel and not on a trigger button
                    if (!panel.contains(clickedElement) && 
                        !clickedElement.closest('[data-panel-trigger]')) {
                      
                      // Close the panel
                      panel.setAttribute('data-panel-open', 'false');
                      panel.style.display = 'none';
                      
                      // Trigger any close callbacks
                      const closeEvent = new CustomEvent('panelClosed', { 
                        detail: { panel: panel } 
                      });
                      panel.dispatchEvent(closeEvent);
                    }
                  });
                  
                  updateBackdrop();
                });
                
                // Initialize when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initPanelManager);
                } else {
                  initPanelManager();
                }
                
                // Keyboard support (ESC to close all panels)
                document.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape') {
                    window.dispatchEvent(new CustomEvent('closeAllPanels'));
                  }
                });
              })();
            `,
          }}
        />

        {/* Transparent backdrop element */}
        <div
          data-backdrop="collapsible-panels"
          className="fixed inset-0 bg-black/5 backdrop-blur-[0.5px] pointer-events-auto transition-opacity duration-200 opacity-0 hover:opacity-100"
          style={{
            zIndex: 998,
            display: "none",
          }}
          onClick={() => window.dispatchEvent(new CustomEvent("closeAllPanels"))}
        />
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-white">
            smiley<span className="bg-yellow-300 text-gray-900 px-1 rounded">brooms</span>
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Dedicated to providing exceptional cleaning services with a focus on customer satisfaction and eco-friendly
            practices.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="h-4 w-4 text-blue-400" />
              <a href="mailto:info@smileybrooms.com" className="hover:underline text-blue-300">
                info@smileybrooms.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone className="h-4 w-4 text-blue-400" />
              <a href="tel:+16616023000" className="hover:underline text-blue-300">
                (661) 602 3000
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>We'll come to you!</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-3">
          <h3 className="font-semibold text-lg text-white">Services & Info</h3>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Residential Cleaning
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Commercial Cleaning
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Deep Cleaning
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Pricing Calculator
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            How It Works
          </Link>
        </div>

        {/* Legal & Resources */}
        <div className="grid gap-3">
          <h3 className="font-semibold text-lg text-white">Legal & Resources</h3>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Privacy Policy
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Cookie Policy
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            FAQ
          </Link>
          <Link className="text-gray-400 hover:underline hover:text-white transition-colors" href="#">
            Careers
          </Link>
        </div>

        {/* Social Media & Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-white">Connect With Us</h3>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Facebook">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-400 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Twitter">
              <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-300 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="Instagram">
              <Instagram className="h-6 w-6 text-gray-400 hover:text-pink-400 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureComingSoon} aria-label="YouTube">
              <Youtube className="h-6 w-6 text-gray-400 hover:text-red-500 transition-colors" />
            </Button>
          </div>
          <p className="text-gray-400">Stay updated with our latest news and offers.</p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email"
              className="flex-1 p-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleFeatureComingSoon}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mt-12 text-center text-gray-500 border-t border-gray-700 pt-8">
        © {new Date().getFullYear()} Smiley Brooms. All rights reserved.
      </div>
    </footer>
  )
}
