#!/bin/bash

# SkillBox Project Verification Script
# This script verifies that the project setup is complete and working

echo "🚀 SkillBox Project Verification"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ "$2" -eq 0 ]; then
        echo -e "✅ ${GREEN}$1${NC}"
    else
        echo -e "❌ ${RED}$1${NC}"
    fi
}

# Check prerequisites
echo "📋 Checking Prerequisites..."
echo "----------------------------"

command_exists node
print_status "Node.js installed" $?

command_exists npm
print_status "npm installed" $?

command_exists expo
print_status "Expo CLI installed" $?

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node --version | cut -c2-)
    REQUIRED_VERSION="18.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        print_status "Node.js version ($NODE_VERSION) is compatible" 0
    else
        print_status "Node.js version ($NODE_VERSION) is too old (require 18+)" 1
    fi
fi

echo ""
echo "📁 Checking Project Structure..."
echo "--------------------------------"

# Check key files
files_to_check=(
    "package.json"
    "app.json"
    "tsconfig.json"
    "tailwind.config.js"
    "database/consolidated_schema.sql"
    "types/database.ts"
    "context/AuthContext.tsx"
    "lib/supabase.ts"
    "app/_layout.tsx"
    "app/(auth)/_layout.tsx"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists" 0
    else
        print_status "$file missing" 1
    fi
done

echo ""
echo "🔧 Checking Dependencies..."
echo "---------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status "Dependencies installed" 0
else
    print_status "Dependencies not installed - run 'npm install'" 1
fi

echo ""
echo "⚙️ Checking Configuration..."
echo "----------------------------"

# Check .env file
if [ -f ".env" ]; then
    print_status ".env file exists" 0
    
    # Check for required environment variables
    if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
        print_status "Supabase URL configured" 0
    else
        print_status "Supabase URL not configured" 1
    fi
    
    if grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
        print_status "Supabase Anon Key configured" 0
    else
        print_status "Supabase Anon Key not configured" 1
    fi
else
    print_status ".env file missing - create from .env.example" 1
fi

echo ""
echo "📱 Project Status Summary"
echo "========================"

# Check if TypeScript compiles
echo "🔍 Checking TypeScript compilation..."
if command_exists npx; then
    if npx tsc --noEmit > /dev/null 2>&1; then
        print_status "TypeScript compilation successful" 0
    else
        print_status "TypeScript compilation has errors" 1
    fi
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Ensure all prerequisites are installed"
echo "2. Configure your .env file with Supabase credentials"
echo "3. Run 'npm install' if dependencies are missing"
echo "4. Run 'npm start' to begin development"
echo "5. Set up the database using database/consolidated_schema.sql"

echo ""
echo "📚 Additional Resources:"
echo "- README.md for detailed setup instructions"
echo "- database/consolidated_schema.sql for database setup"
echo "- Supabase dashboard for backend configuration"

echo ""
echo "✨ Project verification complete!"
