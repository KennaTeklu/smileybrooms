/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
"use client"

import { Card, CardContent } from "@/components/ui/card"

export function OurCommitment() {
  return (
    <section className="h-full flex items-center justify-center bg-gradient-to-b from-primary/10 to-transparent py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Commitment</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Customers</h3>
                  <p>
                    We promise to deliver exceptional cleaning services that exceed your expectations. We respect your
                    home or office as if it were our own, using only the highest quality products and techniques.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Employees</h3>
                  <p>
                    We're committed to providing fair wages, comprehensive training, and opportunities for growth. Our
                    team members are the heart of our business, and we invest in their success and well-being.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Environment</h3>
                  <p>
                    We use eco-friendly cleaning products and sustainable practices whenever possible. We're constantly
                    researching and implementing new ways to reduce our environmental footprint.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">To Our Community</h3>
                  <p>
                    We actively participate in community initiatives and support local causes. We believe in giving back
                    to the communities that have helped us grow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
