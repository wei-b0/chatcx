# ⏳ Check Job Status

Check the processing status of a submitted query.

## 🔹 Request

```http
GET /api/chat/:chatId
Host: chatcx.com
x-api-key: YOUR_APP_KEY
```

## 🔹 Response (Processing)

```json
{
  "status": "processing"
}
```

## 🔹 Response (Completed)

```json
{
  "status": "completed",
  "result": {
    "answer": "DeFi trends include RWA tokenization...",
    "metadata": {
      "last_updated": "2024-02-07T14:23:45.123Z"
    }
  }
}
```
