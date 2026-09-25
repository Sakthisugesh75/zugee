// app/app/auth/layout.jsx
// Special layout for auth pages - no sidebar/topbar
export const metadata = {
  title: {
    default: 'Authentication',
    template: '%s | Zugee'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthLayout({ children }) {
  // Auth pages handle their own full-page layout
  // This bypasses the main app layout (sidebar + topbar)
  return children;
}
