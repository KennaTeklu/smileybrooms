import MinimalHero from "@/components/minimal-hero"
import CartButton from "@/components/main-cart-button"

export default function Home() {
  return (
    <>
      <MinimalHero />
      <div className="fixed top-4 right-4 z-50">
        <CartButton />
      </div>
    </>
  )
}
