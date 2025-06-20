import Image from "next/image"

export default function Logo({ className }: { className?: string }) {
  return <Image src="/placeholder-logo.svg" alt="SmileyBrooms Logo" width={32} height={32} className={className} />
}
