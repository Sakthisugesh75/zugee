// components/app/LoadingSpinner.jsx
// Loading spinner component for app screens

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ 
  size = 'md', 
  text,
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-[#1B6FF8] animate-spin`} />
      {text && (
        <p className="text-sm text-slate-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        {content}
      </div>
    );
  }

  return content;
}
