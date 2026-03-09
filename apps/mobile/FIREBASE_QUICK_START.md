# Firebase Push Notifications - Quick Start

Your app is now configured to use Firebase Cloud Messaging for push notifications. Here's what you need to do to get it working.

## ✅ Already Done

- Frontend configured with Firebase
- Backend configured with Firebase Admin SDK
- All notification services updated
- Security files added to .gitignore
- Example config files created

## 🚀 Quick Setup (5 Steps)

### 1. Create Firebase Project
- Go to https://console.firebase.google.com/
- Create a new project named "Solcial"

### 2. Add Your Apps
- Add Android app with package: `com.arome.dev.solcial`
- Download `google-services.json` → place in `solcial/`
- Add iOS app with bundle: `com.arome.dev.solcial`
- Download `GoogleService-Info.plist` → place in `solcial/`

### 3. Get Service Account
- Firebase Console → Project Settings → Service Accounts
- Click "Generate new private key"
- Download JSON → rename to `firebase-service-account.json`
- Place in `solcial-backend/`

### 4. Build Your App
```bash
cd solcial
eas build --profile development --platform android
```

### 5. Deploy Backend
For Render, add environment variable:
- Key: `FIREBASE_SERVICE_ACCOUNT`
- Value: (entire JSON content from service account file)

See `DEPLOY_FIREBASE.md` for detailed Render instructions.

## 📱 Testing

1. Install the built app on your device
2. Sign in
3. Trigger a notification:
   - Like a post
   - Comment on a post
   - Follow a user
   - Send a payment
4. Notification should appear!

## 📚 Detailed Guides

- `FIREBASE_COMPLETE_SETUP.md` - Complete step-by-step guide
- `FIREBASE_SETUP.md` - Detailed Firebase configuration
- `DEPLOY_FIREBASE.md` - Deploying to Render with Firebase

## 🐛 Common Issues

**"Push notifications not available in development build"**
- Normal for local dev. Build with EAS to enable.

**"Firebase service account not found"**
- Add `firebase-service-account.json` to `solcial-backend/`
- Or set `FIREBASE_SERVICE_ACCOUNT` env variable

**Notifications not received**
- Check Firebase config files exist
- Verify package names match
- Rebuild app after adding config files
- Check device notification permissions

## 🎯 What Changed

- Switched from Expo push notifications to Firebase Cloud Messaging
- All push notifications now sent from backend (more secure)
- Uses Firebase Admin SDK with service account (V1 API)
- Better error handling and token management
- Works with both file-based and env-based configuration

## 🔒 Security

These files are in `.gitignore` (never commit):
- `google-services.json`
- `GoogleService-Info.plist`
- `firebase-service-account.json`

Use environment variables for production deployments.
