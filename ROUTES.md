# Zugee Platform - Route Structure

## Marketing Site Routes (Public)
These routes use the `(marketing)` route group layout with Navbar and Footer.

- `/` - Homepage (Hero, Products, Pricing, Contact)

## Customer Application Routes (`/app/*`)
Customer-facing business management dashboard.

### Public Routes (No Auth Required)
- `/app/auth` - Sign in / Sign up / Magic link / Reset password
- `/app/auth/callback` - OAuth callback handler

### Protected Routes (Auth Required)
All routes below require authentication and use the `(dashboard)` layout with sidebar and topbar.

- `/app/dashboard` - Main dashboard with KPIs and overview
- `/app/crm` - Lead management (view, filter, edit leads)
- `/app/ads` - Ad integrations (Meta, Google) - Coming Soon
- `/app/gst` - GST filing and compliance - Coming Soon
- `/app/reports` - Business reports and analytics - Coming Soon
- `/app/back-office/billing` - Billing management - Coming Soon
- `/app/back-office/erp` - ERP functionality - Coming Soon
- `/app/back-office/hr` - HR management - Coming Soon

## Admin Portal Routes (`/admin/*`)
Internal administrative portal for managing subscriptions and leads.

### Public Admin Routes
- `/admin` - Admin login page

### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard (lead queue)
- `/admin/subscriptions` - Subscription management

## API Routes

### Public API
- `POST /api/leads` - Marketing lead submission (rate-limited)

### Admin API
- `POST /api/admin/auth` - Admin authentication
- `GET /api/admin/leads` - Fetch all leads
- `GET /api/admin/subscriptions` - Fetch all subscriptions
- `GET /api/admin/subscriptions/[id]` - Get subscription details
- `PATCH /api/admin/subscriptions/[id]` - Update subscription

### Customer API (Protected)
- `POST /api/app/auth/signin` - Customer sign in
- `POST /api/app/auth/signup` - Customer sign up
- `POST /api/app/auth/signout` - Customer sign out
- `POST /api/app/auth/magic-link` - Request magic link
- `POST /api/app/auth/reset-password` - Reset password
- `GET /api/app/dashboard` - Dashboard data
- `GET /api/app/crm/leads` - Customer's leads

## Route Group Structure

```
app/
├── (marketing)/          # Public marketing site
│   ├── layout.jsx       # Navbar + Footer
│   └── page.jsx         # Homepage
│
├── admin/               # Admin portal
│   ├── layout.jsx      # Basic admin layout
│   ├── page.jsx        # Login page
│   └── dashboard/      # Protected admin pages
│       ├── layout.jsx  # Auth gate
│       └── page.jsx    # Admin dashboard
│
├── app/                # Customer application
│   ├── layout.jsx      # Base app layout
│   ├── auth/           # Authentication pages
│   │   ├── layout.jsx  # Auth-specific layout
│   │   └── page.jsx    # Sign in/up page
│   │
│   └── (dashboard)/    # Protected customer pages
│       ├── layout.jsx  # Auth gate + sidebar + topbar
│       ├── dashboard/
│       ├── crm/
│       ├── ads/
│       ├── gst/
│       ├── reports/
│       └── back-office/
│
└── api/                # API endpoints
    ├── leads/
    ├── admin/
    └── app/
```

## Layout Hierarchy

### Marketing Site
```
RootLayout (app/layout.jsx)
└── MarketingLayout (app/(marketing)/layout.jsx)
    └── Page Component
```

### Admin Portal
```
RootLayout (app/layout.jsx)
└── AdminLayout (app/admin/layout.jsx)
    └── AdminDashboardLayout (app/admin/dashboard/layout.jsx) [Protected]
        └── Page Component
```

### Customer Application

**Auth Pages:**
```
RootLayout (app/layout.jsx)
└── AppLayout (app/app/layout.jsx)
    └── AuthLayout (app/app/auth/layout.jsx)
        └── Auth Page Component
```

**Dashboard Pages:**
```
RootLayout (app/layout.jsx)
└── AppLayout (app/app/layout.jsx)
    └── DashboardLayout (app/app/(dashboard)/layout.jsx) [Protected]
        └── Page Component (with Sidebar + Topbar)
```

## Notes

1. **Route Groups**: Parentheses `()` in folder names create route groups that don't affect the URL path but allow different layouts.

2. **Authentication Flow**:
   - Customer: `/app/auth` → `/app/dashboard`
   - Admin: `/admin` → `/admin/dashboard`

3. **Protected Routes**: Use server-side session checks in layout.jsx to redirect unauthenticated users.

4. **No Nested HTML**: Only the root layout (`app/layout.jsx`) has `<html>` and `<body>` tags.

5. **Metadata**: Each layout/page defines its own metadata which merges with parent metadata.
