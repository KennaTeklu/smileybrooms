"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react"
import { Icons } from "@/components/icons"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Cart } from "@/components/cart"
import { Badge } from "@/components/ui/badge"

interface MobileNavItemProps {
  title: string
  href: string
  icon?: LucideIcon
}

interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  closed: { opacity: 0, y: -15, transition: { duration: 0.2 } },
}

function MobileNavItem({ title, href, icon: Icon }: MobileNavItemProps) {
  const pathname = usePathname()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(pathname === href)
  }, [pathname, href])

  return (
    <li>
      <Link href={href} onClick={() => {}}>
        <Button
          variant="ghost"
          className={cn("justify-start py-4 text-lg font-medium", active && "text-sky-500 dark:text-sky-400")}
        >
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span>{title}</span>
        </Button>
      </Link>
    </li>
  )
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  const { cart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-3/4 sm:w-2/3 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-5 pt-6 pb-2.5">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Explore our site and discover new products.</SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="flex-grow overflow-y-auto">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col space-y-1 px-2 py-4">
                <MobileNavItem title="Home" href="/" icon={Home} />
                <MobileNavItem title="Products" href="/products" icon={ShoppingBag} />
                <Separator />
                <SignedIn>
                  <MobileNavItem title="Account" href="/account" icon={User} />
                </SignedIn>
                <SignedOut>
                  <MobileNavItem title="Sign In" href="/sign-in" icon={User} />
                </SignedOut>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 px-5 py-4">
            <motion.div
              variants={{
                open: { opacity: 1, scale: 1, y: 0 },
                closed: { opacity: 0, scale: 0.8, y: 20 },
              }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium">Quick Actions</p>
            </motion.div>
            <div className="grid grid-cols-3 gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <motion.button
                    variants={itemVariants}
                    className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-colors relative"
                    onClick={onClose}
                  >
                    <ShoppingCart className="w-6 h-6 text-white" />
                    {cart.totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium"
                      >
                        {cart.totalItems}
                      </Badge>
                    )}
                  </motion.button>
                </SheetTrigger>
                <Cart />
              </Sheet>
              <motion.button
                variants={itemVariants}
                className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-colors"
                onClick={onClose}
              >
                <Icons.close className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
