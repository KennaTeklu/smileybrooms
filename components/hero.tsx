import Image from "next/image"

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Welcome to Our Amazing Website</h1>
          <p>
            This is a brief description of what we offer. We provide high-quality services and products to meet your
            needs.
          </p>
          <button className="cta-button">Learn More</button>
        </div>
        <div className="hero-image">
          <Image src="/placeholder.svg" alt="Hero Image" width={500} height={300} />
        </div>
      </div>
    </section>
  )
}

export default Hero
