#!/bin/bash
echo "🔍 Checking deployment size for Vercel..."

# Calculate size excluding ignored files
total_size=$(find . -type f \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  ! -path "./dist/*" \
  ! -path "./.next/cache/*" \
  ! -path "./.next/standalone/*" \
  ! -name "*.log" \
  ! -name "*.exe" \
  ! -name "*.asar" \
  ! -name "*.pack" \
  -exec du -b {} + | awk '{sum += $1} END {print sum}')

size_mb=$((total_size / 1024 / 1024))

echo "📦 Deployable project size: ${size_mb} MB"

if [ $size_mb -lt 100 ]; then
    echo "✅ Size OK for Vercel deployment (under 100MB limit)"
else
    echo "❌ Size too large for Vercel deployment (over 100MB limit)"
    echo "🔍 Large files:"
    find . -type f -size +10M \
      ! -path "./node_modules/*" \
      ! -path "./.git/*" \
      ! -path "./dist/*" \
      -exec ls -lh {} +
fi
