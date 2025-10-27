# 🏪 Image Pricer - Interactive 3D Shopping Experience with AWS Backend

A modern web application that combines an interactive 3D kitchen showcase with a powerful image pricing tool, backed by AWS serverless infrastructure.

## ✨ Features

### 🏠 3D Kitchen Scene
- Interactive 3D kitchen model with React Three Fiber
- Hover over furniture items to see names and prices
- Smooth camera animations and visual effects
- Real-time price ticker with slot-machine animation

### 🖼️ Image Pricer (with AWS Backend)
- **Upload any image** and add interactive price tags
- **Click-to-price** interface for easy item tagging
- **Download** priced images as PNG files
- **Cloud Storage** - Save projects to AWS (requires sign-in)
- **User Authentication** - Secure login with AWS Cognito
- **Multi-device access** - Access your projects from anywhere
- **Project management** - Save, load, and delete multiple projects

## 🏗️ Architecture

### Frontend
- **React 18** - Modern UI library
- **React Three Fiber** - 3D graphics
- **React Router** - Client-side routing
- **AWS Amplify UI** - Authentication components

### Backend (AWS)
- **AWS Cognito** - User authentication & management
- **AWS AppSync** - GraphQL API
- **Amazon S3** - Image storage
- **Amazon DynamoDB** - NoSQL database for price data
- **AWS Lambda** - Serverless compute
- **AWS Amplify Hosting** - Static site hosting with CI/CD

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd musing-browser-44q6wp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run locally** (client-side only, no backend):
```bash
npm start
```

4. **Open** [http://localhost:3000](http://localhost:3000)

The app will work in **client-side mode** without AWS backend. To enable cloud features, follow the deployment guide.

### Deploy to AWS

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step instructions to deploy with AWS Amplify.

## 📁 Project Structure

```
musing-browser-44q6wp/
├── public/
│   ├── index.html
│   ├── kitchen-transformed.glb    # 3D model
│   └── Inter-Regular.woff         # Font
├── src/
│   ├── App.js                     # Original 3D app (no backend)
│   ├── AppWithBackend.js          # App with AWS integration
│   ├── Scene.js                   # 3D kitchen scene
│   ├── Price.js                   # Animated price ticker
│   ├── ImagePricer.js             # Client-side image pricer
│   ├── ImagePricerWithBackend.js  # Cloud-enabled image pricer
│   ├── amplifyconfiguration.json  # AWS config (generated)
│   ├── index.js                   # Entry point
│   └── styles.css                 # Global styles
├── amplify/                       # AWS Amplify backend config
├── amplify.yml                    # Build configuration
├── package.json
├── README.md
└── DEPLOYMENT.md                  # Deployment guide

```

## 🎮 How to Use

### 3D Kitchen Scene
1. Move your mouse to see the camera follow
2. Hover over items (chairs, table, lamp, etc.) to see them highlight
3. Watch the price ticker animate when hovering

### Image Pricer

**Without Sign-In** (Client-Side Mode):
1. Click "Image Pricer" in the navigation
2. Upload an image
3. Click on items to add price tags
4. Download the priced image

**With Sign-In** (Cloud Mode - requires deployment):
1. Sign up/Sign in with email
2. Upload an image
3. Click on items to add price tags
4. Click "Save to Cloud" to persist your project
5. Access your saved projects from any device
6. Load, update, or delete projects

## 🛠️ Tech Stack

- **React** 18.2.0
- **React Three Fiber** 8.15.12
- **Three.js** 0.160.0
- **@react-three/drei** 9.92.7
- **@react-three/postprocessing** 2.15.11
- **React Router** 6.x
- **AWS Amplify** (latest)
- **@aws-amplify/ui-react** (latest)

## 🔐 Security

- All authentication handled by AWS Cognito
- Images stored securely in S3 with IAM policies
- GraphQL API secured with user pool authentication
- HTTPS enforced on all connections
- No passwords stored in app (AWS handles everything)

## 💰 Cost

- **Free Tier**: AWS Free Tier covers most usage for 12 months
- **After Free Tier**: Estimated $0-10/month for light usage
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed cost breakdown

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
- AWS Amplify team for the excellent framework

## 📧 Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For AWS-specific issues, check [AWS Amplify Documentation](https://docs.amplify.aws/)

## 🗺️ Roadmap

- [ ] Public gallery of priced images
- [ ] AI-powered price suggestions
- [ ] Export to PDF/Excel
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Bulk upload and processing
- [ ] Team collaboration features
- [ ] Analytics dashboard

---

Built with ❤️ using React, Three.js, and AWS Amplify

