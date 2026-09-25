// app/app/reports/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import ReportCard from '@/components/app/reports/ReportCard';
import ReportHistory from '@/components/app/reports/ReportHistory';
import LoadingSpinner from '@/components/app/LoadingSpinner';
import { FileText, FileSpreadsheet, BarChart3, Receipt } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});

  // Mock customer ID - in production, get from auth context
  const customerId = 'customer-uuid-here';

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/app/reports?customer_id=${customerId}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType, format, periodStart, periodEnd) => {
    setGenerating(prev => ({ ...prev, [reportType]: true }));

    try {
      const res = await fetch('/api/app/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          report_type: reportType,
          period_start: periodStart,
          period_end: periodEnd,
          format
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Generate download file based on format
        if (format === 'pdf') {
          downloadPDF(data.reportData, reportType);
        } else if (format === 'csv') {
          downloadCSV(data.reportData, reportType);
        }

        // Refresh report history
        fetchReports();
      } else {
        alert('Failed to generate report: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(prev => ({ ...prev, [reportType]: false }));
    }
  };

  const downloadPDF = (reportData, reportType) => {
    // Simple HTML-based PDF generation (in production, use jsPDF or similar)
    const html = generatePDFHTML(reportData, reportType);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFHTML = (data, reportType) => {
    if (reportType === 'daily_business') {
      return `
<!DOCTYPE html>
<html>
<head>
  <title>Daily Business Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #1B6FF8; border-bottom: 3px solid #1B6FF8; padding-bottom: 10px; }
    h2 { color: #334155; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
    th { background-color: #f1f5f9; font-weight: 600; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .metric-value { font-size: 24px; font-weight: bold; color: #0f172a; }
  </style>
</head>
<body>
  <h1>Daily Business Report</h1>
  <p><strong>Period:</strong> ${new Date(data.period.start).toLocaleDateString()} - ${new Date(data.period.end).toLocaleDateString()}</p>
  
  <h2>Summary</h2>
  <div class="metric">
    <div class="metric-label">Total Leads</div>
    <div class="metric-value">${data.summary.totalLeads}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Conversion Rate</div>
    <div class="metric-value">${data.summary.conversionRate}%</div>
  </div>
  <div class="metric">
    <div class="metric-label">Total Revenue</div>
    <div class="metric-value">₹${data.summary.totalRevenue.toLocaleString('en-IN')}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Ad Spend</div>
    <div class="metric-value">₹${data.summary.totalAdSpend.toLocaleString('en-IN')}</div>
  </div>
  <div class="metric">
    <div class="metric-label">ROAS</div>
    <div class="metric-value">${data.summary.roas}x</div>
  </div>

  <h2>Ad Performance</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Total Impressions</td>
      <td>${data.adPerformance.totalImpressions.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Total Clicks</td>
      <td>${data.adPerformance.totalClicks.toLocaleString()}</td>
    </tr>
    <tr>
      <td>CTR</td>
      <td>${data.adPerformance.ctr}%</td>
    </tr>
    <tr>
      <td>Average CPL</td>
      <td>₹${data.adPerformance.avgCpl}</td>
    </tr>
  </table>

  <p style="margin-top: 40px; color: #64748b; font-size: 12px;">
    Generated by ZUGEE Systems Technologies Pvt. Ltd. on ${new Date().toLocaleString('en-IN')}
  </p>
</body>
</html>`;
    }
    return '<html><body><h1>Report</h1></body></html>';
  };

  const downloadCSV = (reportData, reportType) => {
    let csv = '';

    if (reportType === 'monthly_gst_audit') {
      // CSV Header
      csv = 'ZUGEE Monthly GST Audit Report\n';
      csv += `Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}\n`;
      csv += `GST Number: ${reportData.gstConfig.gstNumber}\n`;
      csv += `State: ${reportData.gstConfig.state}\n\n`;

      csv += 'Summary\n';
      csv += 'Metric,Value\n';
      csv += `Total Revenue,₹${reportData.summary.totalRevenue.toLocaleString('en-IN')}\n`;
      csv += `Total Invoices,${reportData.summary.totalInvoices}\n`;
      csv += `CGST,₹${reportData.summary.cgst.toLocaleString('en-IN')}\n`;
      csv += `SGST,₹${reportData.summary.sgst.toLocaleString('en-IN')}\n`;
      csv += `IGST,₹${reportData.summary.igst.toLocaleString('en-IN')}\n`;
      csv += `Total Output Tax,₹${reportData.summary.totalOutputTax.toLocaleString('en-IN')}\n`;
      csv += `Estimated ITC,₹${reportData.summary.estimatedITC.toLocaleString('en-IN')}\n`;
      csv += `Net Tax Payable,₹${reportData.summary.netTaxPayable.toLocaleString('en-IN')}\n\n`;

      csv += 'GST Slab Breakdown\n';
      csv += 'GST Rate,Invoice Count,Total Revenue,Tax Collected\n';
      Object.entries(reportData.slabBreakdown).forEach(([rate, data]) => {
        csv += `${rate},${data.invoiceCount},₹${data.totalRevenue.toLocaleString('en-IN')},₹${data.taxCollected.toLocaleString('en-IN')}\n`;
      });

      csv += '\nInvoice Details\n';
      csv += 'Invoice Number,Date,Customer,Taxable Amount,GST Rate,CGST,SGST,IGST,Total Amount,Status\n';
      reportData.invoices.forEach(inv => {
        csv += `${inv.invoice_number},${new Date(inv.invoice_date).toLocaleDateString()},${inv.customer_name || 'N/A'},₹${inv.taxable_amount || 0},${inv.gst_rate}%,₹${inv.cgst_amount || 0},₹${inv.sgst_amount || 0},₹${inv.igst_amount || 0},₹${inv.total_amount || 0},${inv.payment_status}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (report) => {
    if (report.format === 'pdf') {
      downloadPDF(report.report_data, report.report_type);
    } else if (report.format === 'csv') {
      downloadCSV(report.report_data, report.report_type);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <AppPageHeader
        title="Reports"
        description="Generate business reports, GST audits, and export data"
        breadcrumbs={[
          { label: 'Back Office', href: '/app/dashboard' },
          { label: 'Reports' }
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Report Generation Cards */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Generate Reports</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard
              title="Daily Business Report"
              description="Comprehensive daily performance report with leads, revenue, ad spend, and conversions"
              icon={BarChart3}
              iconColor="blue"
              periodType="date-range"
              format="pdf"
              generating={generating.daily_business}
              onGenerate={() => {
                const today = new Date().toISOString().split('T')[0];
                generateReport('daily_business', 'pdf', today, today);
              }}
            />

            <ReportCard
              title="Monthly GST Audit"
              description="Detailed GST audit report with slab-wise breakdown and invoice details for compliance"
              icon={Receipt}
              iconColor="emerald"
              periodType="month"
              format="csv"
              generating={generating.monthly_gst_audit}
              onGenerate={() => {
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                generateReport('monthly_gst_audit', 'csv', firstDay, lastDay);
              }}
            />
          </div>
        </div>

        {/* Report History */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h2>
          <ReportHistory reports={reports} onDownload={handleDownload} />
        </div>
      </div>
    </div>
  );
}
