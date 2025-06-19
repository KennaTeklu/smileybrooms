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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, HelpCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ServiceFeature {
  name: string
  description: string
  quickClean: boolean | "partial"
  deepClean: boolean | "partial"
  premium: boolean | "partial"
  tooltip?: string
}

interface ServiceComparisonTableProps {
  roomType: string
  features: ServiceFeature[]
}

export function ServiceComparisonTable({ roomType, features }: ServiceComparisonTableProps) {
  const renderFeatureStatus = (status: boolean | "partial") => {
    if (status === true) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    } else if (status === "partial") {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700">
          Partial
        </Badge>
      )
    } else {
      return <XCircle className="h-5 w-5 text-gray-300" />
    }
  }

  return (
    <div className="rounded-md border">
      <div className="bg-gray-50 p-4 border-b">
        <h3 className="text-lg font-medium">Service Tier Comparison: {roomType}</h3>
        <p className="text-sm text-gray-500 mt-1">Compare what's included in each cleaning tier</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Feature</TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center">
                  <span>Quick Clean</span>
                  <Badge variant="outline" className="mt-1 bg-blue-50">
                    Basic
                  </Badge>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center">
                  <span>Deep Clean</span>
                  <Badge variant="secondary" className="mt-1">
                    3x Basic
                  </Badge>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center">
                  <span>Premium</span>
                  <Badge variant="destructive" className="mt-1">
                    9x Basic
                  </Badge>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {feature.name}
                    {feature.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </TableCell>
                <TableCell className="text-center">{renderFeatureStatus(feature.quickClean)}</TableCell>
                <TableCell className="text-center">{renderFeatureStatus(feature.deepClean)}</TableCell>
                <TableCell className="text-center">{renderFeatureStatus(feature.premium)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1" />
          <span>Prices shown are per room. Additional fees may apply for larger rooms.</span>
        </div>
        <Button variant="outline" size="sm">
          View Full Details
        </Button>
      </div>
    </div>
  )
}
