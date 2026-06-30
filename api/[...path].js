// Vercel Serverless Function — proxy all /api/* requests to Render backend
// This runs SERVER-SIDE, so there is zero CORS issue for the browser.

const BACKEND_URL = 'https://smart-ration-g21u.onrender.com';

export default async function handler(req, res) {
  const targetUrl = `${BACKEND_URL}${req.url}`;

  const fetchOptions = {
    method: req.method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(targetUrl, fetchOptions);
    const text = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json').end(text);
  } catch (err) {
    res.status(502).json({ error: 'Backend unreachable', detail: err.message });
  }
}
