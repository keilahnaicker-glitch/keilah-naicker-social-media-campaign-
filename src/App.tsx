import React, { useState } from 'react';
import { ViewTab, SubmissionEntry } from './types';
import { IntakeForm } from './components/IntakeForm';
import { AppsScriptCodeViewer } from './components/AppsScriptCodeViewer';
import { SetupInstructions } from './components/SetupInstructions';
import { VirtualSheetViewer } from './components/VirtualSheetViewer';
import { SingleFileExporter } from './components/SingleFileExporter';
import { SubmissionHistory } from './components/SubmissionHistory';
import {
  FileSpreadsheet,
  Code2,
  HelpCircle,
  Megaphone,
  History,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('form');
  const [mode, setMode] = useState<'virtual' | 'live_script'>('virtual');
  const [webAppUrl, setWebAppUrl] = useState<string>('');

  // Initial sample submission for demonstration
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([
    {
      id: 'sub_sample_1',
      fullName: 'Alex Vance',
      email: 'alex.vance@growthpulse.agency',
      platform: 'TikTok',
      campaignName: 'Summer Glow Viral Challenge',
      notesBudget: 'Estimated Budget: $18,500.\nFocus on Gen-Z fashion influencers, UGC creator clips, and Spark Ads booster strategy.',
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'success',
      destination: 'virtual',
      responseDetails: 'Sample intake record pre-loaded for preview.'
    }
  ]);

  const handleNewSubmission = (entry: SubmissionEntry) => {
    setSubmissions(prev => [entry, ...prev]);
  };

  const handleClearSubmissions = () => {
    setSubmissions([]);
  };

  const handleAddSampleSubmission = () => {
    const samples = [
      {
        fullName: 'Jordan Lee',
        email: 'jordan@brandboost.com',
        platform: 'Instagram',
        campaignName: 'Q4 Product Launch Blitz',
        notesBudget: 'Budget: $32,000. Carousel ads + Reels partnership with top 10 tech reviewers.'
      },
      {
        fullName: 'Carlos Mendez',
        email: 'carlos@venturemedia.co',
        platform: 'LinkedIn',
        campaignName: 'B2B Enterprise AI Summit',
        notesBudget: 'Budget: $15,000. InMail campaign + Sponsored Thought Leadership posts.'
      },
      {
        fullName: 'Maya Patel',
        email: 'maya@lifestyleco.io',
        platform: 'YouTube',
        campaignName: 'Holiday Gift Guide Sponsorship',
        notesBudget: 'Budget: $45,000. Dedicated 60s integrations across 8 lifestyle channels.'
      }
    ];

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    const entry: SubmissionEntry = {
      ...randomSample,
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'success',
      destination: 'virtual',
      responseDetails: 'Simulated sample row appended.'
    };

    setSubmissions(prev => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-md">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Campaign Intake System
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Social Media Campaign Intake Form & Google Apps Script Sheet Integration
                </p>
              </div>
            </div>

            {/* Quick Status / Mode Badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                mode === 'virtual'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${mode === 'virtual' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                {mode === 'virtual' ? 'Virtual Sheet Mode' : 'Live Apps Script Endpoint'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              Campaign Form
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('script_code')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'script_code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Google Apps Script (Code.gs)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('setup_guide')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'setup_guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Deployment Guide
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sheet_preview')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'sheet_preview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Virtual Sheet Simulator
              {submissions.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'sheet_preview' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {submissions.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('html_export')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'html_export'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Single-File HTML Exporter
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Logs ({submissions.length})
            </button>
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'form' && (
          <IntakeForm
            onNewSubmission={handleNewSubmission}
            webAppUrl={webAppUrl}
            setWebAppUrl={setWebAppUrl}
            mode={mode}
            setMode={setMode}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'script_code' && <AppsScriptCodeViewer />}

        {activeTab === 'setup_guide' && <SetupInstructions onNavigateTab={setActiveTab} />}

        {activeTab === 'sheet_preview' && (
          <VirtualSheetViewer
            submissions={submissions}
            onClearSubmissions={handleClearSubmissions}
            onAddSampleSubmission={handleAddSampleSubmission}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'html_export' && <SingleFileExporter webAppUrl={webAppUrl} />}

        {activeTab === 'history' && (
          <SubmissionHistory
            submissions={submissions}
            onClearHistory={handleClearSubmissions}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Social Media Campaign Intake System & Google Sheets Web App</span>
          <span className="text-[11px] text-slate-400 font-mono">
            Headers: Full Name • Email Address • Platform/Channel • Campaign Name • Notes/Budget
          </span>
        </div>
      </footer>
    </div>
  );
}
