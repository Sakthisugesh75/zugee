// components/app/AppPageHeader.jsx
// Reusable page header component for app screens

export default function AppPageHeader({ 
  title, 
  description, 
  actions,
  breadcrumbs 
}) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-8 py-6">
        {/* Breadcrumbs (optional) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm mb-3">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-400">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Header Content */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{description}</p>
            )}
          </div>

          {/* Action Buttons */}
          {actions && (
            <div className="flex items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
