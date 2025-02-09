# 🔑 Manage API Keys (Admin Only)

## Create a New API Key

### 🔹 Request

```http
POST /api/admin/api-keys
Host: chatcx.com
x-api-key: YOUR_ADMIN_KEY
Content-Type: application/json
```

```json
{
  "role": "app",
  "username": ""
}
```

### 🔹 Response

```json
{
  "success": true,
  "apiKey": "api_123456abcd",
  "role": "app"
}
```
