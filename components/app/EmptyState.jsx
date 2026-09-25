// components/app/EmptyState.jsx
// Reusable empty state component for app screens

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="text-center max-w-md">
        {Icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 mb-4">
            <Icon className="w-8 h-8 text-slate-400" />
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-slate-600 mb-6">
            {description}
          </p>
        )}
        
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
