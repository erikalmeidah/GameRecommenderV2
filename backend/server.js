require('dotenv').config({path: '../.env'});

const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;
//const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'games.db'));
const db = new sqlite3.Database('/app/database/games.db'); // mount to docker volume
app.use(express.json());
app.use(cors());

const steamAPIKey = process.env.STEAM_API_KEY;
const rawgAPIKey = process.env.RAWG_API_KEY;

// Endpoint to get all games from the SQLite database of matching genres
app.post('/recommendations', (req, res) => {
  const { genresPlaytime } = req.body;
  const sqlQuery = `
    SELECT DISTINCT name, rating, genres
    FROM games_info
    WHERE genres LIKE ? OR genres LIKE ? OR genres LIKE ?
    ORDER BY rating DESC
    LIMIT 10
  `;
  const queryParams = genresPlaytime.map(genre => `%${genre}%`);

  db.all(sqlQuery, queryParams, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Error fetching game recommendations' });
    }

    res.json(rows);
  });
});

// Endpoint to get player data
app.get('/api/getUserData', async (req, res) => {
  const steamID = req.query.steamID;
  if (!steamID) {
    return res.status(400).json({ error: 'Steam ID is required' });
  }

  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamAPIKey}&steamids=${steamID}`;
    
    const response = await axios.get(url);
    
    if (response.data.response.players.length > 0) {
      res.json(response.data.response.players[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Steam API' });
  }
});

// Endpoint to get player games and playtimes
app.get('/api/getUserGames', async (req, res) => {
  const steamID = req.query.steamID;

  if (!steamID) {
    return res.status(400).json({ error: 'Steam ID is required' });
  }

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamAPIKey}&steamid=${steamID}&include_appinfo=true&include_played_free_games=true`;

    const response = await axios.get(url);
    const games = response.data.response.games || [];

    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch game data from Steam API' });
  }
});

// Endpoint for genre data
app.post('/api/getGenresWithPlaytime', async (req, res) => {
  const { games } = req.body;

  try {
    const gamesList = JSON.parse(games);
    const genresPlaytime = {};

    for (const game of gamesList) {
      const rawgResponse = await fetch(`https://api.rawg.io/api/games?key=${rawgAPIKey}&search=${game.name}`);
      
      if (!rawgResponse.ok) {
        throw new Error('Failed to fetch genre from RAWG API');
      }

      const rawgData = await rawgResponse.json();
      const firstMatchGame = rawgData.results[0]; // Taking the first game result as a match

      if (firstMatchGame && firstMatchGame.genres) {
        firstMatchGame.genres.forEach((genre) => {
          if (!genresPlaytime[genre.name]) {
            genresPlaytime[genre.name] = 0;
          }
          genresPlaytime[genre.name] += game.playtime_forever;
        });
      }
    }

    res.json(genresPlaytime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Test server connection
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
