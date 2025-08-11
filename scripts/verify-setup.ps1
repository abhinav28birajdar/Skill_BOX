# SkillBox Project Verification Script (PowerShell)
# This script verifies that the project setup is complete and working

Write-Host "🚀 SkillBox Project Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Function to check if command exists
function Test-CommandExists {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to print status
function Write-Status {
    param($Message, $Success)
    if ($Success) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message" -ForegroundColor Red
    }
}

# Check prerequisites
Write-Host "`n📋 Checking Prerequisites..." -ForegroundColor Yellow
Write-Host "----------------------------"

$nodeExists = Test-CommandExists "node"
Write-Status "Node.js installed" $nodeExists

$npmExists = Test-CommandExists "npm"
Write-Status "npm installed" $npmExists

$expoExists = Test-CommandExists "expo"
Write-Status "Expo CLI installed" $expoExists

# Check Node.js version
if ($nodeExists) {
    $nodeVersion = node --version
    $nodeVersionNumber = $nodeVersion.Substring(1)
    $requiredVersion = [Version]"18.0.0"
    $currentVersion = [Version]$nodeVersionNumber
    
    if ($currentVersion -ge $requiredVersion) {
        Write-Status "Node.js version ($nodeVersionNumber) is compatible" $true
    } else {
        Write-Status "Node.js version ($nodeVersionNumber) is too old (require 18+)" $false
    }
}

Write-Host "`n📁 Checking Project Structure..." -ForegroundColor Yellow
Write-Host "--------------------------------"

# Check key files
$filesToCheck = @(
    "package.json",
    "app.json",
    "tsconfig.json",
    "tailwind.config.js",
    "database\consolidated_schema.sql",
    "types\database.ts",
    "context\AuthContext.tsx",
    "lib\supabase.ts",
    "app\_layout.tsx",
    "app\(auth)\_layout.tsx"
)

foreach ($file in $filesToCheck) {
    $exists = Test-Path $file
    Write-Status "$file exists" $exists
}

Write-Host "`n🔧 Checking Dependencies..." -ForegroundColor Yellow
Write-Host "---------------------------"

# Check if node_modules exists
$nodeModulesExists = Test-Path "node_modules"
if ($nodeModulesExists) {
    Write-Status "Dependencies installed" $true
} else {
    Write-Status "Dependencies not installed - run 'npm install'" $false
}

Write-Host "`n⚙️ Checking Configuration..." -ForegroundColor Yellow
Write-Host "----------------------------"

# Check .env file
$envExists = Test-Path ".env"
if ($envExists) {
    Write-Status ".env file exists" $true
    
    $envContent = Get-Content ".env" -Raw
    
    # Check for required environment variables
    if ($envContent -match "EXPO_PUBLIC_SUPABASE_URL") {
        Write-Status "Supabase URL configured" $true
    } else {
        Write-Status "Supabase URL not configured" $false
    }
    
    if ($envContent -match "EXPO_PUBLIC_SUPABASE_ANON_KEY") {
        Write-Status "Supabase Anon Key configured" $true
    } else {
        Write-Status "Supabase Anon Key not configured" $false
    }
} else {
    Write-Status ".env file missing - create from .env.example" $false
}

Write-Host "`n📱 Project Status Summary" -ForegroundColor Yellow
Write-Host "========================"

# Check if TypeScript compiles
Write-Host "🔍 Checking TypeScript compilation..."
if (Test-CommandExists "npx") {
    try {
        $null = npx tsc --noEmit 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "TypeScript compilation successful" $true
        } else {
            Write-Status "TypeScript compilation has errors" $false
        }
    } catch {
        Write-Status "TypeScript compilation check failed" $false
    }
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure all prerequisites are installed"
Write-Host "2. Configure your .env file with Supabase credentials"
Write-Host "3. Run 'npm install' if dependencies are missing"
Write-Host "4. Run 'npm start' to begin development"
Write-Host "5. Set up the database using database/consolidated_schema.sql"

Write-Host "`n📚 Additional Resources:" -ForegroundColor Cyan
Write-Host "- README.md for detailed setup instructions"
Write-Host "- database/consolidated_schema.sql for database setup"
Write-Host "- Supabase dashboard for backend configuration"

Write-Host "`n✨ Project verification complete!" -ForegroundColor Green
