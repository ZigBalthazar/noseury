import express from 'express';
import { Request, Response } from 'express';
import WebSocket from 'ws';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.get('/nostr-events', async (req: Request, res: Response) => {
  const { relay, filters } = req.query;

  if (!relay || !filters) {
    return res.status(400).json({ error: 'Missing relay or filters' });
  }

  try {
    const parsedFilters = JSON.parse(filters as string);
    const ws = new WebSocket(relay as string);

    const events: any[] = [];
    let lastTimestamp = 0;

    ws.on('open', () => {
      const subscriptionId = Math.random().toString(36).substring(2, 15);
      console.log('WebSocket opened. Sending subscription:', {
        subscriptionId,
        filters: parsedFilters,
      });
      ws.send(JSON.stringify(['REQ', subscriptionId, ...parsedFilters]));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message[0] === 'EVENT') {
          const event = message[2];
          events.push(event);
          lastTimestamp = Math.max(lastTimestamp, event.created_at);
        } else if (message[0] === 'EOSE') {
          ws.close();
          events.sort((a, b) => b.created_at - a.created_at);
          return res.json({ events, lastTimestamp });
        }
      } catch (e) {
        console.error('Response parse error:', e, data.toString());
        return res.status(500).json({ error: 'Error parsing WebSocket message' });
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      return res.status(500).json({ error: 'WebSocket error occurred' });
    });

    ws.on('close', () => {
      console.log('WebSocket closed.');
    });
  } catch (e) {
    console.error('Invalid filters:', e);
    return res.status(400).json({ error: 'Invalid filters' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
