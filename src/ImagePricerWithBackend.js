import { useState, useRef, useEffect } from "react"
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export function ImagePricerWithBackend({ user }) {
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [pricePoints, setPricePoints] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(null)
  const [formData, setFormData] = useState({ name: "", price: "" })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedProjects, setSavedProjects] = useState([])
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const imageRef = useRef(null)

  // Load user's saved projects
  useEffect(() => {
    if (user) {
      loadSavedProjects();
    }
  }, [user]);

  const loadSavedProjects = async () => {
    try {
      const { data: projects } = await client.models.PricedImage.list({
        filter: { userId: { eq: user.userId } }
      });
      setSavedProjects(projects || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("File selected:", file.name, file.type, file.size)
      setLoading(true)
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        console.log("Image loaded successfully!")
        setImage(event.target.result)
        setPricePoints([])
        setLoading(false)
        setCurrentProjectId(null)
      }
      reader.onerror = (error) => {
        console.error("Error loading image:", error)
        alert("Error loading image. Please try again.")
        setLoading(false)
      }
      reader.readAsDataURL(file)
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

  // Save to AWS Backend
  const handleSaveToCloud = async () => {
    if (!user) {
      alert("Please sign in to save to cloud!")
      return
    }

    if (!imageFile || pricePoints.length === 0) {
      alert("Please add at least one price tag before saving!")
      return
    }

    setSaving(true)
    try {
      // Upload image to S3
      const imageKey = `images/${user.userId}/${Date.now()}-${imageFile.name}`;
      const uploadResult = await uploadData({
        key: imageKey,
        data: imageFile,
        options: {
          contentType: imageFile.type
        }
      }).result;

      // Get the image URL
      const imageUrl = await getUrl({ key: imageKey });

      // Save to DynamoDB
      const totalPrice = pricePoints.reduce((sum, point) => sum + point.price, 0);
      
      if (currentProjectId) {
        // Update existing project
        await client.models.PricedImage.update({
          id: currentProjectId,
          pricePoints: JSON.stringify(pricePoints),
          totalPrice,
          updatedAt: new Date().toISOString()
        });
        alert("Project updated successfully!");
      } else {
        // Create new project
        const result = await client.models.PricedImage.create({
          userId: user.userId,
          imageKey,
          imageUrl: imageUrl.url.toString(),
          pricePoints: JSON.stringify(pricePoints),
          totalPrice,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: `Priced Image ${new Date().toLocaleDateString()}`,
          isPublic: false
        });
        setCurrentProjectId(result.data.id);
        alert("Saved to cloud successfully!");
      }

      loadSavedProjects();
    } catch (error) {
      console.error("Error saving to cloud:", error);
      alert("Error saving to cloud. Please try again.");
    } finally {
      setSaving(false)
    }
  };

  // Load a saved project
  const loadProject = async (project) => {
    try {
      setLoading(true);
      
      // Get the image URL
      const imageUrlResult = await getUrl({ key: project.imageKey });
      
      // Fetch the image and convert to data URL for display
      const response = await fetch(imageUrlResult.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setPricePoints(JSON.parse(project.pricePoints));
        setCurrentProjectId(project.id);
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error loading project:", error);
      alert("Error loading project");
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const project = savedProjects.find(p => p.id === projectId);
      if (project) {
        // Delete from S3
        await remove({ key: project.imageKey });
        // Delete from DynamoDB
        await client.models.PricedImage.delete({ id: projectId });
        
        if (currentProjectId === projectId) {
          setImage(null);
          setPricePoints([]);
          setCurrentProjectId(null);
        }
        
        loadSavedProjects();
        alert("Project deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  // Download image with price tags
  const handleDownload = () => {
    if (!image) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      pricePoints.forEach((point) => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height

        ctx.fillStyle = "white"
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 2

        const tagWidth = 150
        const tagHeight = 60
        const tagX = x - tagWidth / 2
        const tagY = y - tagHeight - 10

        const radius = 8
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

        ctx.fillStyle = "#222"
        ctx.font = "bold 16px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(point.name, x, tagY + 25)

        ctx.fillStyle = "#000"
        ctx.font = "bold 20px Inter, sans-serif"
        ctx.fillText(`$${point.price}`, x, tagY + 48)

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 8, tagY + tagHeight)
        ctx.lineTo(x + 8, tagY + tagHeight)
        ctx.closePath()
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.stroke()
      })

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

  const totalPrice = pricePoints.reduce((sum, point) => sum + point.price, 0)

  return (
    <div className="image-pricer">
      <div className="upload-section">
        <h1>Price Your Items{user && " (Cloud Enabled)"}</h1>
        <p>Upload an image and click on items to add prices</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-button">
          {loading ? "Loading..." : image ? "Change Image" : "Upload Image"}
        </label>
        {loading && <p style={{ textAlign: "center", color: "#666", marginTop: "1rem" }}>Loading your image...</p>}
      </div>

      {user && savedProjects.length > 0 && (
        <div className="saved-projects">
          <h3>Your Saved Projects</h3>
          <div className="projects-grid">
            {savedProjects.map((project) => (
              <div key={project.id} className="project-card">
                <h4>{project.title}</h4>
                <p>Total: ${project.totalPrice.toFixed(2)}</p>
                <p className="project-date">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <div className="project-actions">
                  <button onClick={() => loadProject(project)} className="load-button">
                    Load
                  </button>
                  <button onClick={() => deleteProject(project.id)} className="delete-project-button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                {user && (
                  <button 
                    onClick={handleSaveToCloud} 
                    className="action-button save-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : currentProjectId ? "💾 Update Cloud" : "☁️ Save to Cloud"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

