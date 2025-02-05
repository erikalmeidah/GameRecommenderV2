import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// my steam ID for testing: 76561198355838737

function App() {
  const [steamID, setSteamID] = useState('')
  const [userData, setUserData] = useState(null);
  const [games, setGames] = useState(null);
  const [genresPlaytime, setGenresPlaytime] = useState(null);
  const [gameRecommendations, setGameRecommendations] = useState(null);
  
  useEffect(() => {
    if (games) {
      handleGetGenresWithPlaytime();
    }
  }, [games]);

  useEffect(() => {
    if (genresPlaytime) {
      handleRecommendations();
    }
  }, [genresPlaytime]);

  const getTop3Genres = () => {
    if (typeof genresPlaytime !== 'object' || genresPlaytime === null) {
      console.error('Expected genresPlaytime to be an object, but got:', genresPlaytime);
      return [];
    }
  
    const genresArray = Object.entries(genresPlaytime).map(([genre, playtime]) => ({
      genre,
      playtime,
    }));
  
    return genresArray
      .sort((a, b) => b.playtime - a.playtime)
      .slice(0, 3) // Get top 3
      .map(item => item.genre);
  };
  

  const handleRecommendations = async () => {
    const topGenres = getTop3Genres();
    try {
      const response = await axios.post('http://localhost:5000/recommendations', {
        genresPlaytime: topGenres,
      });
      setGameRecommendations(response.data);
    } catch (error) {
      setGameRecommendations([]);
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleGoClick = async () => {
    try {
      setGames(null);
      setGenresPlaytime(null);
      setGameRecommendations(null);
      const response = await fetch(`/api/getUserData?steamID=${steamID}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data.error) {
        setUserData(null);
      } else {
        setUserData(data);
      }
    } catch (err) {
      setUserData(null);
    }
  };

  const handleGetGames = async () => {
    try {
      const response = await fetch(`/api/getUserGames?steamID=${steamID}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
  
      const games = await response.json();
      setGames(games);
    } catch (err) {
      setGames(null);
    }
  };
  
  const handleGetGenresWithPlaytime = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getGenresWithPlaytime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ games: JSON.stringify(games) }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch genres with playtime');
      }
  
      const data = await response.json();
      setGenresPlaytime(data);
    } catch (err) {
      console.error(err);
    }
  };  

  const getTopGames = () => {
    if (!games) return [];

    const sortedGames = [...games].sort((a, b) => b.playtime_forever - a.playtime_forever);
    return sortedGames.slice(0, 8);
  };

  return (
    <>
      <div className='titleContainer'>
        <h1 className='title'>
          Steam Game Recommender 2.0
        </h1>

        <img className='steamImage' src='/steam.png' alt="Steam logo"></img>
      </div>
      
      <div className='inputContainer'>
        <h2 className='inputPrompt'>
          Enter your public steam ID:
        </h2>
        
        <input
          className='input' 
          type='text' 
          placeholder='Steam ID' 
          value={steamID}
          onChange={(e) => setSteamID(e.target.value)}
        ></input>
        
        <button
          className='inputButton'
          onClick={() => {
            handleGoClick();
            handleGetGames();
          }}          
        >
          Go
        </button>
      </div>

      {userData && (
        <div className='userContainer'>
          <a className='profileLink' href={userData.profileurl} target="_blank" rel="noopener noreferrer">
            <p className='profileName'>
              {userData.personaname}
            </p>
            <img className='profileImage' src={userData.avatarfull} alt="User Avatar" />
          </a>
        </div>
      )}

      {games ? (
        genresPlaytime && gameRecommendations ? (
          <div className='userDataContainer'>
            <h3 className='gamesContainerTitle'>Top 10 Game Recommendations</h3>
            <div className='gamesRecommendationContainer'>
                {gameRecommendations.map((game, index) => (
                  <div key={index} className="gameRecommendationEntry">
                    <p>{index + 1}</p>
                    <p>Name: {game.name}</p>
                    <p>Rating: {game.rating}</p>
                  </div>
                ))}
            </div>

            <div className='genresContainer'>
              <h3>User's Top Genres</h3>
              {Object.entries(genresPlaytime)
                .filter(([genre, playtime]) => playtime > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([genre, playtime], index) => (
                  <div key={index} className="genreItem">
                    <p>{genre}: {playtime} minutes</p>
                  </div>
                ))
              }
            </div>

            <div>
              <h3 className='gamesContainerTitle'>User's Top Games</h3>
              <div className='gamesContainer'>
                {getTopGames().map((game, index) => (
                  <div className='gameCard' key={game.appid}>
                    <p className='gameTitle'>
                      {game.name}
                    </p>
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                      alt={game.name}
                      className='gameImage'>
                    </img>
                    <p className='gamePlayTime'>
                      {game.playtime_forever} minutes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='loading'>
            Loading...
          </div>
        )
      ) : null}
    </>
  )
}

export default App
