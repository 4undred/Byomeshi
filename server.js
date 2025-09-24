// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');

// Node.js v18以降ではfetchが標準対応
// v17以前を使う場合は node-fetch をインポートする必要がある
let fetchFn;
try {
  fetchFn = fetch; // 標準fetch
} catch (e) {
  fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.HOTPEPPER_API_KEY;

if (!API_KEY) {
  console.error('Error: HOTPEPPER_API_KEY is not set in .env');
  process.exit(1);
}

// 静的ファイル配信
app.use(express.static(path.join(__dirname, 'public')));

// APIエンドポイント
app.get('/api/search', async (req, res) => {
  try {
    const { lat, lng, range = 3, genre = '', keyword = '', count = 30, budget = '' } = req.query;
    const baseUrl = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/';

    const params = new URLSearchParams({
      key: API_KEY,
      format: 'json',
      count: count.toString(),
      range: range.toString(),
    });

    if (lat && lng) {
      params.set('lat', lat);
      params.set('lng', lng);
    }
    if (genre) params.set('genre', genre);
    if (keyword) params.set('keyword', keyword);
    if (budget) params.set('budget', budget);

    const url = `${baseUrl}?${params.toString()}`;
    console.log(url);
    const response = await fetchFn(url);
    if (!response.ok) throw new Error(`Hot Pepper API Error: ${response.status}`);

    const data = await response.json();
    const shops = data.results?.shop || [];
    res.json({ shops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/api/genres', async (req, res) => {
  try {
    const baseUrl = 'http://webservice.recruit.co.jp/hotpepper/genre/v1/';
    const params = new URLSearchParams({
      key: API_KEY,
      format: 'json',
    });
    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetchFn(url);
    if (!response.ok) throw new Error(`Hot Pepper Genre API Error: ${response.status}`);
    const data = await response.json();
    const genres = data.results?.genre || [];
    res.json({ genres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/api/budgets', async (req, res) => {
  try {
    const baseUrl = 'http://webservice.recruit.co.jp/hotpepper/budget/v1/';
    const params = new URLSearchParams({
      key: API_KEY,
      format: 'json',
    });
    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetchFn(url);
    if (!response.ok) throw new Error(`Hot Pepper Budget API Error: ${response.status}`);
    const data = await response.json();
    const budgets = data.results?.budget || [];
    res.json({ budgets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});