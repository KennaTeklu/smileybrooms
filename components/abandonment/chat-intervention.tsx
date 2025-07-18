"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, X } from "lucide-react"

interface ChatInterventionProps {
  isOpen: boolean
  onClose: () => void
  onStartChat: () => void
}

export function ChatIntervention({ isOpen, onClose, onStartChat }: ChatInterventionProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 text-center">
        <DialogHeader className="flex flex-col items-center">
          <MessageSquare className="h-16 w-16 text-blue-500 mb-4 animate-pulse" />
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Need Assistance?</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Our team is here to help! Chat with us if you have any questions or need support.
          </DialogDescription>
        </DialogHeader>
        <div className="my-6">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            We can help with pricing, services, or anything else!
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            No, Thanks
          </Button>
          <Button onClick={onStartChat} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <MessageSquare className="h-4 w-4 mr-2" /> Start Chat
          </Button>
        </DialogFooter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}
