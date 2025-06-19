"use client"
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X } from "lucide-react"

export interface ServiceCategory {
  name: string
  services: {
    name: string
    quickClean: boolean
    deepClean: boolean
    premium: boolean
  }[]
}

export interface ServiceMapProps {
  roomName: string
  categories: ServiceCategory[]
}

export function ServiceMap({ roomName, categories }: ServiceMapProps) {
  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <CardTitle className="text-xl">Service Map: {roomName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual Map</TabsTrigger>
            <TabsTrigger value="detailed">Detailed List</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="pt-4">
            <div className="grid grid-cols-4 gap-2 text-center text-sm font-medium border-b pb-2">
              <div className="col-span-1">Service</div>
              <div className="col-span-1">Quick Clean</div>
              <div className="col-span-1">Deep Clean</div>
              <div className="col-span-1">Premium</div>
            </div>

            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mt-4">
                <h3 className="font-bold uppercase text-sm text-gray-500 mb-2">{category.name}</h3>
                {category.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="grid grid-cols-4 gap-2 py-2 border-b text-sm items-center">
                    <div className="col-span-1">{service.name}</div>
                    <div className="col-span-1 flex justify-center">
                      {service.quickClean ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {service.deepClean ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {service.premium ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="detailed" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-blue-600 mb-2">Quick Clean Includes:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {categories
                    .flatMap((category) => category.services.filter((service) => service.quickClean))
                    .map((service, index) => (
                      <li key={index}>{service.name}</li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-2">Deep Clean Includes:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="font-medium italic">Everything in Quick Clean, plus:</li>
                  {categories
                    .flatMap((category) =>
                      category.services.filter((service) => service.deepClean && !service.quickClean),
                    )
                    .map((service, index) => (
                      <li key={index}>{service.name}</li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-red-600 mb-2">Premium Includes:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="font-medium italic">Everything in Deep Clean, plus:</li>
                  {categories
                    .flatMap((category) => category.services.filter((service) => service.premium && !service.deepClean))
                    .map((service, index) => (
                      <li key={index}>{service.name}</li>
                    ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
