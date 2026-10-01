# Zugee Platform - Navigation Guide

## Quick Access URLs

### 🌐 Marketing Site
- **Homepage**: http://localhost:3000
  - Hero section
  - Products showcase
  - Pricing plans
  - Contact form

### 🔧 Admin Portal
- **Admin Login**: http://localhost:3000/admin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Subscriptions**: http://localhost:3000/admin/subscriptions

## Navigation Components

### Marketing Site Navbar
Located in: `components/layout/Navbar.jsx`

Navigation items (all scroll within the homepage):
- Products
- How it works
- Pricing
- FAQ
- Book a Demo

### Admin Portal Nav
Located in: `components/admin/AdminNav.jsx`

Navigation items:
- Dashboard
- Subscriptions

## User Flows

### Visitor Books a Demo
1. Visit homepage → Click "Book a Demo" or a plan's "Get Started"
2. Fill in the contact form
3. The team follows up by phone or WhatsApp; the lead appears in `/admin/dashboard`

There is no customer sign-in on this site. Each ZUGEE product has its own login.

### Admin Access
1. Visit `/admin`
2. Enter admin credentials (from .env.local)
3. Access admin dashboard and subscriptions

## Protected Route Behavior

### Admin Routes (`/admin/dashboard/*`)
- **No admin session**: Redirect to `/admin` (login)
- **Valid session**: Show admin interface

## Deep Linking

All routes support direct URL access:
- ✅ A signed-in admin can bookmark any admin page
- ✅ Without an admin session, admin pages redirect to `/admin`
- ✅ Auth state is checked server-side (no flash of wrong content)

## Development Tips

### Testing Routes
1. **Marketing site**: Just visit http://localhost:3000
2. **Admin portal**:
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
