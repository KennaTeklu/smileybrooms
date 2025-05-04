import { cn } from "@/lib/utils"

interface LogoIconProps {
  className?: string
  size?: number
}

export default function LogoIcon({ className, size = 40 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("rounded-full", className)}
    >
      <circle cx="20" cy="20" r="20" fill="url(#paint0_linear)" />
      <path
        d="M14 22C15.1046 22 16 21.1046 16 20C16 18.8954 15.1046 18 14 18C12.8954 18 12 18.8954 12 20C12 21.1046 12.8954 22 14 22Z"
        fill="white"
      />
      <path
        d="M26 22C27.1046 22 28 21.1046 28 20C28 18.8954 27.1046 18 26 18C24.8954 18 24 18.8954 24 20C24 21.1046 24.8954 22 26 22Z"
        fill="white"
      />
      <path
        d="M14 24C14 26.2091 16.6863 28 20 28C23.3137 28 26 26.2091 26 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M20 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 8L28 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 8L12 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  )
}
