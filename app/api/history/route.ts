import { kv } from '@vercel/kv';
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

// Initialize the CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET'],
    origin: '*',
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const history = await kv.lrange(`user:${userId}:history`, 0, -1);
      return res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ message: 'Failed to fetch history. Please try again.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
