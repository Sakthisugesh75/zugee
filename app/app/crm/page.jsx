// app/app/crm/page.jsx
"use client";

import { useState, useEffect } from 'react';
import AppPageHeader from '@/components/app/AppPageHeader';
import LeadList from '@/components/app/crm/LeadList';
import LeadDetail from '@/components/app/crm/LeadDetail';
import AdIntegrations from '@/components/app/crm/AdIntegrations';
import { Plus } from 'lucide-react';

export default function CRMPage() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/app/crm/leads?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchQuery, filterStatus]);

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
  };

  const handleLeadUpdate = async (updatedLead) => {
    // Update the lead in the list
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
  };

  const handleAddLead = () => {
    setShowAddLeadModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <AppPageHeader
        title="CRM - Leads & Sales"
        description="Manage your leads and sales pipeline"
        actions={
          <button
            onClick={handleAddLead}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B6FF8] text-white rounded-lg hover:bg-[#1557C7] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        }
      />

      {/* Three-Column Layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left Column - Lead List */}
        <div className="col-span-3 overflow-hidden">
          <LeadList
            leads={leads}
            loading={loading}
            selectedLead={selectedLead}
            onSelectLead={handleLeadSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        {/* Center Column - Lead Detail */}
        <div className="col-span-6 overflow-hidden">
          <LeadDetail
            lead={selectedLead}
            onUpdate={handleLeadUpdate}
            onRefresh={fetchLeads}
          />
        </div>

        {/* Right Column - Ad Integrations */}
        <div className="col-span-3 overflow-hidden">
          <AdIntegrations />
        </div>
      </div>
    </div>
  );
}
