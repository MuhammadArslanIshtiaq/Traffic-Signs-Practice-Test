// API Configuration for Vercel API
// This file helps manage different authentication methods

// Your Vercel API base URLs
export const API_BASE_URL = 'https://sup-admin-quizly.vercel.app/api';
export const PUBLIC_API_BASE_URL = 'https://sup-admin-quizly.vercel.app/api/public';

// Available authentication methods
export const AUTH_METHODS = {
  NONE: 'none',
  FIREBASE_TOKEN: 'firebase_token',
  VERCEL_TOKEN: 'vercel_token',
  API_KEY: 'api_key',
  CUSTOM_HEADER: 'custom_header'
};

// Current authentication method - using Firebase ID token with guest fallback
export const CURRENT_AUTH_METHOD = AUTH_METHODS.FIREBASE_TOKEN;

// API endpoint types
export const API_TYPES = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated'
};

// Authentication credentials
export const AUTH_CREDENTIALS = {
  // Vercel Personal Access Token (for Vercel API, not custom endpoints)
  VERCEL_ACCESS_TOKEN: 'SeheXvZZzH5CzbpvuH3ht12E',
  
  // Custom API Key (if your API uses this)
  API_KEY: 'your_custom_api_key_here',
  
  // Custom header name (if your API uses a different header)
  CUSTOM_HEADER_NAME: 'X-API-Key'
};

// Function to get headers based on authentication method
export const getAuthHeaders = async (firebaseAuth = null, apiType = API_TYPES.AUTHENTICATED) => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:19006'
  };

  // For public endpoints, no authentication needed
  if (apiType === API_TYPES.PUBLIC) {
    console.log('🌐 Public API endpoint - no authentication needed');
    return baseHeaders;
  }

  switch (CURRENT_AUTH_METHOD) {
    case AUTH_METHODS.FIREBASE_TOKEN:
      if (firebaseAuth) {
        try {
          const user = firebaseAuth.currentUser;
          if (user) {
            const idToken = await user.getIdToken();
            console.log('🔐 Authenticated user - sending Firebase ID token');
            console.log('🔥 Firebase ID Token:', idToken);
            console.log('📝 Token length:', idToken.length);
            return {
              ...baseHeaders,
              'x-firebase-token': idToken  // Using x-firebase-token header as per your API
            };
          } else {
            console.log('👤 Guest user - no authentication token');
            return {
              ...baseHeaders,
              'X-User-Type': 'guest'
            };
          }
        } catch (error) {
          console.log('❌ Error getting Firebase ID token:', error.message);
          console.log('👤 Falling back to guest mode');
          return {
            ...baseHeaders,
            'X-User-Type': 'guest'
          };
        }
      }
      // Fallback to guest mode if no Firebase auth
      console.log('👤 No Firebase auth - guest mode');
      return {
        ...baseHeaders,
        'X-User-Type': 'guest'
      };
    
    case AUTH_METHODS.VERCEL_TOKEN:
      return {
        ...baseHeaders,
        'Authorization': `Bearer ${AUTH_CREDENTIALS.VERCEL_ACCESS_TOKEN}`
      };
    
    case AUTH_METHODS.API_KEY:
      return {
        ...baseHeaders,
        'Authorization': `Bearer ${AUTH_CREDENTIALS.API_KEY}`
      };
    
    case AUTH_METHODS.CUSTOM_HEADER:
      return {
        ...baseHeaders,
        [AUTH_CREDENTIALS.CUSTOM_HEADER_NAME]: AUTH_CREDENTIALS.API_KEY
      };
    
    case AUTH_METHODS.NONE:
    default:
      return baseHeaders;
  }
};

// Function to test API connectivity
export const testApiConnection = async (firebaseAuth = null) => {
  try {
    console.log('🧪 Testing API connections...');
    
    // Test public API first
    console.log('🌐 Testing Public API...');
    const publicHeaders = await getAuthHeaders(firebaseAuth, API_TYPES.PUBLIC);
    const publicResponse = await fetch(`${PUBLIC_API_BASE_URL}/quizzes`, {
      method: 'GET',
      headers: publicHeaders
    });
    
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log('✅ Public API Connection Successful!');
      console.log('📊 Public Response:', publicData);
    } else {
      console.log('❌ Public API Connection Failed:', publicResponse.status);
    }
    
    // Test authenticated API
    console.log('🔐 Testing Authenticated API...');
    const authHeaders = await getAuthHeaders(firebaseAuth, API_TYPES.AUTHENTICATED);
    console.log('🔑 Auth Headers:', authHeaders);
    
    const authResponse = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'GET',
      headers: authHeaders
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authenticated API Connection Successful!');
      console.log('📊 Auth Response:', authData);
      return { success: true, publicData, authData };
    } else {
      const errorText = await authResponse.text();
      console.log('❌ Authenticated API Connection Failed:', authResponse.status, errorText);
      return { success: false, status: authResponse.status, error: errorText };
    }
  } catch (error) {
    console.log('❌ API Connection Error:', error.message);
    return { success: false, error: error.message };
  }
};

// Instructions for fixing API authentication
export const API_SETUP_INSTRUCTIONS = `
🔧 API Setup Instructions for Firebase Authentication & Guest Users:

1. **Firebase Authentication Setup:**
   - ✅ Firebase is already configured in your app
   - ✅ Users can sign in via Firebase
   - ✅ ID tokens are automatically generated
   - ✅ Guest users are handled gracefully

2. **Vercel API Configuration:**
   - Go to your Vercel dashboard
   - Check your API route handlers (e.g., /api/quizzes.js)
   - Add Firebase Admin SDK to verify tokens
   - Handle guest users with X-User-Type header

3. **Firebase Admin SDK Setup in Vercel API (with Guest Support):**
   \`\`\`javascript
   // In your Vercel API route handler
   import admin from 'firebase-admin';
   
   // Initialize Firebase Admin (do this once)
   if (!admin.apps.length) {
     admin.initializeApp({
       credential: admin.credential.cert({
         projectId: process.env.FIREBASE_PROJECT_ID,
         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
         privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\\n')
       })
     });
   }
   
   export default async function handler(req, res) {
     // Set CORS headers
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:19006');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Type');
     
     // Check if user is guest or authenticated
     const userType = req.headers['x-user-type'];
     const authHeader = req.headers.authorization;
     
     let userInfo = null;
     
     if (userType === 'guest') {
       // Guest user - limited access
       console.log('👤 Guest user accessing API');
       userInfo = { type: 'guest', uid: null };
     } else if (authHeader && authHeader.startsWith('Bearer ')) {
       // Authenticated user - verify token
       const token = authHeader.split('Bearer ')[1];
       try {
         const decodedToken = await admin.auth().verifyIdToken(token);
         userInfo = { type: 'authenticated', uid: decodedToken.uid };
         console.log('🔐 Authenticated user:', decodedToken.uid);
       } catch (error) {
         return res.status(401).json({ error: 'Invalid token' });
       }
     } else {
       return res.status(401).json({ error: 'No valid authentication' });
     }
     
     // Your API logic here - userInfo contains user type and UID
     // You can provide different data/features based on user type
     
     if (userInfo.type === 'guest') {
       // Return limited data for guest users
       // Maybe basic quizzes without progress tracking
     } else {
       // Return full data for authenticated users
       // Include user-specific features like progress, favorites, etc.
     }
   }
   \`\`\`

4. **Guest User Features:**
   - ✅ Can access basic quiz content
   - ✅ Can take quizzes (but progress not saved)
   - ✅ Can view sign categories
   - ❌ Cannot save quiz results
   - ❌ Cannot access personalized features

5. **Authenticated User Features:**
   - ✅ Full access to all features
   - ✅ Quiz progress saved
   - ✅ Personalized recommendations
   - ✅ Quiz history tracking

6. **Environment Variables in Vercel:**
   Add these to your Vercel project settings:
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL  
   - FIREBASE_PRIVATE_KEY

7. **Test Both User Types:**
   - Test as guest user (not signed in)
   - Test as authenticated user (signed in)
   - Check console for different authentication status
   - Use testApiAndShowInstructions() to debug

8. **Current Status:**
   - ✅ Firebase auth configured in React Native app
   - ✅ ID tokens being sent with API requests
   - ✅ Guest users handled gracefully
   - ⏳ Vercel API needs Firebase Admin SDK setup
  `;
