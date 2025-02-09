# 🛠 Admin API Endpoints

## 📍 Overview

The Admin API provides endpoints for managing system data, accounts, and monitoring service health.

### 🔹 Base URL

```plaintext
https://chatcx.com/api/
```

---

## 📌 Endpoints

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| `POST` | `/admin/insert` | Insert data into the system. |
| `GET`  | `/`             | Retrieve account details.    |
| `GET`  | `/health`       | Check API health status.     |

---

## 🔑 Insert Accounts to Track and Analyse

### 🔹 Request

```http
POST /api/admin/insert
Host: chatcx.com
Content-Type: application/json
x-api-key: YOUR_ADMIN_KEY
```

```json
{
  "file": "csv with Twitter/X usernames"
}
```

### 🔹 Response

```json
{
  "success": true,
  "message": "Data inserted successfully."
}
```

---

## 🔍 Retrieve Account Details

### 🔹 Request

```http
GET /api
Host: chatcx.com
x-api-key: YOUR_ADMIN_KEY
```

### 🔹 Response

```json
[
    "0xBalloonLover",
    "0xCygaar",
    "0xMert_",
    "..."
    "zachxbt",
    "zackvoell"
]
```

---

## 🔄 API Health Check

### 🔹 Request

```http
GET /api/health
Host: chatcx.com
```

### 🔹 Response

```json
{
  "success": true,
  "status": "healthy"
}
```
