# Build App
./node_modules/.bin/vue-cli-service build --mode production --dest dist --target app

# Deploy to S3
node node_modules/s3-deploy/bin/s3-deploy './dist/**' --cwd './dist/' --region us-east-1 --bucket okkindredui --profile default --deleteRemoved

# Invalidate cliudfront cache
cloudfront-invalidate-cache --cname www.okkindred.com