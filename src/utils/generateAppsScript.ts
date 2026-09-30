import { AppsScriptConfig } from '../types';

export function generateAppsScriptCode(config: AppsScriptConfig): string {
  const { sheetName, sendEmailNotification, notificationEmail, autoCreateSheet, includeDoGet } = config;

  return `/**
 * Google Apps Script for Social Media Campaign Intake Form
 * Sheet Headers: Full Name | Email Address | Platform/Channel | Campaign Name | Notes/Budget | Timestamp
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Replace all code in Code.gs with this snippet
 * 4. Click Deploy > New Deployment > Select type: Web App
 * 5. Set 'Execute as': Me
 * 6. Set 'Who has access': Anyone
 * 7. Deploy and copy the Web App URL!
 */

// Configuration
const CONFIG = {
  SHEET_NAME: "${sheetName.replace(/"/g, '\\"')}",
  SEND_EMAIL_NOTIFICATION: ${sendEmailNotification},
  NOTIFICATION_EMAIL: "${notificationEmail.replace(/"/g, '\\"')}",
  AUTO_CREATE_SHEET: ${autoCreateSheet},
  HEADERS: [
    "Timestamp",
    "Full Name",
    "Email Address",
    "Platform/Channel",
    "Campaign Name",
    "Notes/Budget"
  ]
};

/**
 * Handles HTTP POST requests submitted from the Campaign Intake Form
 */
function doPost(e) {
  // Set up lock to prevent concurrent writing collisions
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // wait up to 10 seconds for lock
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Server busy, please try again in a moment."
    });
  }

  try {
    let data = {};
    
    // Parse incoming payload (JSON or Form URL Encoded)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback to form parameter parsing
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Extract fields matching form inputs
    const fullName = data.fullName || data["Full Name"] || data.fullNameInput || "";
    const email = data.email || data["Email Address"] || data.emailInput || "";
    const platform = data.platform || data["Platform/Channel"] || data.platformInput || "";
    const campaignName = data.campaignName || data["Campaign Name"] || data.campaignNameInput || "";
    const notesBudget = data.notesBudget || data["Notes/Budget"] || data.notesBudgetInput || "";

    // Validation check
    if (!fullName || !email || !campaignName) {
      return createJsonResponse({
        status: "error",
        message: "Missing required fields (Full Name, Email Address, and Campaign Name are required)."
      });
    }

    // Access or create spreadsheet tab
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet && CONFIG.AUTO_CREATE_SHEET) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    } else if (!sheet) {
      sheet = ss.getSheets()[0]; // Fallback to first sheet
    }

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(CONFIG.HEADERS);
      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Prepare timestamp and new data row
    const timestamp = new Date().toLocaleString("en-US", { timeZoneName: "short" });
    const newRow = [
      timestamp,
      fullName,
      email,
      platform,
      campaignName,
      notesBudget
    ];

    // Append submission to Google Sheet
    sheet.appendRow(newRow);

    // Optional email notification
    if (CONFIG.SEND_EMAIL_NOTIFICATION && CONFIG.NOTIFICATION_EMAIL) {
      sendNotificationEmail(fullName, email, platform, campaignName, notesBudget, timestamp);
    }

    // Return success response JSON
    return createJsonResponse({
      status: "success",
      message: "Campaign intake form submitted successfully!",
      received: {
        timestamp: timestamp,
        fullName: fullName,
        email: email,
        platform: platform,
        campaignName: campaignName,
        notesBudget: notesBudget
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "An internal error occurred: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

${includeDoGet ? `/**
 * Handles HTTP GET requests (Health check / testing endpoint)
 */
function doGet(e) {
  return createJsonResponse({
    status: "ok",
    service: "Social Media Campaign Intake Web App API",
    timestamp: new Date().toISOString(),
    message: "Google Apps Script Web App is active and ready to receive POST submissions!"
  });
}` : ''}

/**
 * Sends optional email notification when a new campaign is submitted
 */
function sendNotificationEmail(fullName, email, platform, campaignName, notesBudget, timestamp) {
  try {
    const subject = " New Social Media Campaign Intake: " + campaignName;
    const body = "A new campaign intake form has been submitted.\\n\\n" +
      "Timestamp: " + timestamp + "\\n" +
      "Full Name: " + fullName + "\\n" +
      "Email: " + email + "\\n" +
      "Platform/Channel: " + platform + "\\n" +
      "Campaign Name: " + campaignName + "\\n\\n" +
      "Notes / Budget:\\n" + notesBudget + "\\n\\n" +
      "View in Google Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl();

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
  } catch (err) {
    Logger.log("Email notification failed: " + err.toString());
  }
}

/**
 * Creates standardized JSON response output for CORS & Web client compatibility
 */
function createJsonResponse(responseObject) {
  return ContentService.createTextOutput(JSON.stringify(responseObject))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}
