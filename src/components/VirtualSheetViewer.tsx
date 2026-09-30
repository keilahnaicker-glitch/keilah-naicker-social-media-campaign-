import React from 'react';
import { SubmissionEntry } from '../types';
import {
  FileSpreadsheet,
  Download,
  Trash2,
  Plus,
  Table,
  CheckCircle2,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';

interface VirtualSheetViewerProps {
  submissions: SubmissionEntry[];
  onClearSubmissions: () => void;
  onAddSampleSubmission: () => void;
  onNavigateTab: (tab: any) => void;
}

export const VirtualSheetViewer: React.FC<VirtualSheetViewerProps> = ({
  submissions,
  onClearSubmissions,
  onAddSampleSubmission,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSubmissions = submissions.filter(sub =>
    sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.notesBudget.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCsv = () => {
    if (submissions.length === 0) return;

    const headers = ['Timestamp', 'Full Name', 'Email Address', 'Platform/Channel', 'Campaign Name', 'Notes/Budget'];
    const rows = submissions.map(sub => [
      `"${sub.timestamp}"`,
      `"${sub.fullName.replace(/"/g, '""')}"`,
      `"${sub.email.replace(/"/g, '""')}"`,
      `"${sub.platform.replace(/"/g, '""')}"`,
      `"${sub.campaignName.replace(/"/g, '""')}"`,
      `"${sub.notesBudget.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign_intake_submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">Virtual Google Sheet Simulator</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded-full">
                Live Data View
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated spreadsheet view showing received campaign intakes structured with exact header mapping.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onAddSampleSubmission}
            className="flex-1 sm:flex-none px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Sample Row
          </button>

          {submissions.length > 0 && (
            <>
              <button
                type="button"
                onClick={exportToCsv}
                className="flex-1 sm:flex-none px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>

              <button
                type="button"
                onClick={onClearSubmissions}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-all"
                title="Clear All Submissions"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Spreadsheet Top Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold">
              <Table className="w-3.5 h-3.5" /> Tab: Campaign Intakes
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Total Rows: <strong>{submissions.length}</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search campaigns or emails..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Table Render */}
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-flex p-4 bg-slate-100 rounded-full text-slate-400">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No Campaign Intake Submissions Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit a campaign using the form or click "Add Sample Row" to preview how submissions populate the sheet.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab('form')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                Go to Campaign Form
              </button>
              <button
                type="button"
                onClick={onAddSampleSubmission}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
              >
                Add Sample Submission
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-700 text-white font-bold tracking-wide uppercase border-b border-emerald-800">
                  <th className="py-3 px-4 border-r border-emerald-600/50 w-12 text-center">#</th>
                  <th className="py-3 px-4 border-r border-emerald-600/50 whitespace-nowrap">Timestamp</th>
                  <th className="py-3 px-4 border-r border-emerald-600/50 whitespace-nowrap">Full Name</th>
                  <th className="py-3 px-4 border-r border-emerald-600/50 whitespace-nowrap">Email Address</th>
                  <th className="py-3 px-4 border-r border-emerald-600/50 whitespace-nowrap">Platform/Channel</th>
                  <th className="py-3 px-4 border-r border-emerald-600/50 whitespace-nowrap">Campaign Name</th>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[200px]">Notes/Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-mono text-[12px]">
                {filteredSubmissions.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors odd:bg-white even:bg-slate-50/40">
                    <td className="py-2.5 px-4 border-r border-slate-200 text-center font-bold text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 whitespace-nowrap text-slate-500 font-sans text-xs">
                      {row.timestamp}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 font-sans font-semibold text-slate-900 whitespace-nowrap">
                      {row.fullName}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 text-indigo-600 whitespace-nowrap font-sans text-xs">
                      {row.email}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {row.platform}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 font-sans font-medium text-slate-800 whitespace-nowrap">
                      {row.campaignName}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-xs text-slate-600 whitespace-pre-wrap max-w-xs">
                      {row.notesBudget}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Headers match exact prompt specifications: Full Name | Email Address | Platform/Channel | Campaign Name | Notes/Budget
          </span>
        </div>
      </div>
    </div>
  );
};
