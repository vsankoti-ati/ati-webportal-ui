import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Health check endpoint for Docker container
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ati-webportal-ui',
    version: process.env.npm_package_version || '0.1.0'
  });
}