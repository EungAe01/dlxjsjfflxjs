const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type = 'news' } = req.query; // Default to 'news' if no type is provided
    const apiUrl = `https://playeternalreturn.com/api/v1/posts/${type}?page=1`;
    const { data } = await axios.get(apiUrl);

    console.log('Full API response:', data); // Log the full API response

    let newsArray = [];

    // Check for common nesting patterns or assume data is the array
    if (data && Array.isArray(data.data)) {
      newsArray = data.data;
    } else if (data && Array.isArray(data.posts)) {
      newsArray = data.posts;
    } else if (data && Array.isArray(data)) {
      newsArray = data;
    } else {
      console.error('Unexpected API response format:', data);
      return res.status(500).json({ message: 'Unexpected API response format' });
    }

    const news = newsArray.map((item) => ({
      title: item.title,
      link: item.link,
      imageUrl: item.thumbnail || item.image, // Use thumbnail or image, adjust as needed
      date: item.date, // Adjust property name as needed
    }));

    res.json(news);
  } catch (error) {
    console.error(`Error fetching ${req.query.type || 'news'} from API:`, error.message); // Log the error
    res.status(500).json({ message: 'Error fetching news' });
  }
});

module.exports = router;