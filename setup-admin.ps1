# ZUGEE Admin Portal Setup Script
# Run this script to quickly set up admin credentials

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "ZUGEE Admin Portal Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "WARNING: .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to update it? (y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Get admin password
Write-Host "Step 1: Set Admin Password" -ForegroundColor Green
Write-Host "Password must be at least 12 characters long" -ForegroundColor Gray
$adminPassword = Read-Host "Enter admin password"

if ($adminPassword.Length -lt 12) {
    Write-Host "ERROR: Password must be at least 12 characters!" -ForegroundColor Red
    exit
}

# Generate JWT secret
Write-Host ""
Write-Host "Step 2: Generate JWT Secret" -ForegroundColor Green
Write-Host "Generating secure random JWT secret..." -ForegroundColor Gray

$jwtSecret = node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

if (-not $jwtSecret) {
    Write-Host "ERROR: Failed to generate JWT secret. Make sure Node.js is installed." -ForegroundColor Red
    exit
}

# Create or update .env.local
Write-Host ""
Write-Host "Step 3: Creating .env.local file" -ForegroundColor Green

$envContent = @"
# ZUGEE Platform Environment Variables
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Public site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============================================
# ADMIN PORTAL - REQUIRED FOR ADMIN ACCESS
# ============================================
ADMIN_PASSWORD=$adminPassword
ADMIN_JWT_SECRET=$jwtSecret

# ============================================
# SUPABASE - Required for database operations
# ============================================
# Get these from: https://supabase.com/dashboard/project/_/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ============================================
# OAUTH ENCRYPTION - Required for ad integrations
# ============================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OAUTH_ENCRYPTION_SECRET=

# ============================================
# META ADS OAUTH - Required for Meta/Facebook Ads
# ============================================
# Get these from: https://developers.facebook.com/apps/
META_APP_ID=
META_APP_SECRET=

# ============================================
# GOOGLE ADS OAUTH - Required for Google Ads
# ============================================
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_ADS_DEVELOPER_TOKEN=

# ============================================
# AI INSIGHTS COMPUTATION
# ============================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
INSIGHTS_COMPUTE_SECRET=
"@

Set-Content -Path ".env.local" -Value $envContent

Write-Host "✓ .env.local created successfully!" -ForegroundColor Green
Write-Host ""

# Show summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor Green
Write-Host "  Password: $adminPassword" -ForegroundColor White
Write-Host ""
Write-Host "JWT Secret:" -ForegroundColor Green
Write-Host "  $jwtSecret" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your development server (npm run dev)" -ForegroundColor White
Write-Host "  2. Navigate to: http://localhost:3000/admin" -ForegroundColor White
Write-Host "  3. Login with your password" -ForegroundColor White
Write-Host ""
Write-Host "Optional: Configure Supabase and other services in .env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env.local to git!" -ForegroundColor Red
Write-Host ""
