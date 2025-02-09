# 🛠 Integration Guide

## Step 1: Submit a Query

```typescript
const response = await axios.post(
  API_URL,
  { query: "DeFi trends" },
  {
    headers: { "x-api-key": API_KEY },
  }
);
const chatId = response.data.chatId;
```

## Step 2: Poll for Status

```typescript
const statusResponse = await axios.get(`${API_URL}/status/${chatId}`, {
  headers: { "x-api-key": API_KEY },
});
if (statusResponse.data.status === "completed") {
  console.log(statusResponse.data.result.answer);
}
```
