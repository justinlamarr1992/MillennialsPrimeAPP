# Environment Configuration Guide

This guide explains how to set up and manage environment variables for the Millennials Prime app.

## Overview

The app uses environment variables to manage configuration for different environments (development, staging, production). This allows you to:
- Keep sensitive credentials secure
- Switch between environments easily
- Maintain different configurations for development and production

## Environment Files

### Available Environment Files

- `.env` - Default environment file (typically development)
- `.env.development` - Development-specific configuration
- `.env.production` - Production-specific configuration
- `.env.example` - Template showing all required variables
- `.env.development.example` - Development template
- `.env.production.example` - Production template

### Security Notes

⚠️ **IMPORTANT**: Never commit actual `.env` files to version control!

The `.gitignore` file is configured to exclude:
- `.env`
- `.env.local`
- `.env.*.local`

Only `.env.example` files should be committed to show required variables.

## Setup Instructions

### Initial Setup

1. **Copy the example file for your environment:**

   For development:
   ```bash
   cp .env.development.example .env.development
   cp .env.development .env  # Set as default
   ```

   For production:
   ```bash
   cp .env.production.example .env.production
   ```

2. **Fill in your actual credentials:**

   Open the `.env` file and replace placeholder values with your actual credentials:
   ```bash
   nano .env  # or use your preferred editor
   ```

### Required Environment Variables

#### Firebase Configuration
```env
EXPO_PUBLIC_FIREBASE_API_KEY=          # Firebase API key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=      # Firebase auth domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=       # Firebase project ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=   # Firebase storage bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=  # FCM sender ID
EXPO_PUBLIC_FIREBASE_APP_ID=           # Firebase app ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=   # Analytics measurement ID (optional)
```

#### API Configuration
```env
EXPO_PUBLIC_API_BASE_URL=  # Backend API base URL
```

#### BunnyCDN Configuration
```env
EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY=  # BunnyCDN access key
EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID=  # BunnyCDN library ID
EXPO_PUBLIC_BUNNYCDN_API_URL=     # BunnyCDN API URL
```

### Finding Your Credentials

#### Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project settings
4. Scroll down to "Your apps" section
5. Copy the configuration values

#### BunnyCDN Credentials
1. Go to [BunnyCDN Dashboard](https://dash.bunnycdn.com/)
2. Navigate to Stream → Video Libraries
3. Select your library
4. Find your Library ID in the URL or library details
5. Go to Account → API to get your API key

## Environment-Specific Configuration

### Development Environment

Use for local development and testing:
- Local or development Firebase project
- Development API endpoints
- Test BunnyCDN library

```bash
# Use development environment
cp .env.development .env
npm start
```

### Production Environment

Use for production builds:
- Production Firebase project
- Production API endpoints
- Live BunnyCDN library

```bash
# Use production environment
cp .env.production .env
npm run build  # or eas build for native apps
```

## Best Practices

### Security
1. ✅ **DO**: Keep `.env` files out of version control
2. ✅ **DO**: Use different credentials for each environment
3. ✅ **DO**: Rotate credentials regularly
4. ✅ **DO**: Limit API key permissions to minimum required
5. ❌ **DON'T**: Commit actual credentials to git
6. ❌ **DON'T**: Share `.env` files via insecure channels
7. ❌ **DON'T**: Use production credentials in development

### Organization
1. Document all required variables in `.env.example`
2. Add comments explaining what each variable does
3. Group related variables together
4. Use consistent naming conventions

### Variable Naming Convention

All public environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the Expo app:

```env
# ✅ Correct - accessible in app
EXPO_PUBLIC_FIREBASE_API_KEY=abc123

# ❌ Wrong - not accessible in app
FIREBASE_API_KEY=abc123
```

## Troubleshooting

### App Not Reading Environment Variables

1. **Restart the development server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm start
   ```

2. **Clear Expo cache:**
   ```bash
   npx expo start --clear
   ```

3. **Verify variable names:**
   - Must start with `EXPO_PUBLIC_`
   - Check for typos in variable names

### Missing Required Variables

If you see errors like "Missing required environment variable", check:

1. Variable exists in `.env` file
2. Variable has `EXPO_PUBLIC_` prefix
3. Variable has a value (not empty)
4. Development server was restarted after adding variable

### Firebase Configuration Errors

If you see Firebase initialization errors:
1. Verify all Firebase variables are set
2. Check that values match your Firebase project settings
3. Ensure no extra spaces or quotes in values

## CI/CD Integration

For continuous integration and deployment:

1. **Set environment variables in your CI/CD platform:**
   - GitHub Actions: Repository Secrets
   - GitLab CI: CI/CD Variables
   - Bitrise: Secrets
   - EAS Build: Secrets

2. **Example for EAS Build:**
   ```json
   // eas.json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_FIREBASE_API_KEY": "from-secret"
         }
       }
     }
   }
   ```

## Additional Resources

- [Expo Environment Variables Documentation](https://docs.expo.dev/guides/environment-variables/)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [BunnyCDN API Documentation](https://docs.bunny.net/)
- [Security Best Practices](https://owasp.org/www-community/vulnerabilities/)

## Support

If you encounter issues with environment configuration:
1. Check this documentation
2. Verify all variables are set correctly
3. Review error messages in console
4. Contact the development team
