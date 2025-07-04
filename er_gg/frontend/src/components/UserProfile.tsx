import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getRankTierImage } from '../utils/imageUtils'; // Re-enabled import
import { PlayMode } from '../types';

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
        const userResponse = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/user/${nickname}`
        );
        const userNum = userResponse.data.user.userNum;
        setUserData(userResponse.data);

        // Fetch current season ID
        const seasonResponse = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/season`
        );
        const currentSeason = seasonResponse.data.data.find(
          (season: any) => season.isCurrent === 1
        );
        const currentSeasonId = currentSeason ? currentSeason.seasonID : 0;

        // Fetch user rank using current season ID
        const rankResponse = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/user/${userNum}/rank/${currentSeasonId}/3`
        ); // matchingTeamMode: 1 (Solo)
        setUserRank(rankResponse.data);

        // Fetch user games
        const gamesResponse = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/user/${userNum}/games`
        );
        setUserGames(gamesResponse.data.userGames);
      } catch (err) {
        setError(
          'Failed to fetch user data. Please check the nickname and try again.'
        );
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
    <div className="user-profile-container mt-5">
      <div className="profile-header">
        <h2 className="nickname">{userData.user.nickname}</h2>
        <Link to="/" className="btn btn-secondary mt-3">
          홈으로 돌아가기
        </Link>
      </div>

      {userRank && userRank.userRank && (
        <div className="rank-info-section card mt-4">
          <div className="card-body">
            <h3 className="card-title">랭크 정보</h3>
            <div className="rank-details">
              <img
                src={getRankTierImage(
                  userRank.userRank.mmr,
                  userRank.userRank.rank
                )} // Use getRankTierImage
                alt="티어"
                className="rank-tier-image"
                width={100}
              />
              <div className="rank-text">
                <p>MMR: {userRank.userRank.mmr}</p>
                <p>Rank: {userRank.userRank.rank}</p>
                <p>
                  Rank Percent:{' '}
                  {(userRank.userRank.rankPercent * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recent-games-section card mt-4">
        <div className="card-body">
          <h3 className="card-title">Recent Games</h3>
          {userGames.length > 0 ? (
            <ul className="list-group">
              {userGames.map((game) => (
                <li
                  key={game.gameId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    Game ID: {game.gameId} - Mode: {PlayMode[game.matchingMode]}{' '}
                    - Team Mode: {game.matchingTeamMode}
                  </div>
                  <Link
                    to={`/match/${game.gameId}`}
                    className="btn btn-info btn-sm"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent games found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
