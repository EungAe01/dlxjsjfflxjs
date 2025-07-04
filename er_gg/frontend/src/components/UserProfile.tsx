import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// import { getRankTierImage } from '../utils/imageUtils'; // Removed import

interface UserData {
  user: {
    userNum: number;
    nickname: string;
  };
}

interface UserRank {
  userRank: {
    userNum: number;
    mmr: number;
    nickname: string;
    rank: number;
    rankPercent: number;
    seasonId: number;
    matchingMode: number;
    matchingTeamMode: number;
  };
}

interface UserGame {
  gameId: number;
  matchingMode: number;
  matchingTeamMode: number;
  seasonId: number;
  // Add more fields as needed from the API response
}

function UserProfile() {
  const { nickname } = useParams<{ nickname: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user number and basic info
        const userResponse = await axios.get(`http://localhost:5000/api/user/${nickname}`);
        const userNum = userResponse.data.user.userNum;
        setUserData(userResponse.data);

        // Fetch user rank (using default seasonId and matchingTeamMode for now)
        // You might want to let the user select these in the future
        const rankResponse = await axios.get(`http://localhost:5000/api/user/${userNum}/rank/0/1`); // seasonId: 0 (Normal), matchingTeamMode: 1 (Solo)
        setUserRank(rankResponse.data);

        // Fetch user games
        const gamesResponse = await axios.get(`http://localhost:5000/api/user/${userNum}/games`);
        setUserGames(gamesResponse.data.userGames);

      } catch (err) {
        setError('Failed to fetch user data. Please check the nickname and try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [nickname]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center mt-5">No user data found.</div>;
  }

  return (
    <div className="mt-5">
      <h2 className="mb-4">User Profile: {userData.user.nickname}</h2>
      <p>User Number: {userData.user.userNum}</p>

      {userRank && userRank.userRank && (
        <div className="mt-4">
          <h3>Rank Information</h3>
          {/* Removed rank image display */}
          <p>MMR: {userRank.userRank.mmr}</p>
          <p>Rank: {userRank.userRank.rank}</p>
          <p>Rank Percent: {(userRank.userRank.rankPercent * 100).toFixed(2)}%</p>
          {/* Add more rank details as needed */}
        </div>
      )}

      <div className="mt-4">
        <h3>Recent Games</h3>
        {userGames.length > 0 ? (
          <ul className="list-group">
            {userGames.map((game) => (
              <li key={game.gameId} className="list-group-item">
                Game ID: {game.gameId} - Mode: {game.matchingMode} - Team Mode: {game.matchingTeamMode}
                <Link to={`/match/${game.gameId}`} className="btn btn-info btn-sm float-end">View Details</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent games found.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;