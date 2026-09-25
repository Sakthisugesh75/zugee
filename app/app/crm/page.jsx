// app/app/crm/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import LeadList from '@/components/app/crm/LeadList';
import LeadDetail from '@/components/app/crm/LeadDetail';

async function fetchLeads({ searchQuery, filterStatus }, signal) {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);
  if (filterStatus !== 'all') params.append('status', filterStatus);

  const response = await fetch(`/api/app/crm/leads?${params.toString()}`, { signal });
  return response.json();
}

export default function CRMPage() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Loads leads for the current search/filter. Stale requests are aborted so an
  // older, slower response can never overwrite a newer one.
  useEffect(() => {
    const controller = new AbortController();

    fetchLeads({ searchQuery, filterStatus }, controller.signal)
      .then((data) => {
        if (data.success) {
          setLeads(data.leads);
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch leads:', error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [searchQuery, filterStatus]);

  const handleSearchChange = (value) => {
    setLoading(true);
    setSearchQuery(value);
  };

  const handleFilterChange = (value) => {
    setLoading(true);
    setFilterStatus(value);
  };

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
  };

  const handleLeadUpdate = async (updatedLead) => {
    // Update the lead in the list
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <AppPageHeader
        title="CRM"
        description="Track your leads and follow-ups"
      />

      {/* Content - two columns on xl, stacked below that */}
      <div className="flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
        <div className="max-w-[1600px] mx-auto p-8 xl:h-full">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:h-full">
            {/* Left Column - Lead List */}
            <div className="xl:col-span-4 h-[560px] xl:h-auto xl:min-h-0 overflow-hidden">
              <LeadList
                leads={leads}
                loading={loading}
                selectedLead={selectedLead}
                onSelectLead={handleLeadSelect}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filterStatus={filterStatus}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Right Column - Lead Detail (keyed so the form resets when the lead changes) */}
            <div className="xl:col-span-8 h-[640px] xl:h-auto xl:min-h-0 overflow-hidden">
              <LeadDetail
                key={selectedLead?.id || 'none'}
                lead={selectedLead}
                onUpdate={handleLeadUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
