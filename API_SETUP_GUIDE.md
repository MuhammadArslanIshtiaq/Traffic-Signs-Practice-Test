# API Setup Guide - Solving CORS & Authentication Issues

## 🔧 **Current Issues**
1. **CORS Policy**: API blocks requests from localhost:19006
2. **401 Unauthorized**: API requires authentication

## 🚀 **Solution Options**

### **Option 1: API Key Authentication (Recommended)**

#### Step 1: Get API Key
You need to obtain an API key from your Vercel API. Contact your API administrator or check:
- Vercel dashboard settings
- API documentation
- Environment variables

#### Step 2: Update Configuration
Replace `YOUR_API_KEY_HERE` in `src/config/supabase.js`:

```javascript
const API_KEY = 'your_actual_api_key_here';
```

#### Step 3: Test API
The app will now:
1. Try to fetch from API with authentication
2. Fallback to mock data if API fails
3. Log success/failure in console

### **Option 2: CORS Proxy (Alternative)**

If you can't get API keys, use a CORS proxy:

```javascript
// Replace API_BASE_URL with:
const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://sup-admin-quizly.vercel.app/api';
```

### **Option 3: Vercel API Configuration**

#### Update Vercel API CORS Settings
Add to your Vercel API configuration:

```javascript
// In your API route handlers
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Your API logic here
}
```

### **Option 4: Environment Variables**

Create `.env` file in your project root:

```env
REACT_APP_API_KEY=your_api_key_here
REACT_APP_API_URL=https://sup-admin-quizly.vercel.app/api
```

Then update `src/config/supabase.js`:

```javascript
const API_KEY = process.env.REACT_APP_API_KEY;
const API_BASE_URL = process.env.REACT_APP_API_URL;
```

## 🧪 **Testing Steps**

1. **Get API Key** from your Vercel API administrator
2. **Update the configuration** in `src/config/supabase.js`
3. **Run the app** and check console logs
4. **Navigate to a quiz** and see if API data loads
5. **Check console** for success/error messages

## 📊 **Expected Console Output**

### Success:
```
Attempting to fetch quiz questions for category: mandatory
All quizzes from API: [...]
Quiz data with questions from API: {...}
```

### Fallback to Mock:
```
API fetch failed, using mock data: HTTP error! status: 401
Using mock data for category: mandatory
```

## 🔍 **Debugging**

### Check API Response:
```javascript
// Add this to see detailed error info
if (!response.ok) {
  const errorText = await response.text();
  console.error('API Error:', response.status, errorText);
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

### Test API Directly:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Origin: http://localhost:19006" \
     https://sup-admin-quizly.vercel.app/api/quizzes
```

## 🎯 **Next Steps**

1. **Contact API Administrator** to get proper API key
2. **Update the configuration** with real API key
3. **Test the integration** with real data
4. **Remove mock data** once API is working

## 📞 **Support**

If you need help:
1. Check Vercel API documentation
2. Contact your API administrator
3. Verify API endpoints are working
4. Check network tab in browser dev tools

---

**Note**: The app currently works with mock data, so you can continue development while resolving API issues.
