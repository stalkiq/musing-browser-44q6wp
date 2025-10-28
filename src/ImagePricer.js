import { useState, useRef, useEffect } from "react"
import heic2any from "heic2any"

export function ImagePricer() {
  const [image, setImage] = useState(null)
  const [pricePoints, setPricePoints] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(null)
  const [formData, setFormData] = useState({ name: "", price: "" })
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)

  const handleImageUpload = async (e) => {
    let file = e.target.files[0]
    if (file) {
      console.log("File selected:", file.name, file.type, file.size)
      setLoading(true)

      try {
        // Check if file is HEIC/HEIF and convert it
        if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
          console.log("Converting HEIC/HEIF to JPEG...")
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9
          })
          // heic2any can return an array of blobs for multi-image HEIC files
          file = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
          console.log("HEIC conversion successful!")
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          console.log("Image loaded successfully!")
          setImage(event.target.result)
          setPricePoints([]) // Reset price points when new image is loaded
          setLoading(false)
        }
        reader.onerror = (error) => {
          console.error("Error loading image:", error)
          alert("Error loading image. Please try again.")
          setLoading(false)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Error processing image:", error)
        alert("Error processing image. Please try a different format or file.")
        setLoading(false)
      }
    }
  }

  const handleImageClick = (e) => {
    if (!image) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setCurrentPoint({ x, y })
    setShowForm(true)
    setFormData({ name: "", price: "" })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.price && currentPoint) {
      setPricePoints([
        ...pricePoints,
        {
          id: Date.now(),
          x: currentPoint.x,
          y: currentPoint.y,
          name: formData.name,
          price: parseFloat(formData.price),
        },
      ])
      setShowForm(false)
      setCurrentPoint(null)
      setFormData({ name: "", price: "" })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setCurrentPoint(null)
    setFormData({ name: "", price: "" })
  }

  const handleDelete = (id) => {
    setPricePoints(pricePoints.filter((point) => point.id !== id))
  }

  // Load shared data from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedData = params.get("data")
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData))
        setImage(decoded.image)
        setPricePoints(decoded.pricePoints)
      } catch (error) {
        console.error("Error loading shared data:", error)
      }
    }
  }, [])

  // Download image with price tags
  const handleDownload = () => {
    if (!image) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the image
      ctx.drawImage(img, 0, 0)

      // Calculate scale factor based on image size (scale tags for larger images)
      const scaleFactor = Math.min(canvas.width, canvas.height) / 800

      // Draw price tags
      pricePoints.forEach((point) => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height

        // Draw price tag background (scaled)
        ctx.fillStyle = "white"
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 3 * scaleFactor

        const tagWidth = 150 * scaleFactor
        const tagHeight = 60 * scaleFactor
        const tagX = x - tagWidth / 2
        const tagY = y - tagHeight - (10 * scaleFactor)

        // Rounded rectangle for tag
        const radius = 8 * scaleFactor
        ctx.beginPath()
        ctx.moveTo(tagX + radius, tagY)
        ctx.lineTo(tagX + tagWidth - radius, tagY)
        ctx.quadraticCurveTo(tagX + tagWidth, tagY, tagX + tagWidth, tagY + radius)
        ctx.lineTo(tagX + tagWidth, tagY + tagHeight - radius)
        ctx.quadraticCurveTo(tagX + tagWidth, tagY + tagHeight, tagX + tagWidth - radius, tagY + tagHeight)
        ctx.lineTo(tagX + radius, tagY + tagHeight)
        ctx.quadraticCurveTo(tagX, tagY + tagHeight, tagX, tagY + tagHeight - radius)
        ctx.lineTo(tagX, tagY + radius)
        ctx.quadraticCurveTo(tagX, tagY, tagX + radius, tagY)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Draw text (scaled)
        ctx.fillStyle = "#222"
        ctx.font = `bold ${16 * scaleFactor}px Inter, sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(point.name, x, tagY + (25 * scaleFactor))

        ctx.fillStyle = "#000"
        ctx.font = `bold ${20 * scaleFactor}px Inter, sans-serif`
        ctx.fillText(`$${point.price}`, x, tagY + (48 * scaleFactor))

        // Draw pointer (scaled)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - (8 * scaleFactor), tagY + tagHeight)
        ctx.lineTo(x + (8 * scaleFactor), tagY + tagHeight)
        ctx.closePath()
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.stroke()
      })

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `priced-items-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)
      })
    }

    img.src = image
  }

  // Generate shareable link
  const handleShare = () => {
    if (!image || pricePoints.length === 0) {
      alert("Please add at least one price tag before sharing!")
      return
    }

    const data = {
      image,
      pricePoints,
    }

    const encoded = btoa(JSON.stringify(data))
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`

    setShareUrl(url)
    setShowShareModal(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!")
    })
  }

  const totalPrice = pricePoints.reduce((sum, point) => sum + point.price, 0)

  return (
    <div className="image-pricer">
      <div className="upload-section">
        <h1>Price Your Items</h1>
        <p>Upload an image and click on items to add prices</p>
        <input
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleImageUpload}
          className="file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-button">
          {loading ? "Loading..." : image ? "Change Image" : "Upload Image"}
        </label>
        {loading && <p style={{ textAlign: "center", color: "#666", marginTop: "1rem" }}>Loading your image...</p>}
      </div>

      {image && (
        <div className="image-container">
          <div className="image-wrapper">
            <img
              ref={imageRef}
              src={image}
              alt="Upload"
              onClick={handleImageClick}
              className="uploaded-image"
            />
            {pricePoints.map((point) => (
              <div
                key={point.id}
                className="price-tag"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className="price-tag-content">
                  <div className="price-tag-name">{point.name}</div>
                  <div className="price-tag-price">${point.price}</div>
                  <button
                    className="price-tag-delete"
                    onClick={() => handleDelete(point.id)}
                  >
                    ×
                  </button>
                </div>
                <div className="price-tag-pointer"></div>
              </div>
            ))}
            {currentPoint && showForm && (
              <div
                className="temp-marker"
                style={{ left: `${currentPoint.x}%`, top: `${currentPoint.y}%` }}
              />
            )}
          </div>

          {showForm && (
            <div className="price-form-overlay">
              <form onSubmit={handleSubmit} className="price-form">
                <h3>Add Item Details</h3>
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Lamp, Chair, Table"
                    autoFocus
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., 99.99"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Add Item
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {pricePoints.length > 0 && (
            <div className="summary">
              <h3>Items Summary</h3>
              <div className="summary-list">
                {pricePoints.map((point) => (
                  <div key={point.id} className="summary-item">
                    <span className="summary-name">{point.name}</span>
                    <span className="summary-price">${point.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="action-buttons">
                <button onClick={handleDownload} className="action-button download-button">
                  📥 Download Image
                </button>
                <button onClick={handleShare} className="action-button share-button">
                  🔗 Share Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="price-form-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Your Priced Image</h3>
            <p>Copy this link and share it with anyone:</p>
            <div className="share-url-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-url-input"
                onClick={(e) => e.target.select()}
              />
            </div>
            <div className="share-actions">
              <button onClick={copyToClipboard} className="submit-button">
                📋 Copy Link
              </button>
              <button onClick={() => setShowShareModal(false)} className="cancel-button">
                Close
              </button>
            </div>
            <p className="share-note">
              Note: The link contains all your image data. Works without any backend!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

