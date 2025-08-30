# 📡 Public API Documentation

This document provides comprehensive information about all public API endpoints available in the Quiz App. These endpoints are designed for external applications and do not require authentication.

## 🌐 Base URL
```
https://sup-admin-quizly.vercel.app/api/public
```

## 🔒 Authentication
**None required** - All public endpoints are accessible without authentication.

## 📋 Common Response Headers
All endpoints include CORS headers for cross-origin access:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, x-firebase-token
Content-Type: application/json
```

## 🎯 Common Response Structure
All endpoints follow this response structure:
```json
{
  "success": true|false,
  "data": {}, // or specific field name
  "message": "Error message (only when success: false)"
}
```

---

## 📚 Quiz Endpoints

### 1. Get All Quizzes
**Endpoint:** `GET /api/public/quizzes`

**Description:** Retrieve a list of all available quizzes with basic information.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "total_quizzes": 3,
    "quizzes": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Road Signs Quiz - Beginner",
        "description": "Test your knowledge of basic road signs",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T12:15:00.000Z",
        "total_questions": 15
      }
    ]
  }
}
```

### 2. Get Specific Quiz with Questions
**Endpoint:** `GET /api/public/quizzes/{id}`

**Description:** Retrieve complete quiz data including all questions, options, and related signs.

**Parameters:**
- `id` (string): Quiz UUID

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Road Signs Quiz - Beginner",
    "description": "Test your knowledge of basic road signs",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T12:15:00.000Z",
    "total_questions": 15,
    "questions": [
      {
        "id": "q1-uuid",
        "question_text": "What does this sign mean?",
        "secondary_languages": {
          "urdu": "یہ نشان کا کیا مطلب ہے؟"
        },
        "order": 1,
        "sign": {
          "id": "sign-uuid",
          "image_url": "https://example.com/signs/stop.png",
          "title_en": "Stop Sign",
          "english_description": "Complete stop required",
          "sign_type": "mandatory",
          "secondary_languages": {
            "urdu": {
              "title": "رک جانا",
              "description": "مکمل رک جانا ضروری"
            }
          }
        },
        "options": [
          {
            "id": "opt1-uuid",
            "option_text": "Stop completely",
            "secondary_languages": {
              "urdu": "مکمل رک جانا"
            },
            "option_letter": "A",
            "is_correct": true
          },
          {
            "id": "opt2-uuid",
            "option_text": "Slow down",
            "secondary_languages": {
              "urdu": "آہستہ کریں"
            },
            "option_letter": "B",
            "is_correct": false
          }
        ]
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Quiz not found"
}
```

---

## ❓ Question Endpoints

### 3. Get All Questions
**Endpoint:** `GET /api/public/questions`

**Description:** Retrieve all questions with their options and associated traffic signs.

**Response Example:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1-uuid",
      "question_text": "What does this sign mean?",
      "secondary_languages": {
        "urdu": "یہ نشان کا کیا مطلب ہے؟"
      },
      "tags": ["PK", "Stag"],
      "created_at": "2024-01-15T10:30:00.000Z",
      "sign": {
        "id": "sign-uuid",
        "image_url": "https://example.com/signs/stop.png",
        "title_en": "Stop Sign",
        "english_description": "Complete stop required",
        "sign_type": "mandatory",
        "secondary_languages": {
          "urdu": {
            "title": "رک جانا",
            "description": "مکمل رک جانا ضروری"
          }
        }
      },
      "options": [
        {
          "id": "opt1-uuid",
          "option_text": "Stop completely",
          "secondary_languages": {
            "urdu": "مکمل رک جانا"
          },
          "option_letter": "A",
          "is_correct": true
        }
      ]
    }
  ]
}
```

---

## 🚧 Traffic Signs Endpoints

### 4. Get All Traffic Signs
**Endpoint:** `GET /api/public/signs`

**Description:** Retrieve all traffic signs with their details and images.

**Response Example:**
```json
{
  "success": true,
  "signs": [
    {
      "id": "sign-uuid",
      "image_url": "https://example.com/signs/stop.png",
      "title_en": "Stop Sign",
      "english_description": "Complete stop required at intersection",
      "sign_type": "mandatory",
      "secondary_languages": {
        "urdu": {
          "title": "رک جانا",
          "description": "چوراہے پر مکمل رک جانا ضروری"
        }
      },
      "created_at": "2024-01-15T08:00:00.000Z"
    }
  ]
}
```

---

## ℹ️ General Information Endpoints

### 5. Get All General Information (Combined)
**Endpoint:** `GET /api/public/general-info`

**Description:** Retrieve all general information including requirements, license fees, fines, and videos in one response.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "requirements": [
      {
        "id": "req-uuid",
        "title": "Driver License Requirements",
        "description": "Basic requirements for obtaining a driver license",
        "rich_content": "<p>You must be <strong>18 years or older</strong>...</p>",
        "tags": ["PK", "license"],
        "created_at": "2024-01-15T09:00:00.000Z"
      }
    ],
    "licenseFees": [
      {
        "id": "fee-uuid",
        "title": "Motorcycle License Fee",
        "description": "Fee structure for motorcycle licenses",
        "rich_content": "<p>Current fee structure...</p>",
        "data": {
          "amount": 2000,
          "currency": "PKR",
          "validity": "5 years",
          "renewal_fee": 1500
        },
        "tags": ["PK", "motorcycle"],
        "created_at": "2024-01-15T09:30:00.000Z"
      }
    ],
    "fines": [
      {
        "id": "fine-uuid",
        "title": "Speeding Violations",
        "description": "Fines for various speeding violations",
        "rich_content": "<p>Speed limit violations...</p>",
        "data": {
          "minor_violation": {
            "amount": 1000,
            "currency": "PKR",
            "speed_range": "1-20 km/h over limit"
          },
          "major_violation": {
            "amount": 5000,
            "currency": "PKR",
            "speed_range": "21+ km/h over limit"
          }
        },
        "tags": ["PK", "traffic"],
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "videos": [
      {
        "id": "video-uuid",
        "title": "Traffic Rules Tutorial",
        "description": "Comprehensive guide to traffic rules",
        "rich_content": "<p>Watch this tutorial...</p>",
        "data": {
          "video_url": "https://example.com/video.mp4",
          "duration": "15:30",
          "language": "english",
          "subtitles": ["english", "urdu"],
          "quality": ["720p", "1080p"]
        },
        "tags": ["PK", "educational"],
        "created_at": "2024-01-15T11:00:00.000Z"
      }
    ]
  },
  "metadata": {
    "counts": {
      "requirements": 5,
      "licenseFees": 3,
      "fines": 8,
      "videos": 2,
      "total": 18
    },
    "availableTags": ["PK", "IN", "Stag", "license", "motorcycle", "traffic", "educational"],
    "last_updated": "2024-01-15T12:00:00.000Z"
  }
}
```

### 6. Get Requirements Only
**Endpoint:** `GET /api/public/requirements`

**Description:** Retrieve only requirements/general information.

**Response Example:**
```json
{
  "success": true,
  "requirements": [
    {
      "id": "req-uuid",
      "title": "Driver License Requirements",
      "description": "Basic requirements for obtaining a driver license",
      "rich_content": "<p>You must be <strong>18 years or older</strong>...</p>",
      "tags": ["PK", "license"],
      "created_at": "2024-01-15T09:00:00.000Z"
    }
  ],
  "count": 5,
  "last_updated": "2024-01-15T12:00:00.000Z"
}
```

### 7. Get License Fees Only
**Endpoint:** `GET /api/public/license-fees`

**Description:** Retrieve only license fee information.

**Response Example:**
```json
{
  "success": true,
  "licenseFees": [
    {
      "id": "fee-uuid",
      "title": "Motorcycle License Fee",
      "description": "Fee structure for motorcycle licenses",
      "rich_content": "<p>Current fee structure...</p>",
      "data": {
        "amount": 2000,
        "currency": "PKR",
        "validity": "5 years",
        "renewal_fee": 1500
      },
      "tags": ["PK", "motorcycle"],
      "created_at": "2024-01-15T09:30:00.000Z"
    }
  ],
  "count": 3,
  "last_updated": "2024-01-15T12:00:00.000Z"
}
```

### 8. Get Fines Only
**Endpoint:** `GET /api/public/fines`

**Description:** Retrieve only traffic fine information.

**Response Example:**
```json
{
  "success": true,
  "fines": [
    {
      "id": "fine-uuid",
      "title": "Speeding Violations",
      "description": "Fines for various speeding violations",
      "rich_content": "<p>Speed limit violations...</p>",
      "data": {
        "minor_violation": {
          "amount": 1000,
          "currency": "PKR",
          "speed_range": "1-20 km/h over limit"
        },
        "major_violation": {
          "amount": 5000,
          "currency": "PKR",
          "speed_range": "21+ km/h over limit"
        }
      },
      "tags": ["PK", "traffic"],
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 8,
  "last_updated": "2024-01-15T12:00:00.000Z"
}
```

### 9. Get Videos Only
**Endpoint:** `GET /api/public/videos`

**Description:** Retrieve only video information.

**Response Example:**
```json
{
  "success": true,
  "videos": [
    {
      "id": "video-uuid",
      "title": "Traffic Rules Tutorial",
      "description": "Comprehensive guide to traffic rules",
      "rich_content": "<p>Watch this tutorial...</p>",
      "data": {
        "video_url": "https://example.com/video.mp4",
        "duration": "15:30",
        "language": "english",
        "subtitles": ["english", "urdu"],
        "quality": ["720p", "1080p"],
        "thumbnail": "https://example.com/thumb.jpg"
      },
      "tags": ["PK", "educational"],
      "created_at": "2024-01-15T11:00:00.000Z"
    }
  ],
  "count": 2,
  "last_updated": "2024-01-15T12:00:00.000Z"
}
```

---

## 🚨 Error Responses

### Common Error Codes
- **400** - Bad Request (invalid parameters)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (database or server issues)

### Error Response Format
```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "Technical error details (in development mode)"
}
```

---

## 📊 Data Types and Structures

### Common Fields
- **`id`**: UUID string (unique identifier)
- **`created_at`**: ISO 8601 timestamp
- **`updated_at`**: ISO 8601 timestamp
- **`tags`**: Array of strings (country codes, categories)
- **`secondary_languages`**: Object with language-specific translations

### Tag System
- **Country Codes**: `PK` (Pakistan), `IN` (India), etc.
- **Sign Tag**: `Stag` (automatically assigned to questions with traffic signs)
- **Custom Tags**: Any string for categorization

### Rich Content
HTML content stored as string, sanitized for safe display:
```html
<p>You must be <strong>18 years or older</strong> to apply.</p>
<ul>
  <li>Valid CNIC</li>
  <li>Medical certificate</li>
</ul>
```

### JSON Data Structure
Flexible JSON objects for dynamic data (fees, fines, videos):
```json
{
  "amount": 2000,
  "currency": "PKR",
  "validity": "5 years",
  "categories": ["motorcycle", "car"],
  "additional_fees": {
    "test_fee": 500,
    "processing_fee": 200
  }
}
```

---

## 🔄 Client-Side Filtering

Since all endpoints return complete datasets, implement client-side filtering for better performance:

### Filter by Tags
```javascript
const filteredData = allData.filter(item => 
  item.tags && item.tags.includes('PK')
)
```

### Filter by Date Range
```javascript
const recentData = allData.filter(item => {
  const itemDate = new Date(item.created_at)
  const cutoffDate = new Date('2024-01-01')
  return itemDate >= cutoffDate
})
```

### Search by Text
```javascript
const searchResults = allData.filter(item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.description.toLowerCase().includes(searchTerm.toLowerCase())
)
```

---

## 🛠️ Usage Examples

### Fetch All Quizzes (JavaScript)
```javascript
async function fetchQuizzes() {
  try {
    const response = await fetch('/api/public/quizzes')
    const data = await response.json()
    
    if (data.success) {
      console.log(`Found ${data.data.total_quizzes} quizzes`)
      return data.data.quizzes
    } else {
      console.error('Error:', data.message)
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}
```

### Fetch Specific Quiz with Questions
```javascript
async function fetchQuizDetails(quizId) {
  try {
    const response = await fetch(`/api/public/quizzes/${quizId}`)
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Error fetching quiz:', error)
  }
}
```

### Fetch and Filter General Info
```javascript
async function fetchPakistanRequirements() {
  try {
    const response = await fetch('/api/public/general-info')
    const data = await response.json()
    
    if (data.success) {
      // Filter for Pakistan-specific requirements
      const pkRequirements = data.data.requirements.filter(req =>
        req.tags && req.tags.includes('PK')
      )
      return pkRequirements
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

---

## 📱 Mobile App Integration

### React Native Example
```javascript
import React, { useState, useEffect } from 'react'

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('https://your-domain.com/api/public/quizzes')
      const data = await response.json()
      
      if (data.success) {
        setQuizzes(data.data.quizzes)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Your UI components
  )
}
```

---

## 📈 Rate Limiting and Best Practices

### Recommendations
1. **Cache responses** when possible to reduce API calls
2. **Implement client-side filtering** instead of multiple API requests
3. **Use the combined endpoints** (`/general-info`) for efficiency
4. **Handle errors gracefully** with appropriate user feedback
5. **Implement loading states** for better user experience

### Performance Tips
- Fetch large datasets once and filter locally
- Use pagination for displaying large lists
- Implement search debouncing for real-time search
- Cache static data (signs, requirements) in local storage

---

## 📞 Support

For API support or questions:
- Check the error messages for specific guidance
- Verify your endpoint URLs and request format
- Ensure proper error handling in your application

**Note:** This API is designed for public access and educational purposes. Please use responsibly and implement appropriate rate limiting in your applications.
