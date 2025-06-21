import Image from "next/image"

export default function Home() {
  return (
    <main>
      <div>
        <Image src="/images/optimized-hero.png" alt="Optimized Hero Background" width={1920} height={1080} priority />
      </div>
    </main>
  )
}
