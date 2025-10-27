# 🚀 AWS Amplify Deployment Guide

This guide will help you deploy your Image Pricer app to AWS with full backend functionality including:
- ✅ User Authentication (AWS Cognito)
- ✅ Image Storage (S3)
- ✅ Database for priced items (DynamoDB via AppSync)
- ✅ Auto-deploy from GitHub
- ✅ HTTPS and custom domain support

## Prerequisites

1. **AWS Account**: Account ID `016442247702`
2. **GitHub Account**: To connect your repository
3. **AWS CLI** (optional but recommended): [Install here](https://aws.amazon.com/cli/)
4. **Node.js 18+** installed

---

## 📋 Deployment Steps

### Step 1: Push Code to GitHub

1. Initialize git and push to GitHub (if not already done):

```bash
cd /Users/appleid/Desktop/musing-browser-44q6wp
git init
git add .
git commit -m "Initial commit with AWS Amplify backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy Backend with Amplify CLI

1. **Install Amplify CLI globally** (if not installed):

```bash
npm install -g @aws-amplify/cli
```

2. **Configure Amplify with your AWS account**:

```bash
amplify configure
```

Follow the prompts:
- Sign in to AWS Console with account `016442247702`
- Select region: `us-west-2` (Oregon) or your preferred region
- Create an IAM user with AdministratorAccess-Amplify permissions
- Save the Access Key and Secret Key

3. **Initialize Amplify in your project**:

```bash
amplify init
```

Answer the prompts:
- Project name: `pricedimagessapp` (or your choice)
- Environment: `dev`
- Default editor: VS Code (or your choice)
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Distribution directory: `build`
- Build command: `npm run build`
- Start command: `npm start`
- Select your AWS profile or use the one you just created

4. **Add Authentication**:

```bash
amplify add auth
```

Choose:
- Default configuration
- Email for sign-in
- No advanced settings

5. **Add API (GraphQL)**:

```bash
amplify add api
```

Choose:
- GraphQL
- API name: `pricedimagesapi`
- Authorization type: Amazon Cognito User Pool
- Do you want to configure advanced settings: No
- Do you have an annotated GraphQL schema: No
- Choose guided schema creation: Yes
- Choose: Single object with fields
- Do you want to edit the schema now: Yes

Replace the schema with:

```graphql
type PricedImage @model @auth(rules: [{allow: owner}]) {
  id: ID!
  userId: String!
  imageKey: String!
  imageUrl: String!
  pricePoints: String!
  totalPrice: Float!
  title: String
  description: String
  isPublic: Boolean
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}
```

6. **Add Storage (S3)**:

```bash
amplify add storage
```

Choose:
- Content (Images, audio, video, etc.)
- Resource name: `pricedimages`
- Bucket name: Accept the default
- Who should have access: Auth and guest users
- What kind of access for Auth users: create, read, update, delete
- What kind of access for Guest users: read

7. **Deploy all backend resources**:

```bash
amplify push
```

This will:
- Create all AWS resources (Cognito, AppSync, DynamoDB, S3, IAM roles)
- Generate the `aws-exports.js` configuration file
- Deploy everything to your AWS account
- Take 5-10 minutes

8. **Update configuration**:

After `amplify push` completes, it creates `src/aws-exports.js`. Update your `src/amplifyconfiguration.json` with the values from `aws-exports.js`, or simply:

```bash
cp src/aws-exports.js src/amplifyconfiguration.json
```

### Step 3: Set Up GitHub Auto-Deploy with AWS Amplify Console

1. **Go to AWS Amplify Console**:
   - Open [AWS Console](https://console.aws.amazon.com/)
   - Navigate to AWS Amplify service
   - Click "New app" → "Host web app"

2. **Connect GitHub**:
   - Select GitHub as your repository service
   - Authorize AWS Amplify to access your GitHub
   - Select your repository and branch (main)

3. **Configure Build Settings**:
   - Amplify will auto-detect your `amplify.yml` file
   - Review the build settings (should look correct)
   - Click "Next"

4. **Review and Deploy**:
   - Review all settings
   - Click "Save and deploy"

5. **Wait for deployment** (~5-10 minutes):
   - Amplify will:
     - Provision hosting
     - Build your app
     - Deploy frontend
     - Connect to backend
   - You'll get a URL like: `https://main.d1a2b3c4d5e6f7.amplifyapp.com`

### Step 4: Enable Continuous Deployment

Amplify is now connected to your GitHub! Every time you push to `main`:
- Automatically triggers a build
- Runs tests (if configured)
- Deploys to production
- Zero downtime deployments

---

## 🎯 Testing Your Deployment

1. **Visit your Amplify URL**:
   - Go to the URL provided by Amplify Console
   - Example: `https://main.d1a2b3c4d5e6f7.amplifyapp.com`

2. **Test the app**:
   - Navigate to "Image Pricer" page
   - You should see a sign-in form
   - Create an account with your email
   - Upload an image and add price tags
   - Click "Save to Cloud"
   - Your data is now stored in AWS!

3. **Test persistence**:
   - Sign out and sign back in
   - Your saved projects should appear
   - Load a project to verify S3 image retrieval works

---

## 🔧 Configuration & Customization

### Custom Domain

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. SSL certificate automatically provisioned

### Environment Variables

To add environment variables:
1. Go to Amplify Console → Your App
2. Click "Environment variables"
3. Add key-value pairs
4. Redeploy

### Branch Deployments

Deploy multiple environments:
```bash
amplify env add staging
amplify push
```

Then connect the `staging` branch in Amplify Console.

---

## 💰 Cost Estimation

With AWS Free Tier (first 12 months):

| Service | Free Tier | After Free Tier (estimated) |
|---------|-----------|---------------------------|
| **Cognito** | 50,000 MAU | $0.0055/MAU |
| **AppSync** | 250,000 requests | $4.00/million requests |
| **DynamoDB** | 25 GB storage | $0.25/GB |
| **S3** | 5 GB storage | $0.023/GB |
| **Lambda** | 1M requests | $0.20/million requests |
| **Amplify Hosting** | 1,000 build minutes | $0.01/build minute |
| **Data Transfer** | 15 GB | $0.09/GB |

**Expected Monthly Cost** (after free tier, with 100 users):
- **Light usage**: $0-5/month
- **Medium usage** (1000 users): $10-20/month
- **Heavy usage** (10k users): $50-100/month

---

## 🛠️ Common Commands

```bash
# Check backend status
amplify status

# Push backend changes
amplify push

# Pull backend environment
amplify pull

# Open Amplify Console
amplify console

# Add new environment
amplify env add production

# Delete backend (CAREFUL!)
amplify delete
```

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution**: Make sure all dependencies are installed:
```bash
npm install
```

### Issue: Amplify push fails

**Solution**: Check AWS credentials:
```bash
amplify configure
```

### Issue: GraphQL errors in console

**Solution**: Regenerate API code:
```bash
amplify codegen
```

### Issue: Images not uploading

**Solution**: Check S3 permissions in Amplify Console → Storage

### Issue: Users can't sign in

**Solution**: 
1. Check Cognito User Pool is created
2. Verify email configuration in Cognito
3. Check browser console for detailed errors

---

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [GraphQL API Guide](https://docs.amplify.aws/cli/graphql/overview/)
- [Storage Guide](https://docs.amplify.aws/lib/storage/getting-started/)
- [Authentication Guide](https://docs.amplify.aws/lib/auth/getting-started/)
- [Amplify Console Guide](https://docs.aws.amazon.com/amplify/latest/userguide/)

---

## 🎉 You're Done!

Your app is now:
- ✅ Deployed to AWS with serverless backend
- ✅ Auto-deploying from GitHub
- ✅ Secured with user authentication
- ✅ Storing images in S3
- ✅ Saving data to DynamoDB
- ✅ Accessible via HTTPS
- ✅ Scalable to millions of users

Share your deployed URL and start pricing items! 🚀

---

## 🔐 Security Notes

1. **Never commit** `aws-exports.js` to public repositories (it's in `.gitignore`)
2. **Use environment variables** for sensitive data
3. **Enable MFA** on your AWS root account
4. **Review IAM permissions** regularly
5. **Enable CloudTrail** for audit logging
6. **Set up billing alerts** in AWS Console

---

## 📱 Next Steps

Consider adding:
- [ ] Email notifications when items are shared
- [ ] Social sharing (Twitter, Facebook)
- [ ] PDF export of priced images
- [ ] AI-powered price suggestions
- [ ] Public gallery of priced images
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

---

Need help? Check the AWS Amplify Discord or create an issue on GitHub!

