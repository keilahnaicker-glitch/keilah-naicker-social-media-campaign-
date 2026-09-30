import React, { useState } from 'react';
import { generateSingleFileHtml } from '../utils/generateSingleFileHtml';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Eye,
  Code2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface SingleFileExporterProps {
  webAppUrl: string;
}

export const SingleFileExporter: React.FC<SingleFileExporterProps> = ({ webAppUrl }) => {
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  const htmlContent = generateSingleFileHtml(webAppUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campaign_intake_form.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Exporter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Single-File HTML/JS/CSS Package Exporter</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-contained HTML file containing embedded styling and JavaScript submission logic. Ready to host anywhere or embed in an iframe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied HTML!' : 'Copy HTML Code'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download .html
          </button>
        </div>
      </div>

      {/* Sub Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'code'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Code View (index.html)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('preview')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Live Render Preview
        </button>
      </div>

      {/* View Content */}
      {activeSubTab === 'code' ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="px-5 py-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>campaign_intake_form.html</span>
            <span className="text-[11px] text-slate-400">Single-file standalone bundle</span>
          </div>
          <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[550px] leading-relaxed">
            <code>{htmlContent}</code>
          </pre>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
          <div className="mb-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>
              This is a live iframe rendering of the standalone single-file HTML version generated from your settings.
            </span>
          </div>

          <iframe
            title="Single File Form Preview"
            srcDoc={htmlContent}
            className="w-full h-[650px] rounded-xl border border-slate-200 shadow-inner bg-slate-50"
          />
        </div>
      )}
    </div>
  );
};
