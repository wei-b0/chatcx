# 📜 List API Keys (Admin Only)

Retrieve all API keys.

## 🔹 Request
```http
GET /api/api-keys
Host: chatcx.com
x-api-key: YOUR_ADMIN_KEY
```

## 🔹 Response
```json
{
  "success": true,
  "apiKeys": [
    {
      "key": "api_123456abcd",
      "role": "app",
      "created_at": "2024-02-07T12:00:00Z"
    }
  ]
}
```
