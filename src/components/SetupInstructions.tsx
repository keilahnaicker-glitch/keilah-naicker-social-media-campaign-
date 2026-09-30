import React from 'react';
import {
  FileSpreadsheet,
  Code,
  Globe,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Layers
} from 'lucide-react';

interface SetupInstructionsProps {
  onNavigateTab: (tab: any) => void;
}

export const SetupInstructions: React.FC<SetupInstructionsProps> = ({ onNavigateTab }) => {
  const STEPS = [
    {
      num: '01',
      title: 'Open Google Sheets',
      icon: FileSpreadsheet,
      desc: 'Create a new spreadsheet or open an existing Google Sheet where campaign intake records should be saved.'
    },
    {
      num: '02',
      title: 'Open Apps Script Editor',
      icon: Code,
      desc: 'In your Google Sheet menu bar, click Extensions > Apps Script. This opens the Google Apps Script project editor.'
    },
    {
      num: '03',
      title: 'Paste Generated Code',
      icon: Layers,
      desc: 'Delete any placeholder code in Code.gs and paste the generated script provided in the "Google Apps Script Code" tab.'
    },
    {
      num: '04',
      title: 'Deploy as Web App',
      icon: Globe,
      desc: 'Click Deploy (top right) > New Deployment > Click Gear icon > Select Web App.',
      details: [
        'Execute as: Me (your email address)',
        'Who has access: Anyone'
      ]
    },
    {
      num: '05',
      title: 'Authorize & Copy Web App URL',
      icon: ShieldCheck,
      desc: 'Click Deploy, complete the Google authorization popup ("Allow"), and copy the resulting Web App URL (ending in /exec).'
    },
    {
      num: '06',
      title: 'Connect URL to Intake Form',
      icon: CheckCircle2,
      desc: 'Paste your Web App URL into the "Live Google Sheet" URL field on the Campaign Intake Form tab and test live submission!'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/30 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-400/20 mb-3">
              Step-by-Step Walkthrough
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">Deploying Google Apps Script Web App</h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-1 max-w-2xl">
              Follow these simple steps to connect this Social Media Campaign Intake form directly to your Google Sheet without needing any external database.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('script_code')}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Code className="w-4 h-4" /> Get Apps Script Code
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold font-mono px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                    STEP {step.num}
                  </span>
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>

                {step.details && (
                  <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                      Critical Settings:
                    </div>
                    {step.details.map((d, i) => (
                      <div key={i} className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tips Box */}
      <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Pro Tips for Seamless Apps Script Integration
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block mb-1">CORS Resolution:</strong>
            The generated script returns text/json formatted output with CORS headers enabled, preventing cross-origin blocked requests in browser clients.
          </li>
          <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block mb-1">Automatic Header Row:</strong>
            If your Google Sheet tab is brand new, the script automatically generates formatted headers: <i>Timestamp, Full Name, Email Address, Platform/Channel, Campaign Name, Notes/Budget</i>.
          </li>
          <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block mb-1">Concurrency Lock:</strong>
            The `LockService` in `doPost` guarantees concurrent submissions will not overwrite each other.
          </li>
          <li className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <strong className="text-slate-800 block mb-1">Updating Script:</strong>
            When updating code in Apps Script, click <strong>Deploy &gt; Manage Deployments &gt; Edit &gt; New Version</strong> before saving!
          </li>
        </ul>
      </div>
    </div>
  );
};
