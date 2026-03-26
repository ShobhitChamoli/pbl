# Firebase Setup Quick Reference

This is a quick reference guide for setting up Firebase Firestore for the AuditX project.

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "auditx-production")
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode** (recommended)
4. Choose a Cloud Firestore location:
   - For India: `asia-south1` (Mumbai)
   - For US: `us-central1` (Iowa)
   - For Europe: `europe-west1` (Belgium)
5. Click **Enable**

## Step 3: Generate Service Account Key

1. Click the **⚙️ gear icon** (Project Settings) in the left sidebar
2. Go to the **Service accounts** tab
3. Click **Generate new private key**
4. Click **Generate key** in the confirmation dialog
5. A JSON file will download - **keep this secure!**

## Step 4: Extract Credentials

Open the downloaded JSON file. You need these three values:

```json
{
  "project_id": "your-project-id",           ← Copy this
  "client_email": "firebase-adminsdk-...",   ← Copy this
  "private_key": "-----BEGIN PRIVATE KEY..." ← Copy this
}
```

## Step 5: Update Local Environment

Edit `server/.env`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

> **Important**: Keep the private key on one line with `\n` for line breaks, wrapped in double quotes.

## Step 6: Test Connection

```bash
cd server
npm start
```

Look for this message:
```
✅ Firebase initialized successfully
Server running on port 5001
```

## Step 7: Verify Firestore

1. Go back to Firebase Console → Firestore Database
2. After running the app and creating users, you should see collections appear:
   - `users`
   - `courses`
   - `projects`
   - etc.

## For Vercel Deployment

When deploying to Vercel, add the same three environment variables in:
**Project Settings** → **Environment Variables**

Make sure to format `FIREBASE_PRIVATE_KEY` correctly (see DEPLOYMENT.md for details).

---

## Troubleshooting

### Error: "Firebase credentials not found"
- Check that all three variables are in `.env`
- Restart the server after updating `.env`

### Error: "Invalid private key"
- Ensure the key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Check that `\n` characters are present (not actual newlines)
- Wrap the entire key in double quotes

### Collections not appearing
- Make sure you've created at least one user or course
- Refresh the Firestore Console
- Check server logs for errors

---

## Quick Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Full Deployment Guide](./DEPLOYMENT.md)
