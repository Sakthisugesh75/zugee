// components/app/crm/AdIntegrations.jsx
"use client";

import { useState, useEffect } from 'react';
import { ExternalLink, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdIntegrations() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/app/crm/ad-accounts');
      const data = await response.json();

      if (data.success) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Failed to fetch ad accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform) => {
    try {
      setConnecting(platform);

      const response = await fetch('/api/app/crm/ad-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });

      const data = await response.json();

      if (data.success && data.oauthUrl) {
        // Open OAuth URL in popup or redirect
        // For now, just show a message
        alert(`OAuth integration will be fully implemented in task #10.\n\nWould redirect to: ${data.oauthUrl}`);
      }
    } catch (error) {
      console.error('Failed to initiate OAuth:', error);
      alert('Failed to connect ad account');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!confirm('Are you sure you want to disconnect this ad account?')) {
      return;
    }

    try {
      const response = await fetch(`/api/app/crm/ad-accounts?id=${accountId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setAccounts(accounts.filter(a => a.id !== accountId));
      }
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      alert('Failed to disconnect ad account');
    }
  };

  const getPlatformInfo = (platform) => {
    const info = {
      meta_ads: {
        name: 'Meta Ads',
        icon: '📘',
        color: 'bg-blue-50 border-blue-200 text-blue-700'
      },
      google_ads: {
        name: 'Google Ads',
        icon: '🔍',
        color: 'bg-red-50 border-red-200 text-red-700'
      }
    };
    return info[platform] || info.meta_ads;
  };

  const getSyncStatusInfo = (status) => {
    const info = {
      success: {
        icon: CheckCircle,
        color: 'text-emerald-600',
        label: 'Synced'
      },
      syncing: {
        icon: Loader2,
        color: 'text-blue-600',
        label: 'Syncing...',
        animate: true
      },
      error: {
        icon: AlertCircle,
        color: 'text-red-600',
        label: 'Sync Error'
      },
      pending: {
        icon: AlertCircle,
        color: 'text-amber-600',
        label: 'Pending'
      }
    };
    return info[status] || info.pending;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Ad Integrations</h3>
        <p className="text-xs text-slate-600 mt-1">
          Connect your ad accounts to sync leads automatically
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Connected Accounts */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#1B6FF8] animate-spin" />
          </div>
        ) : accounts.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Connected Accounts
            </h4>
            {accounts.map((account) => {
              const platformInfo = getPlatformInfo(account.platform);
              const syncInfo = getSyncStatusInfo(account.sync_status);
              const SyncIcon = syncInfo.icon;

              return (
                <div
                  key={account.id}
                  className={`p-3 rounded-lg border ${platformInfo.color}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platformInfo.icon}</span>
                      <div>
                        <h5 className="text-sm font-semibold">
                          {account.account_name || platformInfo.name}
                        </h5>
                        <p className="text-xs opacity-75">
                          {platformInfo.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisconnect(account.id)}
                      className="p-1 hover:bg-white/50 rounded transition-colors"
                      title="Disconnect"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <SyncIcon 
                      className={`w-3.5 h-3.5 ${syncInfo.color} ${syncInfo.animate ? 'animate-spin' : ''}`} 
                    />
                    <span className="opacity-75">{syncInfo.label}</span>
                    {account.last_sync_at && (
                      <span className="opacity-60">
                        • {new Date(account.last_sync_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Connect New Accounts */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {accounts.length > 0 ? 'Add More' : 'Connect Your First Account'}
          </h4>

          {/* Meta Ads */}
          {!accounts.some(a => a.platform === 'meta_ads') && (
            <button
              onClick={() => handleConnect('meta_ads')}
              disabled={connecting === 'meta_ads'}
              className="w-full p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📘</span>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-blue-900">
                    Connect Meta Ads
                  </h5>
                  <p className="text-xs text-blue-700">
                    Facebook & Instagram ad campaigns
                  </p>
                </div>
                {connecting === 'meta_ads' ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                )}
              </div>
            </button>
          )}

          {/* Google Ads */}
          {!accounts.some(a => a.platform === 'google_ads') && (
            <button
              onClick={() => handleConnect('google_ads')}
              disabled={connecting === 'google_ads'}
              className="w-full p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-red-900">
                    Connect Google Ads
                  </h5>
                  <p className="text-xs text-red-700">
                    Google Search & Display campaigns
                  </p>
                </div>
                {connecting === 'google_ads' ? (
                  <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-red-600" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-600 text-center">
          Standard OAuth connection. No partner certification required.
        </p>
      </div>
    </div>
  );
}
