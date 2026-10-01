# Zugee Platform - Route Structure

## Marketing Site Routes (Public)
These routes use the `(marketing)` route group layout with Navbar and Footer.

- `/` - Homepage (Hero, Products, Pricing, Contact)

There is no customer application in this repo. Each ZUGEE product has its own codebase, login and
database; the former `/app/*` pages and `/api/app/*` routes were removed on 2026-10-01.

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
└── api/                # API endpoints
    ├── leads/
    └── admin/
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

## Notes

1. **Route Groups**: Parentheses `()` in folder names create route groups that don't affect the URL path but allow different layouts.

2. **Authentication Flow**: Admin: `/admin` → `/admin/dashboard`

3. **Protected Routes**: Use server-side session checks in layout.jsx to redirect unauthenticated users.

4. **No Nested HTML**: Only the root layout (`app/layout.jsx`) has `<html>` and `<body>` tags.

5. **Metadata**: Each layout/page defines its own metadata which merges with parent metadata.
