# Google OAuth 2.0 Setup Guide for GLOWIQ

This guide explains how to set up Google OAuth 2.0 authentication for the GLOWIQ application.

## What is Google OAuth 2.0?

Google OAuth 2.0 allows users to sign in to your application using their Google account. This provides:
- Secure authentication
- Easy sign-up process
- User profile information (name, email, profile picture)
- No password management needed

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "New Project"
5. Enter project name: "GLOWIQ"
6. Click "Create"
7. Wait for the project to be created (usually takes a few seconds)

### 2. Enable Google Identity Services API

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Identity Services"
3. Click on "Google Identity Services" in the results
4. Click "Enable"

### 3. Create OAuth 2.0 Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. You may need to configure the OAuth consent screen first:
   - Click "Create OAuth Consent Screen"
   - Choose "External" user type
   - Click "Create"
   - Fill in the form:
     - App name: GLOWIQ
     - Support email: your-email@example.com
     - Developer contact: your-email@example.com
   - Click "Save and Continue"
   - Skip optional scopes, click "Save and Continue"
   - Review and click "Back to Dashboard"

4. Go back to "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Web application" as the application type
6. Enter name: "GLOWIQ Web Client"
7. Add Authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:5174`
   - (Add production URL when deploying)
8. Add Authorized origins:
   - `http://localhost:5173`
   - `http://localhost:5174`
9. Click "Create"

### 4. Copy Your Client ID

1. In the "OAuth 2.0 Client IDs" section, you'll see your newly created client
2. Click on it to view details
3. Copy the "Client ID" (looks like: `xyz123.apps.googleusercontent.com`)

### 5. Configure Frontend Environment

1. In the root directory of `skincare-app`, open or create `.env.local`
2. Add the following line with your Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your_copied_client_id.apps.googleusercontent.com
   ```
3. Save the file

### 6. Verify Setup

1. Start the frontend development server:
   ```bash
   npm run dev
   ```
2. Go to http://localhost:5173 and click the login page
3. You should see "Continue with Google" button
4. Click it to test the Google login flow

## Testing Google Login

### With a Test Account

1. Make sure you're logged into a Google account
2. On the login page, click "Continue with Google"
3. Select your Google account (if not already selected)
4. A popup will appear asking for permissions
5. Click "Continue" to authorize
6. You should be logged in and redirected to the dashboard

### With Different Google Accounts

You can add test users to your OAuth 2.0 consent screen:

1. Go to "APIs & Services" → "OAuth consent screen"
2. Under "Test users", click "Add users"
3. Enter the email of test users
4. They can now test the Google login

## Backend Configuration

The backend automatically handles Google authentication when it receives user data from the frontend:

1. It decodes the Google JWT token
2. Extracts user information (name, email, profile picture, Google ID)
3. Checks if user already exists in database
4. Creates new user if needed
5. Returns JWT token for session management

No additional backend configuration is needed for Google OAuth to work.

## Security Considerations

### For Development
- Client ID is public (it's in the frontend)
- Google handles secure token generation
- Backend validates tokens are from Google
- Environment variables keep sensitive data separate

### For Production
1. Update authorized origins and redirect URIs with production domain
2. Move to production OAuth consent screen
3. Keep environment variables secure
4. Use HTTPS for all redirects
5. Consider additional backend token validation

## Troubleshooting

### "Google login not configured" Message
- Check that `.env.local` file exists
- Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
- Restart the development server after updating `.env.local`
- Check browser console for error messages

### Popup Not Opening
- Check browser's popup blocker settings
- Allow popups for localhost:5173
- Verify authorized origins are correct

### "Invalid origin" Error
- Check that your current URL matches an authorized origin
- Add http://localhost:5173 to authorized origins in Google Cloud Console
- Wait a few minutes for changes to propagate

### User Not Created in Database
- Check backend console logs for errors
- Verify MongoDB connection is working
- Ensure User schema is updated with google_id field

## Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Identity Services Docs](https://developers.google.com/identity)
- [OAuth 2.0 Documentation](https://tools.ietf.org/html/rfc6749)

## Support

For issues or questions about Google OAuth setup, refer to:
- Google Cloud Console Documentation
- GitHub Issues for this project
- Stack Overflow (tag: google-oauth)
