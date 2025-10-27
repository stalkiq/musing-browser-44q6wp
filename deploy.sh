#!/bin/bash
# Quick CloudFront Deployment Script

set -e

BUCKET_NAME="musing-browser-1761587939"
CF_DISTRIBUTION="E2D6K9EYV68PTZ"

echo "🏗️  Building app..."
npm run build

echo "☁️  Uploading to S3..."
aws s3 sync build/ s3://$BUCKET_NAME/ --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp build/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "public, max-age=0, must-revalidate"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CF_DISTRIBUTION \
  --paths "/*" > /dev/null

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site: https://d2czdx2vp1wgh9.cloudfront.net"
echo ""

