require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const BSER_API_KEY = process.env.BSER_API_KEY;
const API_BASE_URL = 'https://open-api.bser.io'; // Changed to base URL for v2

// Serve static image files
const imageBasePath = path.join(__dirname, '../../');

app.use('/images/Item', express.static(path.join(imageBasePath, 'Item')));
app.use('/images/Loadout', express.static(path.join(imageBasePath, 'Loadout')));
app.use(
  '/images/RankTier',
  express.static(path.join(imageBasePath, 'Rank Tier'))
);

let characterDataCache = {}; // In-memory cache for character data

// Function to fetch and cache character data
const fetchCharacterData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v2/data/Character`, {
      headers: {
        'x-api-key': BSER_API_KEY,
      },
    });
    // Assuming response.data.data is an array of character objects with 'code' and 'name'
    response.data.data.forEach((char) => {
      characterDataCache[char.code] = char.name;
    });
    console.log('Character data fetched and cached successfully.');
  } catch (error) {
    console.error(
      'Error fetching character data:',
      error.response ? error.response.data : error.message
    );
  }
};

// Fetch character data on server start
fetchCharacterData();

// Get User Number (existing)
app.get('/api/user/:nickname', async (req, res) => {
  const { nickname } = req.params;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/v1/user/nickname?query=${nickname}`,
      {
        headers: {
          'x-api-key': BSER_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      'Error fetching user number:',
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({
        message: error.response
          ? error.response.data.message
          : 'Internal Server Error',
      });
  }
});

// Get User Games (existing)
app.get('/api/user/:userNum/games', async (req, res) => {
  const { userNum } = req.params;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/v1/user/games/${userNum}`,
      {
        headers: {
          'x-api-key': BSER_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      'Error fetching user games:',
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({
        message: error.response
          ? error.response.data.message
          : 'Internal Server Error',
      });
  }
});

// Get Match Results (existing)
app.get('/api/games/:gameId', async (req, res) => {
  const { gameId } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/games/${gameId}`, {
      headers: {
        'x-api-key': BSER_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      'Error fetching match results:',
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({
        message: error.response
          ? error.response.data.message
          : 'Internal Server Error',
      });
  }
});

// Get User Rank (existing)
app.get(
  '/api/user/:userNum/rank/:seasonId/:matchingTeamMode',
  async (req, res) => {
    const { userNum, seasonId, matchingTeamMode } = req.params;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/v1/rank/${userNum}/${seasonId}/${matchingTeamMode}`,
        {
          headers: {
            'x-api-key': BSER_API_KEY,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        'Error fetching user rank:',
        error.response ? error.response.data : error.message
      );
      res
        .status(error.response ? error.response.status : 500)
        .json({
          message: error.response
            ? error.response.data.message
            : 'Internal Server Error',
        });
    }
  }
);

// New: Get character name by code
app.get('/api/character-name/:characterCode', (req, res) => {
  const { characterCode } = req.params;
  const characterName = characterDataCache[characterCode];
  if (characterName) {
    res.json({ name: characterName });
  } else {
    res.status(404).json({ message: 'Character not found' });
  }
});

// New: Get season data
app.get('/api/season', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v2/data/Season`, {
      headers: {
        'x-api-key': BSER_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      'Error fetching season data:',
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({
        message: error.response
          ? error.response.data.message
          : 'Internal Server Error',
      });
  }
});

const newsRouter = require('./news');

app.use('/api/news', newsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
