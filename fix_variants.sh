#!/bin/bash
# Script to fix variant issues in SkillBox project

# Function to replace "outlined" with "outline" in Card components
fix_card_variants() {
  echo "Fixing Card variant issues..."
  find ./app -type f -name "*.tsx" -exec sed -i 's/variant="outlined"/variant="outline"/g' {} \;
  echo "Card variants fixed."
}

# Function to remove variant property from TouchableCard components
fix_touchable_card_variants() {
  echo "Fixing TouchableCard issues..."
  find ./app -type f -name "*.tsx" -exec sed -i 's/<TouchableCard variant="outlined"/<TouchableCard/g' {} \;
  echo "TouchableCard variants fixed."
}

# Function to add missing imports
add_touchable_card_imports() {
  echo "Adding missing TouchableCard imports..."
  FILES=(
    "./app/(creator)/content.tsx"
    "./app/(creator)/courses.tsx"
    "./app/(creator)/index.tsx"
    "./app/(tabs)/learning.tsx"
  )
  
  for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
      grep -q "import TouchableCard from '@/components/common/TouchableCard';" "$file" || 
      sed -i '1s/^/import TouchableCard from "@\/components\/common\/TouchableCard";\n/' "$file"
      echo "Added import to $file"
    else
      echo "File not found: $file"
    fi
  done
}

# Main execution
echo "SkillBox Project Fixer"
echo "======================"

# Run fixes
fix_card_variants
fix_touchable_card_variants
add_touchable_card_imports

echo "Fixes complete! Please run 'npx tsc --noEmit' to verify remaining issues."
