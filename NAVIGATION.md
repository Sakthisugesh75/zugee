# Zugee Platform - Navigation Guide

## Quick Access URLs

### 🌐 Marketing Site
- **Homepage**: http://localhost:3000
  - Hero section
  - Products showcase
  - Pricing plans
  - Contact form

### 👤 Customer Portal
- **Sign In/Up**: http://localhost:3000/app/auth
- **Dashboard**: http://localhost:3000/app/dashboard
- **CRM (Leads)**: http://localhost:3000/app/crm
- **Ad Integrations**: http://localhost:3000/app/ads
- **GST Management**: http://localhost:3000/app/gst
- **Reports**: http://localhost:3000/app/reports
- **Billing**: http://localhost:3000/app/back-office/billing
- **ERP**: http://localhost:3000/app/back-office/erp
- **HR**: http://localhost:3000/app/back-office/hr

### 🔧 Admin Portal
- **Admin Login**: http://localhost:3000/admin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Subscriptions**: http://localhost:3000/admin/subscriptions

## Navigation Components

### Customer Portal Sidebar (AppSidebar)
Located in: `components/app/AppSidebar.jsx`

Navigation items:
- Dashboard
- CRM (Leads)
- Ads
- GST
- Reports
- Back Office (Billing, ERP, HR)

### Marketing Site Navbar
Located in: `components/layout/Navbar.jsx`

Navigation items:
- Products
- Pricing
- Contact
- Sign In (→ `/app/auth`)

### Admin Portal Nav
Located in: `components/admin/AdminNav.jsx`

Navigation items:
- Dashboard
- Subscriptions

## User Flows

### New Customer Sign Up
1. Visit homepage → Click "Get Started" or "Sign In"
2. Redirected to `/app/auth`
3. Sign up with email/password or magic link
4. Redirected to `/app/dashboard`
5. Can navigate to any feature using sidebar

### Returning Customer Sign In
1. Visit `/app/auth` directly or from homepage
2. Sign in with credentials or magic link
3. Redirected to `/app/dashboard`

### Admin Access
1. Visit `/admin`
2. Enter admin credentials (from .env.local)
3. Access admin dashboard and subscriptions

## Protected Route Behavior

### Customer Routes (`/app/*`)
- **Unauthenticated**: Redirect to `/app/auth`
- **Authenticated**: Show sidebar + topbar + page content

### Admin Routes (`/admin/dashboard/*`)
- **No admin session**: Redirect to `/admin` (login)
- **Valid session**: Show admin interface

## Deep Linking

All routes support direct URL access:
- ✅ Authenticated users can bookmark any dashboard page
- ✅ Unauthenticated users are redirected to auth, then back to their intended destination
- ✅ Auth state is checked server-side (no flash of wrong content)

## Development Tips

### Testing Routes
1. **Marketing site**: Just visit http://localhost:3000
2. **Customer portal**: 
   - Need Supabase configured in `.env.local`
   - Or temporarily comment out auth checks in `app/app/(dashboard)/layout.jsx`
3. **Admin portal**:
   - Need `ADMIN_PASSWORD` and `ADMIN_JWT_SECRET` in `.env.local`

### Route Changes
- Adding a new page: Create `page.jsx` in appropriate directory
- Adding a new section: Create folder with `page.jsx`
- Changing layout: Modify the relevant `layout.jsx`
- Next.js auto-detects file changes and hot-reloads

### Common Issues
- **404 on valid route**: Check if `page.jsx` exists (not just a folder)
- **Redirect loop**: Check auth logic in layouts
- **Styles not applying**: Check if parent layout includes globals.css
- **Nested HTML errors**: Only root layout should have `<html>` and `<body>`
