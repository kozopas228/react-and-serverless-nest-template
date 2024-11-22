#!/bin/bash

# Stop script in case of error
set -e

# Variables for bucket and distribution
STACK_NAME="react-and-serverless-nest-template-static-frontend-stack" # <change> to yours
TEMPLATE_FILE="cloudformation.yml"
BUILD_DIR="dist"
# Run npm build
echo "➡️  Running npm run build..."
npm run build

# Check whether build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Directory $BUILD_DIR not found. Try 'npm run build' before launch."
  exit 1
fi

# Deploy CloudFormation template to create S3 bucket and CloudFront distribution
echo "➡️  Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file $TEMPLATE_FILE \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_NAMED_IAM

# Get the created S3 bucket name and CloudFront distribution ID
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" --output text)
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text)

echo "➡️  Loading files to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html"
aws s3 cp $BUILD_DIR/index.html s3://$BUCKET_NAME/index.html --cache-control "no-cache"

echo "✅  Files have been successfully loaded to S3."

echo "➡️  Updating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text

echo "✅  CloudFront has been updated."

# Get CloudFront Domain Name
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" --output text)

if [ -z "$CLOUDFRONT_URL" ]; then
  echo "❌  Could not retrieve CloudFront URL. Check your CloudFormation Outputs."
else
  echo "🎉  Your site is live at: https://$CLOUDFRONT_URL"
fi

echo "🎉  Deploy has been successfully finished!"
