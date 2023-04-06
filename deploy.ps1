# Build App
npm run build

# Deploy to S3
node node_modules/s3-deploy/bin/s3-deploy './dist/**' --cwd './dist/' --region us-east-1 --bucket beta.okkindredui --profile default --deleteRemoved

# Invalidate cliudfront cache
cloudfront-invalidate-cache --cname beta.okkindred.com