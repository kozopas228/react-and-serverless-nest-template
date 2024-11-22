#!/bin/bash

# Stop script in case of error
set -e

echo "➡️  Running nest build..."
nest build --webpack

echo "➡️  Deploying Serverless..."
sls deploy --stage production

echo "🎉  Deploy has been successfully finished!"
