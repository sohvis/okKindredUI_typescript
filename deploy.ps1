# Build App
npm run build

# Deploy to S3
node node_modules/s3-deploy/bin/s3-deploy './dist/**' --cwd './dist/' --region us-east-1 --bucket okkindredui --profile default --deleteRemoved

# Invalidate cloudfront cache
npx cloudfront-invalidate-cache --cname www.okkindred.com
