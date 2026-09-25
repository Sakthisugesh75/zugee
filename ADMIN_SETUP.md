# ZUGEE Admin Portal - Quick Setup

## 🚀 Quick Start (Automated)

Run the PowerShell setup script:

```powershell
.\setup-admin.ps1
```

This will:
1. Prompt you for an admin password
2. Generate a secure JWT secret automatically
3. Create `.env.local` with admin credentials
4. Show you the next steps

## 📝 Manual Setup

If you prefer manual setup:

### 1. Create `.env.local`

```powershell
Copy-Item .env.example .env.local
```

### 2. Edit `.env.local`

Add these values:

```env
ADMIN_PASSWORD=your_secure_password_min_12_chars
ADMIN_JWT_SECRET=your_jwt_secret_min_32_chars
```

### 3. Generate JWT Secret

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 🔐 Access Admin Portal

### 1. Restart Server
```powershell
npm run dev
```

### 2. Navigate to Admin Login
```
http://localhost:3000/admin
```

### 3. Enter Password
Use the password you set in `ADMIN_PASSWORD`

### 4. Access Admin Routes
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Subscriptions**: http://localhost:3000/admin/subscriptions

## 📋 Admin Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/admin` | Admin login page | No |
| `/admin/dashboard` | Lead queue management | Yes |
| `/admin/subscriptions` | Subscription manager | Yes |

## ⚠️ Important Notes

- ✅ `.env.local` is in `.gitignore` (never commit it!)
- ✅ Minimum 12 characters for admin password
- ✅ Minimum 32 characters for JWT secret
- ✅ Rotating JWT secret logs out all admin sessions
- ⚠️ Admin portal is separate from customer authentication

## 🔧 Troubleshooting

### Can't login?
- Check `ADMIN_PASSWORD` in `.env.local` matches what you're entering
- Restart dev server after adding `.env.local`

### Redirected after login?
- Check `ADMIN_JWT_SECRET` is set and at least 32 characters
- Clear browser cookies and try again

### Need Supabase for full features?
The admin portal works without Supabase, but for lead management you'll need:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🎯 Current Status

Check if admin is configured:
```powershell
Test-Path .env.local
```

If `False`, run `.\setup-admin.ps1` to configure.

## 📚 Full Documentation

See `.env.example` for all available configuration options.
