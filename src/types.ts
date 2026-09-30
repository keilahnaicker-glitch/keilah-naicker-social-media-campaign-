export interface IntakeFormData {
  fullName: string;
  email: string;
  platform: string;
  campaignName: string;
  notesBudget: string;
}

export interface SubmissionEntry extends IntakeFormData {
  id: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  destination: 'virtual' | 'live_script';
  responseDetails?: string;
}

export interface AppsScriptConfig {
  sheetName: string;
  sendEmailNotification: boolean;
  notificationEmail: string;
  autoCreateSheet: boolean;
  includeDoGet: boolean;
}

export type ViewTab = 'form' | 'script_code' | 'setup_guide' | 'sheet_preview' | 'html_export' | 'history';
