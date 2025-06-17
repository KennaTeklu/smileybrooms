import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/favicon.png" alt="SmileyBrooms Logo" width={32} height={32} className={className} />
      <span className="font-bold text-lg tracking-tight inline-flex items-center">
        smiley
        <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
      </span>
    </Link>
  )
}
