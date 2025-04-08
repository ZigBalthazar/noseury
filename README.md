# noseury | Nostr Express API

A simple Express.js server that connects to a Nostr relay via WebSocket and returns matching events based on filters.
Designed to be deployed using Docker.

## Features

- Accepts a `relay` URL and `filters` as query parameters
- Connects to the Nostr relay using WebSocket
- Collects and returns matching events
- CORS enabled for browser access
- Dockerized for easy deployment

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/)

---

## 🚀 Running Locally

1. **Install dependencies:**

```bash
npm install
```

2. **Run in development mode (with hot reload):**

```bash
npm run dev
```

3. **Build and run production:**

```bash
npm run build
npm start
```

---

## 🌐 API Endpoint

```
GET /nostr-events?relay=<relay_url>&filters=<filters_json_string>
```

### Example:

```
GET http://localhost:3000/nostr-events?relay=wss://relay.nostr.example&filters=[{"kinds":[1],"limit":5}]
```

### Query Parameters:

| Param   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| `relay` | string | ✅ Yes    | WebSocket URL of the Nostr relay |
| `filters` | JSON string | ✅ Yes | Array of Nostr filters ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)) |

---

## 🐳 Docker

### Build and run with Docker:

```bash
docker build -t noseury .
docker run -p 3000:3000 noseury
```

### Or use Docker Compose:

```bash
docker-compose up --build
```

---

## 🧾 Example Filter

```json
[
  {
    "kinds": [1],
    "authors": ["<pubkey>"],
    "limit": 10
  }
]
```

---

## 📜 License

MIT
```