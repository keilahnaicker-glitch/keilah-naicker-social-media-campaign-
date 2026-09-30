import React, { useState } from 'react';
import { IntakeFormData, SubmissionEntry } from '../types';
import {
  Send,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Globe,
  Radio,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Layers,
  DollarSign,
  User,
  Mail,
  Megaphone
} from 'lucide-react';

interface IntakeFormProps {
  onNewSubmission: (entry: SubmissionEntry) => void;
  webAppUrl: string;
  setWebAppUrl: (url: string) => void;
  mode: 'virtual' | 'live_script';
  setMode: (mode: 'virtual' | 'live_script') => void;
  onNavigateTab: (tab: any) => void;
}

const PRESETS: { label: string; icon: string; data: IntakeFormData }[] = [
  {
    label: 'TikTok Influencer Launch',
    icon: '📱',
    data: {
      fullName: 'Samantha Vance',
      email: 'samantha.vance@brandpulse.io',
      platform: 'TikTok',
      campaignName: 'Summer Glow Viral Challenge 2026',
      notesBudget: 'Target Budget: $25,000.\nDeliverables: 15 micro-influencer videos, spark ads boost, product seeding to top 50 beauty creators. Timeline: Aug 15 - Sept 30.'
    }
  },
  {
    label: 'LinkedIn B2B Thought Leadership',
    icon: '💼',
    data: {
      fullName: 'Marcus Sterling',
      email: 'marcus@enterprise-cloud.com',
      platform: 'LinkedIn',
      campaignName: 'AI Cloud Platform Executive Summit',
      notesBudget: 'Target Budget: $18,500.\nObjective: Drive C-level webinar signups. Sponsored content + direct InMail campaign targeting CTOs & VPs of Engineering.'
    }
  },
  {
    label: 'Multi-Channel Brand Awareness',
    icon: '🚀',
    data: {
      fullName: 'Elena Rostova',
      email: 'elena@novawear.co',
      platform: 'Multi-Channel Campaign',
      campaignName: 'Fall Apparel Collection Drop',
      notesBudget: 'Target Budget: $40,000.\nPlatforms: Instagram Reels, Pinterest Shopping, YouTube Shorts.\nInclude pixel tracking for retargeting catalog sales.'
    }
  }
];

export const IntakeForm: React.FC<IntakeFormProps> = ({
  onNewSubmission,
  webAppUrl,
  setWebAppUrl,
  mode,
  setMode,
  onNavigateTab
}) => {
  const [formData, setFormData] = useState<IntakeFormData>({
    fullName: '',
    email: '',
    platform: 'Instagram',
    campaignName: '',
    notesBudget: ''
  });

  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [lastSubmission, setLastSubmission] = useState<SubmissionEntry | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPreset = (presetData: IntakeFormData) => {
    setFormData(presetData);
    setSubmissionStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.campaignName || !formData.notesBudget) {
      setSubmissionStatus('error');
      setErrorMessage('Please fill in all required fields.');
      setErrorDetails('Full Name, Email Address, Campaign Name, and Notes/Budget are strictly required.');
      return;
    }

    setLoading(true);
    setSubmissionStatus('idle');
    setErrorMessage('');
    setErrorDetails('');

    const entryId = 'sub_' + Math.random().toString(36).substr(2, 9);
    const timestampStr = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    if (mode === 'virtual') {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      const entry: SubmissionEntry = {
        ...formData,
        id: entryId,
        timestamp: timestampStr,
        status: 'success',
        destination: 'virtual',
        responseDetails: 'Successfully logged to Virtual Spreadsheet viewer.'
      };

      onNewSubmission(entry);
      setLastSubmission(entry);
      setSubmissionStatus('success');
      setLoading(false);
      return;
    }

    // Live Apps Script mode
    if (!webAppUrl.trim()) {
      setLoading(false);
      setSubmissionStatus('error');
      setErrorMessage('Missing Google Apps Script Web App URL');
      setErrorDetails('Please paste your deployed Apps Script Web App URL in the field above or switch to Virtual Test Mode.');
      return;
    }

    try {
      // Structure payload with exact field names matching Apps Script doPost expectation
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        platform: formData.platform,
        campaignName: formData.campaignName,
        notesBudget: formData.notesBudget,
        // Match string header keys as well
        "Full Name": formData.fullName,
        "Email Address": formData.email,
        "Platform/Channel": formData.platform,
        "Campaign Name": formData.campaignName,
        "Notes/Budget": formData.notesBudget
      };

      const response = await fetch(webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let result: any = {};
      try {
        result = JSON.parse(responseText);
      } catch (pErr) {
        result = { status: 'success', raw: responseText };
      }

      if (response.ok || (result && (result.status === 'success' || result.result === 'success'))) {
        const entry: SubmissionEntry = {
          ...formData,
          id: entryId,
          timestamp: timestampStr,
          status: 'success',
          destination: 'live_script',
          responseDetails: result.message || 'Successfully sent to Google Sheet via doPost.'
        };
        onNewSubmission(entry);
        setLastSubmission(entry);
        setSubmissionStatus('success');
      } else {
        throw new Error(result.message || 'Google Apps Script returned an error response.');
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      const errorEntry: SubmissionEntry = {
        ...formData,
        id: entryId,
        timestamp: timestampStr,
        status: 'error',
        destination: 'live_script',
        responseDetails: err.message || 'Network fetch failure or CORS error.'
      };
      onNewSubmission(errorEntry);
      setSubmissionStatus('error');
      setErrorMessage('Failed to send submission to Google Sheet');
      setErrorDetails(
        err.message ||
        'Cross-Origin Request blocked or Web App URL is invalid. Check that your Apps Script is deployed as Web App with "Who has access: Anyone".'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      platform: 'Instagram',
      campaignName: '',
      notesBudget: ''
    });
    setSubmissionStatus('idle');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Target Destination Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
              Intake Destination Engine
            </span>
            <h3 className="text-sm font-bold text-slate-800">Select Submission Mode</h3>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMode('virtual')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'virtual'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Virtual Test Sheet
            </button>
            <button
              type="button"
              onClick={() => setMode('live_script')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'live_script'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Live Google Sheet
            </button>
          </div>
        </div>

        {mode === 'virtual' ? (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Submissions instantly render in the built-in <strong>Virtual Spreadsheet tab</strong>.</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('sheet_preview')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
            >
              View Sheet
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Google Apps Script Web App Endpoint URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={webAppUrl}
                onChange={e => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onNavigateTab('setup_guide')}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 border border-slate-200"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Get Code
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Loader */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Load Test Presets
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="flex items-center gap-2 p-2.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group"
            >
              <span className="text-lg">{preset.icon}</span>
              <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-700 line-clamp-1">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Campaign Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Form Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-white/20">
            <Megaphone className="w-3.5 h-3.5 text-indigo-200" />
            Social Media Intake Portal
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Social Media Campaign Intake</h2>
          <p className="text-xs text-indigo-100/90 mt-1">
            Fill in campaign parameters. Submissions directly populate Google Sheet headers.
          </p>
        </div>

        <div className="p-6">
          {/* Success Banner */}
          {submissionStatus === 'success' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Campaign Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    {mode === 'virtual'
                      ? 'Campaign details saved to the Virtual Sheet viewer.'
                      : 'Data sent to Google Sheet via Google Apps Script doPost.'}
                  </p>
                  {lastSubmission && (
                    <div className="mt-3 p-3 bg-white/80 rounded-lg text-xs font-mono space-y-1 text-slate-700 border border-emerald-100">
                      <div><strong>Full Name:</strong> {lastSubmission.fullName}</div>
                      <div><strong>Email:</strong> {lastSubmission.email}</div>
                      <div><strong>Platform:</strong> {lastSubmission.platform}</div>
                      <div><strong>Campaign:</strong> {lastSubmission.campaignName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Submit Another Campaign
                </button>
                {mode === 'virtual' && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('sheet_preview')}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 font-medium text-xs rounded-lg border border-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> View in Virtual Sheet
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submissionStatus === 'error' && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-2">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">{errorMessage}</h4>
                  <p className="text-xs text-rose-700 mt-1">{errorDetails}</p>
                </div>
              </div>
              {mode === 'live_script' && (
                <div className="pt-2 text-xs flex gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('setup_guide')}
                    className="text-rose-700 font-semibold underline hover:text-rose-900"
                  >
                    Troubleshoot Apps Script Setup &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Full Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Header: Full Name</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Jordan Miller"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Field 2: Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  Email Address <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Header: Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jordan.m@agency.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Field 3: Platform/Channel */}
            <div>
              <label htmlFor="platform" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Platform / Channel <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Header: Platform/Channel</span>
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Facebook">Facebook</option>
                <option value="Pinterest">Pinterest</option>
                <option value="Multi-Channel Campaign">Multi-Channel Campaign</option>
              </select>
            </div>

            {/* Field 4: Campaign Name */}
            <div>
              <label htmlFor="campaignName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
                  Campaign Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Header: Campaign Name</span>
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
                placeholder="e.g. Back-to-School Micro-Influencer Blitz"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Field 5: Notes/Budget */}
            <div>
              <label htmlFor="notesBudget" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                  Notes / Budget <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Header: Notes/Budget</span>
              </label>
              <textarea
                id="notesBudget"
                name="notesBudget"
                rows={4}
                value={formData.notesBudget}
                onChange={handleInputChange}
                placeholder="Specify estimated budget (e.g. $20,000), target ROI, audience demographics, key creative assets, or milestone deadlines..."
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Campaign Intake...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {mode === 'virtual'
                        ? 'Submit to Virtual Sheet'
                        : 'Submit to Google Sheet'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Headers matched: Full Name, Email Address, Platform/Channel, Campaign Name, Notes/Budget
          </span>
        </div>
      </div>
    </div>
  );
};
