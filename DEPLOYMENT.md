# AuditX Deployment Guide

This guide explains how to deploy AuditX to Vercel with Firebase Firestore as the database.

## Prerequisites

1. **Firebase Project Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use existing)
   - Enable Firestore Database
   - Generate service account credentials

2. **GitHub Repository**
   - Push your code to a GitHub repository
   - Ensure all changes are committed

3. **Vercel Account**
   - Sign up at [Vercel](https://vercel.com/)
   - Connect your GitHub account

---

## Step 1: Firebase Configuration

### 1.1 Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

### 1.2 Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (recommended) or Test mode
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **Enable**

### 1.3 Generate Service Account Key

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate new private key**
3. Click **Generate key** - a JSON file will download
4. **Keep this file secure!** It contains sensitive credentials

The downloaded JSON file looks like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

You'll need these three values:
- `project_id`
- `client_email`
- `private_key`

---

## Step 2: Local Development Setup

### 2.1 Update Server `.env` File

Edit `/server/.env` and add your Firebase credentials:

```env
PORT=5001
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

> [!IMPORTANT]
> The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes and include the `\n` characters for line breaks.

### 2.2 Test Locally

```bash
# Terminal 1 - Start server
cd server
npm install
npm start

# Terminal 2 - Start client
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` and test:
- User registration
- Login
- Creating projects
- Admin dashboard

---

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
git add .
git commit -m "Migrate to Firebase Firestore"
git push origin main
```

### 3.2 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

### 3.3 Configure Environment Variables

In the Vercel project settings, add these environment variables:

#### Server Environment Variables

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `PORT` | `5001` | Server port |
| `JWT_SECRET` | Your secret key | Generate a strong random string |
| `OPENAI_API_KEY` | Your OpenAI key | Optional, for AI features |
| `FIREBASE_PROJECT_ID` | From Firebase JSON | Your Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | From Firebase JSON | Service account email |
| `FIREBASE_PRIVATE_KEY` | From Firebase JSON | **See formatting below** |

#### Client Environment Variables

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_API_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |

> [!WARNING]
> **Formatting `FIREBASE_PRIVATE_KEY` for Vercel**
> 
> When adding the private key to Vercel:
> 1. Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
> 2. Replace all actual newlines with `\n` (the literal characters backslash-n)
> 3. Wrap the entire string in double quotes
> 
> Example:
> ```
> "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
> ```

### 3.4 Deploy

1. Click **Deploy**
2. Vercel will build and deploy your application
3. Once complete, you'll get a deployment URL (e.g., `https://auditx.vercel.app`)

### 3.5 Update Client Environment Variable

After first deployment:
1. Copy your Vercel deployment URL
2. Go to **Project Settings** → **Environment Variables**
3. Update `VITE_API_URL` to your actual Vercel URL
4. Redeploy (Vercel will auto-redeploy on git push)

---

## Step 4: Verify Deployment

### 4.1 Test Application

1. Visit your Vercel URL
2. Register a new user
3. Login
4. Submit a project
5. Check admin dashboard

### 4.2 Verify Firestore Data

1. Go to Firebase Console → Firestore Database
2. You should see collections being created:
   - `users`
   - `courses`
   - `projects`
   - `evaluations`
   - `notifications`
   - etc.

### 4.3 Monitor Logs

- **Vercel Logs**: Go to your project → **Deployments** → Click on deployment → **Functions** tab
- **Firebase Logs**: Firebase Console → **Functions** (if using Cloud Functions)

---

## Step 5: Seed Initial Data

### 5.1 Admin User

The admin user is automatically created on first server start:
- Email: `admin@auditx.com`
- Password: `123456`

> [!CAUTION]
> **Change the default admin password immediately in production!**

### 5.2 Create Courses

1. Login as admin
2. Go to Admin Dashboard
3. Create courses (e.g., PCS-693 - Full Stack Development)

### 5.3 Create Mentors and Students

1. Use the admin panel to create mentor and student accounts
2. Assign mentors to courses using the `courseCode` field

---

## Continuous Deployment

Once set up, Vercel automatically deploys on every push to your GitHub repository:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically deploys
```

---

## Troubleshooting

### Issue: "Firebase credentials not found"

**Solution**: Check that all three Firebase environment variables are set correctly in Vercel:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Issue: "Private key parsing error"

**Solution**: Ensure `FIREBASE_PRIVATE_KEY` is properly formatted:
- Wrapped in double quotes
- Contains `\n` for line breaks (not actual newlines)
- Includes BEGIN and END markers

### Issue: "CORS errors"

**Solution**: Update CORS configuration in `server/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Issue: "API calls failing"

**Solution**: Verify `VITE_API_URL` in client environment variables points to your Vercel deployment URL.

### Issue: "Firestore permission denied"

**Solution**: 
1. Check Firebase security rules
2. Ensure service account has proper permissions
3. Verify credentials are correct

---

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT secrets** - Generate with `openssl rand -base64 32`
3. **Change default admin password** - Do this immediately after deployment
4. **Enable Firestore security rules** - Restrict access to authenticated users
5. **Monitor Firebase usage** - Set up billing alerts
6. **Use HTTPS only** - Vercel provides this by default

---

## Firestore Security Rules (Optional)

For additional security, add Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects - students can create, mentors/admins can read all
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Admin-only collections
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Add role check here
    }
  }
}
```

> [!NOTE]
> The current implementation uses Firebase Admin SDK (server-side only), so security rules are optional. They become important if you add direct client-to-Firestore access.

---

## Scaling Considerations

### For 2000+ Users

1. **Firestore Indexing**
   - Firestore will suggest indexes via console
   - Create composite indexes for common queries

2. **Query Optimization**
   - Use pagination for large result sets
   - Implement caching for frequently accessed data

3. **Cost Management**
   - Monitor Firestore usage in Firebase Console
   - Estimated cost for 2000 users: $15-60/month
   - Free tier: 50K reads, 20K writes, 20K deletes per day

4. **Performance**
   - Firestore is globally distributed
   - Auto-scales to handle traffic
   - No manual scaling required

---

## Support

For issues:
1. Check Vercel deployment logs
2. Check Firebase Console for errors
3. Review server logs in Vercel Functions tab
4. Check browser console for client errors

---

## Next Steps

1. **Custom Domain**: Add your own domain in Vercel project settings
2. **Analytics**: Set up Firebase Analytics or Vercel Analytics
3. **Monitoring**: Use Vercel monitoring or Firebase Performance Monitoring
4. **Backup**: Set up Firestore automated backups
5. **Mobile App**: Use the same Firebase project for future mobile development
