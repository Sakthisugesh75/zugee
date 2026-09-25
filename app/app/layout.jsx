// app/app/layout.jsx
// Root layout for the Zugee PRODUCT APPLICATION (customer-facing dashboard)
// This is SEPARATE from the marketing site layout

export const metadata = {
  title: {
    default: 'Zugee Dashboard',
    template: '%s | Zugee Dashboard'
  },
  description: 'Zugee business management dashboard',
  robots: {
    index: false,
    follow: false
  }
};

export default function AppLayout({ children }) {
  // Children will be either:
  // 1. Auth pages (handled by their own layout)
  // 2. Dashboard pages (wrapped by (dashboard)/layout.jsx)
  return children;
}
