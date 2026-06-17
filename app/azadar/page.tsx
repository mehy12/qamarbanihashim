'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface Donation {
  id: string;
  name: string;
  phone: string;
  amount: number;
  paymentMethod: string | null;
  utr: string | null;
  screenshotBase64: string | null;
  status: string;
  createdAt: string;
}

interface DashboardData {
  donations: Donation[];
  totalRaised: number;
  donorCount: number;
}

// ─── PIN GATE ────────────────────────────────────────────────────────
function PinGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (pin === '0423') {
      sessionStorage.setItem('admin_auth', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C8A45D] to-[#8B6914] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#070707]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-cinzel text-2xl text-[#F5F1E8] mb-1">Admin Access</h1>
          <p className="text-white/40 text-sm">Enter PIN to continue</p>
        </div>

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="relative mb-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={handleKeyDown}
              placeholder="● ● ● ●"
              className="w-full text-center text-2xl tracking-[0.5em] bg-[#0d0d0d] border border-[rgba(200,164,93,0.2)] rounded-xl px-6 py-4 text-[#F5F1E8] placeholder:text-white/15 focus:outline-none focus:border-[#C8A45D] transition-colors"
              autoFocus
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red-400 text-sm text-center mb-4"
              >
                The webview is under maintainence. Please try again later!
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A45D] to-[#8B6914] text-[#070707] font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Unlock Dashboard
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── STATS CARD ──────────────────────────────────────────────────────
function StatCard({ label, value, accent = false, delay = 0 }: { label: string; value: string | number; accent?: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#0d0d0d] border border-[rgba(200,164,93,0.15)] rounded-2xl p-6"
    >
      <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${accent ? 'text-[#C8A45D]' : 'text-[#F5F1E8]'}`}>
        {value}
      </p>
    </motion.div>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isPending = status === 'pending';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isPending
        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-400' : 'bg-emerald-400'}`} />
      {status}
    </span>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────
function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/donations?pin=0423');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return;
    try {
      const res = await fetch(`/api/donations?pin=0423&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchData();
    } catch (err) {
      alert('Failed to delete donation');
      console.error(err);
    }
  };

  const todayCount = data?.donations.filter((d) => {
    const donationDate = new Date(d.createdAt).toDateString();
    return donationDate === new Date().toDateString();
  }).length ?? 0;

  // ── Export CSV ──
  const exportCSV = () => {
    if (!data?.donations.length) return;
    const headers = ['Name', 'Phone', 'Amount', 'Method', 'UTR', 'Status', 'Date'];
    const rows = data.donations.map((d) => [
      d.name,
      d.phone,
      d.amount.toString(),
      d.paymentMethod || 'online',
      d.utr || '',
      d.status,
      new Date(d.createdAt).toLocaleString('en-IN'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export Excel ──
  const exportExcel = async () => {
    if (!data?.donations.length) return;
    try {
      const XLSX = await import('xlsx');
      const wsData = data.donations.map((d) => ({
        Name: d.name,
        Phone: d.phone,
        Amount: d.amount,
        Method: d.paymentMethod || 'online',
        UTR: d.utr || '',
        Status: d.status,
        Date: new Date(d.createdAt).toLocaleString('en-IN'),
      }));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Donations');
      XLSX.writeFile(wb, `donations_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      alert('Excel export failed. Make sure xlsx is installed.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' as const }}
          className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-[#C8A45D] text-[#070707] rounded-lg text-sm font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F1E8]">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl text-[#F5F1E8]">Admin Dashboard</h1>
            <p className="text-white/30 text-xs mt-0.5">Qamar E Bani Hashim</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 rounded-lg border border-white/10 hover:border-[#C8A45D]/30 transition-colors group"
              title="Refresh"
            >
              <svg className="w-4 h-4 text-white/40 group-hover:text-[#C8A45D] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/40 text-xs hover:text-red-400 hover:border-red-400/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Collection" value={formatCurrency(data?.totalRaised ?? 0)} accent delay={0} />
          <StatCard label="Total Donors" value={data?.donorCount ?? 0} delay={0.1} />
          <StatCard label="Today's Donations" value={todayCount} delay={0.2} />
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cinzel text-lg text-[#F5F1E8]">All Donations</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[rgba(200,164,93,0.15)] text-[#C8A45D] text-xs font-medium hover:border-[#C8A45D]/40 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[rgba(200,164,93,0.15)] text-[#C8A45D] text-xs font-medium hover:border-[#C8A45D]/40 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0d0d0d] border border-[rgba(200,164,93,0.1)] rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Phone</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Method</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">UTR</th>
                  <th className="text-center px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Date</th>
                  <th className="text-center px-5 py-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.donations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-white/20 text-sm">
                      No donations yet
                    </td>
                  </tr>
                )}
                {data?.donations.map((donation, idx) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * Math.min(idx, 20) }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-[#F5F1E8]">{donation.name}</td>
                    <td className="px-5 py-3.5 text-sm text-white/50 font-mono">{donation.phone}</td>
                    <td className="px-5 py-3.5 text-sm text-[#C8A45D] font-semibold text-right">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/40 capitalize">
                      {donation.paymentMethod || 'online'}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/40 font-mono">
                      {donation.utr || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={donation.status} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/30 text-right whitespace-nowrap">
                      {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <br />
                      <span className="text-xs text-white/15">
                        {new Date(donation.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleDelete(donation.id)}
                        className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                        title="Delete entry"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-white/20 text-xs">
          <p>Auto-refreshes every 30 seconds</p>
          <p>{data?.donations.length ?? 0} total entries</p>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE COMPONENT ──────────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth');
    if (stored === 'true') {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' as const }}
          className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!authenticated) {
    return <PinGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
