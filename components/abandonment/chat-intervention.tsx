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
import { MessageSquare } from "lucide-react"

interface ChatInterventionProps {
  isOpen: boolean
  onClose: () => void
  onStartChat: () => void
}

export function ChatIntervention({ isOpen, onClose, onStartChat }: ChatInterventionProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="flex flex-col items-center text-center">
          <MessageSquare className="h-12 w-12 text-blue-500 mb-4" />
          <DialogTitle className="text-2xl font-bold">Need Assistance?</DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            It looks like you might need some help. Our support team is ready to answer your questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Click below to start a live chat with one of our friendly agents.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            No, thanks
          </Button>
          <Button onClick={onStartChat} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
