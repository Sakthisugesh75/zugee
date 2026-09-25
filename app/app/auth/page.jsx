// app/app/auth/page.jsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuthForm from '@/components/app/AuthForm';
import MascotLogo from '@/components/ui/MascotLogo';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | Zugee Dashboard',
  description: 'Sign in to your Zugee business dashboard'
};

// Check if user is already authenticated
async function checkAuth() {
  // This will be implemented once we have proper Supabase middleware
  // For now, we'll let the client-side handle redirects
  return false;
}

export default async function AuthPage() {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    redirect('/app/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#06090F] bg-cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="hero-glow-sphere top-1/4 left-1/2 -translate-x-1/2 opacity-50" />
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <Link href="/" className="inline-block mb-8">
            <MascotLogo size={48} showWordmark={true} showSubline={true} />
          </Link>
          
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Business management,{' '}
            <span className="blue-cyan-gradient-text">engineered for precision</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            GST billing, inventory tracking, CRM, and payment follow-ups — all in one unified dashboard.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                <span className="text-[#00F0FF] font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">14-Day Free Trial</h3>
                <p className="text-sm text-slate-400">No credit card required. Cancel anytime.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                <span className="text-[#00F0FF] font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">GST-Native Platform</h3>
                <p className="text-sm text-slate-400">CGST, SGST, IGST calculated automatically on every invoice.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                <span className="text-[#00F0FF] font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">WhatsApp Integration</h3>
                <p className="text-sm text-slate-400">Send invoices and payment reminders from your business number.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md glass-panel p-8 lg:p-10">
            <AuthForm />
          </div>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden text-center -order-1">
          <Link href="/" className="inline-block mb-6">
            <MascotLogo size={36} showWordmark={true} showSubline={false} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-slate-500">
          © 2026 Zugee Systems Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}
