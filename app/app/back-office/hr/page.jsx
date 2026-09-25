// app/app/back-office/hr/page.jsx
import AppPageHeader from '@/components/app/AppPageHeader';
import ComingSoon from '@/components/app/ComingSoon';
import { UsersRound } from 'lucide-react';

export const metadata = {
  title: 'Employees'
};

export default function EmployeesPage() {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="Employees"
        description="Staff records"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Employees' }
        ]}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          <ComingSoon
            icon={UsersRound}
            title="Employees"
            description="Keep your staff records in one place, with attendance and payroll to follow."
          />
        </div>
      </div>
    </div>
  );
}
