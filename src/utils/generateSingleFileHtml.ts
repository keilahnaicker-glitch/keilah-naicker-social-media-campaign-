export function generateSingleFileHtml(webAppUrl: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Media Campaign Intake Form</title>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #eef2ff;
      --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      --text-main: #0f172a;
      --text-muted: #64748b;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      --success-bg: #f0fdf4;
      --success-border: #bbf7d0;
      --success-text: #166534;
      --error-bg: #fef2f2;
      --error-border: #fecaca;
      --error-text: #991b1b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }

    .container {
      width: 100%;
      max-width: 640px;
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
      color: #ffffff;
      padding: 32px 28px;
      text-align: center;
      position: relative;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .header p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.5;
    }

    .form-body {
      padding: 32px 28px;
    }

    .form-group {
      margin-bottom: 22px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
    }

    .required-star {
      color: #ef4444;
      margin-left: 2px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      font-size: 15px;
      color: var(--text-main);
      background-color: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      transition: all 0.2s ease-in-out;
      outline: none;
    }

    .form-control:focus {
      background-color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
    }

    .form-control::placeholder {
      color: #94a3b8;
    }

    select.form-control {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2064748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      background-size: 18px;
      padding-right: 40px;
    }

    textarea.form-control {
      min-height: 110px;
      resize: vertical;
    }

    .url-config-box {
      background: #f1f5f9;
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 24px;
    }

    .url-config-box label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
      display: block;
      margin-bottom: 6px;
    }

    .url-config-box input {
      font-size: 13px;
      font-family: monospace;
      padding: 8px 12px;
    }

    .submit-btn {
      width: 100%;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 14px 20px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
    }

    .submit-btn:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #ffffff;
      animation: spin 0.8s linear infinite;
      display: none;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 24px;
      display: none;
      font-size: 14px;
      line-height: 1.5;
    }

    .alert-success {
      background-color: var(--success-bg);
      border: 1px solid var(--success-border);
      color: var(--success-text);
    }

    .alert-error {
      background-color: var(--error-bg);
      border: 1px solid var(--error-border);
      color: var(--error-text);
    }

    .alert-title {
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .alert-details {
      margin-top: 8px;
      font-size: 12px;
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.5);
      padding: 8px;
      border-radius: 6px;
      word-break: break-all;
    }

    .reset-btn {
      margin-top: 12px;
      background: #166534;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .footer-text {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 24px;
    }

    @media (max-width: 480px) {
      .header {
        padding: 24px 20px;
      }
      .form-body {
        padding: 24px 20px;
      }
      .header h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <div class="header-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        Campaign Portal
      </div>
      <h1>Social Media Campaign Intake</h1>
      <p>Submit campaign details directly to Google Sheets for review & approval</p>
    </div>

    <div class="form-body">
      <!-- Status Alerts -->
      <div id="alertSuccess" class="alert alert-success">
        <div class="alert-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Campaign Submitted Successfully!
        </div>
        <p>Your intake details have been logged to the master Google Sheet.</p>
        <button type="button" class="reset-btn" onclick="resetForm()">Submit Another Campaign</button>
      </div>

      <div id="alertError" class="alert alert-error">
        <div class="alert-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Submission Failed
        </div>
        <div id="errorMessage">Unable to send submission to Google Sheet.</div>
        <div id="errorDetails" class="alert-details"></div>
      </div>

      <!-- Optional Web App URL Setting -->
      <div class="url-config-box">
        <label for="webAppUrlInput">Google Apps Script Web App URL</label>
        <input type="url" id="webAppUrlInput" class="form-control" value="${webAppUrl.replace(/"/g, '&quot;')}" placeholder="https://script.google.com/macros/s/.../exec" required>
      </div>

      <!-- Main Form -->
      <form id="campaignForm" onsubmit="handleFormSubmit(event)">
        <!-- Header: Full Name -->
        <div class="form-group">
          <label class="form-label" for="fullName">Full Name <span class="required-star">*</span></label>
          <input type="text" id="fullName" name="Full Name" class="form-control" placeholder="e.g. Alex Morgan" required>
        </div>

        <!-- Header: Email Address -->
        <div class="form-group">
          <label class="form-label" for="email">Email Address <span class="required-star">*</span></label>
          <input type="email" id="email" name="Email Address" class="form-control" placeholder="alex.morgan@company.com" required>
        </div>

        <!-- Header: Platform/Channel -->
        <div class="form-group">
          <label class="form-label" for="platform">Platform / Channel <span class="required-star">*</span></label>
          <select id="platform" name="Platform/Channel" class="form-control" required>
            <option value="" disabled selected>Select primary platform...</option>
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

        <!-- Header: Campaign Name -->
        <div class="form-group">
          <label class="form-label" for="campaignName">Campaign Name <span class="required-star">*</span></label>
          <input type="text" id="campaignName" name="Campaign Name" class="form-control" placeholder="e.g. Q3 Summer Product Launch" required>
        </div>

        <!-- Header: Notes/Budget -->
        <div class="form-group">
          <label class="form-label" for="notesBudget">Notes / Budget <span class="required-star">*</span></label>
          <textarea id="notesBudget" name="Notes/Budget" class="form-control" placeholder="Provide target budget (e.g. $15,000), key deliverables, timeline, or special requirements..." required></textarea>
        </div>

        <button type="submit" id="submitBtn" class="submit-btn">
          <span id="btnSpinner" class="spinner"></span>
          <span id="btnText">Submit Campaign Intake</span>
        </button>
      </form>

      <div class="footer-text">
        Matches required Google Sheet headers: Full Name, Email Address, Platform/Channel, Campaign Name, Notes/Budget
      </div>
    </div>
  </div>

  <script>
    async function handleFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('campaignForm');
      const submitBtn = document.getElementById('submitBtn');
      const btnSpinner = document.getElementById('btnSpinner');
      const btnText = document.getElementById('btnText');
      const alertSuccess = document.getElementById('alertSuccess');
      const alertError = document.getElementById('alertError');
      const errorMessage = document.getElementById('errorMessage');
      const errorDetails = document.getElementById('errorDetails');
      const webAppUrl = document.getElementById('webAppUrlInput').value.trim();

      // Clear alerts
      alertSuccess.style.display = 'none';
      alertError.style.display = 'none';

      if (!webAppUrl) {
        alertError.style.display = 'block';
        errorMessage.innerText = 'Missing Web App URL';
        errorDetails.innerText = 'Please paste your deployed Google Apps Script Web App URL before submitting.';
        return;
      }

      // Collect form values matching exact sheet column keys
      const payload = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        platform: document.getElementById('platform').value,
        campaignName: document.getElementById('campaignName').value.trim(),
        notesBudget: document.getElementById('notesBudget').value.trim(),
        // Also map explicitly to exact header string names
        "Full Name": document.getElementById('fullName').value.trim(),
        "Email Address": document.getElementById('email').value.trim(),
        "Platform/Channel": document.getElementById('platform').value,
        "Campaign Name": document.getElementById('campaignName').value.trim(),
        "Notes/Budget": document.getElementById('notesBudget').value.trim()
      };

      // Set loading state
      submitBtn.disabled = true;
      btnSpinner.style.display = 'inline-block';
      btnText.innerText = 'Submitting to Sheet...';

      try {
        // Submit via POST using text/plain or application/json to bypass strict CORS preflight checks in Apps Script
        const response = await fetch(webAppUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result && (result.status === 'success' || result.result === 'success')) {
          alertSuccess.style.display = 'block';
          form.reset();
        } else {
          throw new Error(result.message || 'Server returned an error response.');
        }
      } catch (err) {
        console.error('Submission error:', err);
        alertError.style.display = 'block';
        errorMessage.innerText = 'Error submitting to Google Sheet.';
        errorDetails.innerText = err.message || 'Ensure your Google Apps Script is deployed with "Who has access: Anyone".';
      } finally {
        submitBtn.disabled = false;
        btnSpinner.style.display = 'none';
        btnText.innerText = 'Submit Campaign Intake';
      }
    }

    function resetForm() {
      document.getElementById('campaignForm').reset();
      document.getElementById('alertSuccess').style.display = 'none';
      document.getElementById('alertError').style.display = 'none';
    }
  </script>
</body>
</html>`;
}
