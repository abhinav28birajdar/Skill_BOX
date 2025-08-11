# PowerShell script to fix variant issues in SkillBox project

# Function to replace "outlined" with "outline" in Card components
function Fix-CardVariants {
    Write-Host "Fixing Card variant issues..."
    $files = Get-ChildItem -Path ".\app" -Recurse -Filter "*.tsx"
    foreach ($file in $files) {
        (Get-Content $file.FullName) -replace 'variant="outlined"', 'variant="outline"' | Set-Content $file.FullName
    }
    Write-Host "Card variants fixed."
}

# Function to remove variant property from TouchableCard components
function Fix-TouchableCardVariants {
    Write-Host "Fixing TouchableCard issues..."
    $files = Get-ChildItem -Path ".\app" -Recurse -Filter "*.tsx"
    foreach ($file in $files) {
        (Get-Content $file.FullName) -replace '<TouchableCard variant="outlined"', '<TouchableCard' | Set-Content $file.FullName
    }
    Write-Host "TouchableCard variants fixed."
}

# Function to add missing imports
function Add-TouchableCardImports {
    Write-Host "Adding missing TouchableCard imports..."
    $filePaths = @(
        ".\app\(creator)\content.tsx",
        ".\app\(creator)\courses.tsx",
        ".\app\(creator)\index.tsx",
        ".\app\(tabs)\learning.tsx"
    )
    
    foreach ($filePath in $filePaths) {
        if (Test-Path $filePath) {
            $content = Get-Content $filePath
            if ($content -notcontains "import TouchableCard from '@/components/common/TouchableCard';") {
                $importLine = "import TouchableCard from '@/components/common/TouchableCard';"
                $newContent = @($importLine) + $content
                Set-Content -Path $filePath -Value $newContent
            }
            Write-Host "Added import to $filePath"
        }
        else {
            Write-Host "File not found: $filePath"
        }
    }
}

# Main execution
Write-Host "SkillBox Project Fixer"
Write-Host "======================"

# Run fixes
Fix-CardVariants
Fix-TouchableCardVariants
Add-TouchableCardImports

Write-Host "Fixes complete! Please run 'npx tsc --noEmit' to verify remaining issues."
