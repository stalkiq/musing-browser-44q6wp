# 🏪 Image Pricer - Interactive 3D Shopping Experience

A modern web application combining an interactive 3D kitchen showcase with a powerful image pricing tool.

## 🌐 Live Site

**https://d2czdx2vp1wgh9.cloudfront.net**

## ✨ Features

### 🏠 3D Kitchen Scene
- Interactive 3D kitchen model with React Three Fiber
- Hover over furniture items to see names and prices
- Smooth camera animations and visual effects
- Real-time price ticker with slot-machine animation

### 🖼️ Image Pricer
- **Upload any image** and add interactive price tags
- **Click-to-price** interface for easy item tagging
- **Download** priced images as PNG files
- **Share via URL** - All data encoded in the link (no backend needed!)
- Works completely offline after initial load

## 🏗️ Architecture

### Hosting
- **AWS S3** - Static file storage
- **AWS CloudFront** - Global CDN with HTTPS
- **Region**: us-west-2 (Oregon)

### Frontend
- **React 18** - Modern UI library
- **React Three Fiber** - 3D graphics
- **Three.js** - 3D rendering engine
- **React Router** - Client-side routing

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Open http://localhost:3000
```

### Deploy to AWS

```bash
# One command deployment!
./deploy.sh
```

This will:
1. Build the production app
2. Upload to S3
3. Invalidate CloudFront cache
4. Your site is updated globally in ~1 minute!

## 📁 Project Structure

```
musing-browser-44q6wp/
├── public/
│   ├── index.html
│   ├── kitchen-transformed.glb    # 3D model (2.1MB)
│   └── Inter-Regular.woff         # Font
├── src/
│   ├── App.js                     # Main app with routing
│   ├── Scene.js                   # 3D kitchen scene
│   ├── Price.js                   # Animated price ticker
│   ├── ImagePricer.js             # Image pricing tool
│   ├── index.js                   # Entry point
│   └── styles.css                 # Global styles
├── deploy.sh                      # Deployment script
└── package.json
```

## 🎮 How to Use

### 3D Kitchen Scene
1. Visit the home page
2. Move your mouse to control the camera
3. Hover over items to see prices:
   - Chairs ($255)
   - Table ($1,699)
   - Lamp ($77)
   - Vase ($44)
   - Bowl ($129)
   - Carpet ($433)
   - Kitchen ($5,999)

### Image Pricer
1. Click "Image Pricer" in the navigation
2. Click "Upload Image" and select a photo
3. Click on items in the photo to add price tags
4. Enter the item name and price
5. **Download** - Get a PNG with prices overlaid
6. **Share** - Get a link with all data embedded

## 🛠️ Tech Stack

- **React** 18.2.0
- **React Three Fiber** 8.15.12
- **Three.js** 0.160.0
- **@react-three/drei** 9.92.7
- **@react-three/postprocessing** 2.15.11
- **React Router** 7.9.4

## 💰 AWS Costs

- **S3 Storage**: ~$0.02/month (14MB of files)
- **CloudFront**: 
  - First 1TB free
  - Then $0.085/GB
- **Requests**: Negligible for normal traffic

**Expected cost**: **$0.00-0.50/month** for small-medium traffic

## 📊 Deployment Details

### S3 Bucket
- **Name**: `musing-browser-1761587939`
- **Region**: us-west-2
- **Public**: Yes
- **Static Website Hosting**: Enabled

### CloudFront Distribution
- **ID**: E2D6K9EYV68PTZ
- **Domain**: d2czdx2vp1wgh9.cloudfront.net
- **SSL**: Enabled (AWS Certificate)
- **Caching**: Optimized for static assets

## 🔄 Making Updates

```bash
# Make your code changes
git add .
git commit -m "Your changes"
git push origin main

# Deploy to AWS
./deploy.sh
```

Your site updates globally in ~60 seconds!

## 🧪 Testing Locally

```bash
npm start
# Visit http://localhost:3000
```

## 🌐 CDN Cache Invalidation

The deploy script automatically invalidates CloudFront cache. 

Manual invalidation:
```bash
aws cloudfront create-invalidation \
  --distribution-id E2D6K9EYV68PTZ \
  --paths "/*"
```

## 🔐 Security

- HTTPS enforced via CloudFront
- No backend = No attack surface
- All data client-side = Maximum privacy
- Share links encode data in URL (optional)

## 📈 Performance

- **Global CDN**: 50+ edge locations worldwide
- **Gzip Compression**: Automatic
- **Cache Headers**: Optimized
- **Bundle Size**: 652KB (gzipped)
- **Load Time**: < 2s globally

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- 3D model: Kitchen scene from public domain
- Icons: Emoji icons for UI elements
- Fonts: Inter typeface

## 📧 Support

- **Live Site**: https://d2czdx2vp1wgh9.cloudfront.net
- **GitHub**: https://github.com/stalkiq/musing-browser-44q6wp

---

Built with ❤️ using React, Three.js, and AWS CloudFront
