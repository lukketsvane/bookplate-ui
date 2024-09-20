#!/bin/bash

# Add all changes
git add .

# Commit changes with a message
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Push to the main branch
git push origin main

# Deploy to Vercel
npm run deploy