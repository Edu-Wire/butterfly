# PowerShell script to remove duplicate AdminSidebar from admin pages

$files = @(
    "app\admin\customers\page.tsx",
    "app\admin\collections\page.tsx", 
    "app\admin\settings\page.tsx",
    "app\admin\income\page.tsx",
    "app\admin\help\page.tsx",
    "app\admin\categories\page.tsx",
    "app\admin\brands\page.tsx",
    "app\admin\analytics\page.tsx",
    "app\admin\products\new\page.tsx",
    "app\admin\products\[id]\page.tsx"
)

foreach ($file in $files) {
    $fullPath = "c:\EDU_wire\butterfly-couture\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        
        # Remove AdminSidebar import
        $content = $content -replace "import\s+\{\s*AdminSidebar\s*\}\s+from\s+'@/components/admin/AdminSidebar'[;\r\n]*", ""
        
        # Remove the flex wrapper div and AdminSidebar component
        $content = $content -replace '<div className="flex min-h-screen[^"]*">\s*<AdminSidebar\s*/>\s*', ''
       $content = $content -replace '<main className="flex-1 lg:ml-0">', '<main className="flex-1">'
        
        # Remove extra closing div before the final closing tag
        $content = $content -replace '</main>\s*</div>\s*\)', '</main>)'
        
        Set-Content $fullPath -Value $content -NoNewline
        
        Write-Host "✓ Fixed: $file" -ForegroundColor Green
    } else {
        Write-Host "✗ Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ All admin pages have been updated!" -ForegroundColor Cyan
