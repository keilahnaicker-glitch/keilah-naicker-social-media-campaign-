import React from 'react';
import { SubmissionEntry } from '../types';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Globe,
  FileSpreadsheet,
  Layers,
  Search
} from 'lucide-react';

interface SubmissionHistoryProps {
  submissions: SubmissionEntry[];
  onClearHistory: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  submissions,
  onClearHistory
}) => {
  const [filter, setFilter] = React.useState<'all' | 'virtual' | 'live_script'>('all');
  const [search, setSearch] = React.useState('');

  const filtered = submissions.filter(sub => {
    if (filter !== 'all' && sub.destination !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        sub.fullName.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        sub.campaignName.toLowerCase().includes(q) ||
        sub.platform.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Submission Logs & Payload History</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect past intake requests, payload parameters, and server response logs.
            </p>
          </div>
        </div>

        {submissions.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Logs
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Logs ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('virtual')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'virtual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Virtual ({submissions.filter(s => s.destination === 'virtual').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('live_script')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'live_script' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Live Web App ({submissions.filter(s => s.destination === 'live_script').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Logs List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">No submission records match your filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  {entry.status === 'success' ? (
                    <span className="p-1 bg-emerald-100 text-emerald-700 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 bg-rose-100 text-rose-700 rounded-lg">
                      <XCircle className="w-4 h-4" />
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-slate-900">{entry.campaignName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {entry.platform}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    {entry.destination === 'virtual' ? (
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    {entry.destination === 'virtual' ? 'Virtual Sheet' : 'Apps Script'}
                  </span>
                  <span>•</span>
                  <span>{entry.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Contact:</span>{' '}
                  <strong className="text-slate-800">{entry.fullName}</strong> ({entry.email})
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Log ID:</span>{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono text-[11px]">
                    {entry.id}
                  </code>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-mono space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Notes / Budget Payload:</div>
                <p className="font-sans text-slate-800 whitespace-pre-wrap">{entry.notesBudget}</p>
              </div>

              {entry.responseDetails && (
                <div className="text-[11px] text-slate-500 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                  <strong>Server Response:</strong> {entry.responseDetails}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
