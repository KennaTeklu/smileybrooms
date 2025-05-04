"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Twitter, Linkedin, Mail, Link, X, Copy, Check } from "lucide-react"
import { useTranslation } from "@/lib/i18n/client"

interface SharePanelProps {
  onClose?: () => void
}

export default function SharePanel({ onClose }: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(!!onClose)
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const showTriggerButton = !onClose
  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    let shareUrl = ""
    const text = document.title

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(currentUrl)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  if (!isOpen && !showTriggerButton) return null

  return (
    <>
      {showTriggerButton && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-20 right-4 z-50 rounded-full h-12 w-12 shadow-lg bg-white dark:bg-gray-800"
          onClick={() => setIsOpen(true)}
          aria-label={t("share.shareThisPage")}
        >
          <Link className="h-5 w-5" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleClose}
                aria-label={t("common.close")}
              >
                <X className="h-5 w-5" />
              </Button>
              <CardTitle>{t("share.shareThisPage")}</CardTitle>
              <CardDescription>{t("share.chooseHowToShare")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => handleShare("facebook")}
                  aria-label={t("share.shareOnFacebook")}
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => handleShare("twitter")}
                  aria-label={t("share.shareOnTwitter")}
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => handleShare("linkedin")}
                  aria-label={t("share.shareOnLinkedIn")}
                >
                  <Linkedin className="h-5 w-5 text-blue-700" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => handleShare("email")}
                  aria-label={t("share.shareViaEmail")}
                >
                  <Mail className="h-5 w-5 text-gray-600" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="share-url">{t("share.copyLink")}</Label>
                <div className="flex">
                  <Input id="share-url" value={currentUrl} readOnly className="rounded-r-none" />
                  <Button
                    variant={copied ? "default" : "secondary"}
                    className="rounded-l-none"
                    onClick={handleCopy}
                    aria-label={t("share.copyToClipboard")}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? t("share.copied") : t("share.copy")}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleClose}>
                {t("common.close")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
