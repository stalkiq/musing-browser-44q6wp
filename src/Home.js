import { Link } from "react-router-dom"

export function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <h1 className="home-title">
            <span className="price-text">Price</span> a <span className="pic-text">Pic</span>
          </h1>
          <p className="home-subtitle">
            Transform your images into professional price catalogs
          </p>
        </header>

        <div className="features-grid">
          <Link to="/image-pricer" className="feature-card feature-card-primary feature-card-pricing">
            <h2>Image Pricer</h2>
            <p>Upload your photos and add interactive price tags to any item. Perfect for catalogs, marketplaces, and product showcases.</p>
            <span className="feature-cta">Start Pricing →</span>
          </Link>

          {/* HIDDEN - 3D Kitchen Demo 
          <Link to="/3d-kitchen" className="feature-card feature-card-3d">
            <h2>3D Kitchen Demo</h2>
            <p>Explore our interactive 3D kitchen showroom. Hover over items to see names and prices with stunning animations.</p>
            <span className="feature-cta">Explore Demo →</span>
          </Link>
          */}
        </div>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload</h3>
              <p>Choose any image from your device (JPEG, PNG, HEIC supported)</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Tag</h3>
              <p>Click on items in your image to add price tags and descriptions</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Share</h3>
              <p>Download your priced image or share it with a shareable link</p>
            </div>
          </div>
        </section>

        <section className="use-cases">
          <h2>Perfect For</h2>
          <div className="use-cases-grid">
            <div className="use-case use-case-ecommerce">
              <h3>E-commerce</h3>
              <p>Create product catalogs quickly</p>
            </div>
            <div className="use-case use-case-realestate">
              <h3>Real Estate</h3>
              <p>Price fixtures and furnishings</p>
            </div>
            <div className="use-case use-case-design">
              <h3>Interior Design</h3>
              <p>Show clients item breakdowns</p>
            </div>
            <div className="use-case use-case-inventory">
              <h3>Inventory</h3>
              <p>Label and price your stock</p>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <p>No signup required • 100% client-side • Your images stay private</p>
        </footer>
      </div>
    </div>
  )
}

