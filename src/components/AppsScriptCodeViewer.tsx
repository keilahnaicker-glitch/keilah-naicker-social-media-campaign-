import React, { useState } from 'react';
import { AppsScriptConfig } from '../types';
import { generateAppsScriptCode } from '../utils/generateAppsScript';
import {
  Code,
  Copy,
  Check,
  Download,
  Settings,
  Mail,
  Table,
  CheckCircle,
  FileCode,
  Info
} from 'lucide-react';

export const AppsScriptCodeViewer: React.FC = () => {
  const [config, setConfig] = useState<AppsScriptConfig>({
    sheetName: 'Campaign Intakes',
    sendEmailNotification: false,
    notificationEmail: 'manager@company.com',
    autoCreateSheet: true,
    includeDoGet: true
  });

  const [copied, setCopied] = useState(false);

  const scriptCode = generateAppsScriptCode(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptCode], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Code.gs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Google Apps Script Code Generator (doPost)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy this backend script into your Google Sheet's Apps Script editor to process form POST requests automatically.
            </p>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-indigo-600" /> Script Configuration Options
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Sheet Tab Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-indigo-500" /> Target Sheet Tab Name:
              </label>
              <input
                type="text"
                value={config.sheetName}
                onChange={e => setConfig(prev => ({ ...prev, sheetName: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Campaign Intakes"
              />
            </div>

            {/* Auto Create Sheet Checkbox */}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="autoCreateSheet"
                checked={config.autoCreateSheet}
                onChange={e => setConfig(prev => ({ ...prev, autoCreateSheet: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="autoCreateSheet" className="text-slate-700 font-medium">
                Auto-create sheet tab if it doesn't exist
              </label>
            </div>

            {/* Email Notification Toggle */}
            <div className="space-y-2 md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={config.sendEmailNotification}
                  onChange={e => setConfig(prev => ({ ...prev, sendEmailNotification: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="sendEmail" className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" /> Send email alert on new campaign submission
                </label>
              </div>

              {config.sendEmailNotification && (
                <div className="pt-2 pl-6">
                  <label className="block text-slate-600 font-medium mb-1">Alert Recipient Email:</label>
                  <input
                    type="email"
                    value={config.notificationEmail}
                    onChange={e => setConfig(prev => ({ ...prev, notificationEmail: e.target.value }))}
                    className="w-full max-w-md px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                    placeholder="marketing@company.com"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono font-medium text-slate-300 ml-2">Code.gs</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Code'}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download .gs
            </button>
          </div>
        </div>

        {/* Code Block */}
        <pre className="p-5 text-xs font-mono text-indigo-100 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{scriptCode}</code>
        </pre>

        {/* Footer Header Mapping Reference */}
        <div className="p-4 bg-slate-800/50 border-t border-slate-700/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Guaranteed column header sequence matched:</span>
          </div>
          <div className="flex flex-wrap gap-1 font-mono text-[10px]">
            {['Timestamp', 'Full Name', 'Email Address', 'Platform/Channel', 'Campaign Name', 'Notes/Budget'].map((h, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-700/80 text-indigo-200 rounded border border-slate-600">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
