# 📝 Submit a Query

Submit a Web3 query & receive a Job ID.

## 🔹 Request

```http
POST /api/chat
Host: chatcx.com
Content-Type: application/json
x-api-key: YOUR_APP_KEY
```

```json
{
  "query": "What are the latest trends in DeFi?"
}
```

## 🔹 Response

```json
{
  "success": true,
  "chatId": "1234-5678-91011",
  "message": "Processing request, check status later."
}
```
