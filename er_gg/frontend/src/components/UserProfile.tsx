import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getRankTierImage, getCharacterSkinImage } from '../utils/imageUtils';
import { PlayMode, PlayModeKR } from '../types';

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
  mmr: number | null;
  mmrChange: number | null;
  gameRank: number | null;
  characterNum: number | null;
  startDtm: string;
  // Add more fields as needed from the API response
}

interface UserStats {
  totalGames: number;
  totalWins: number;
  totalTeamKills: number;
  averageRank: number;
  averageKills: number;
  averageAssistants: number;
  top1: number;
  top2: number;
  top3: number;
}

function UserProfile() {
  const { nickname } = useParams<{ nickname: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null); // Add userStats state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [characterImageUrls, setCharacterImageUrls] = useState<{
    [key: number]: string;
  }>({});

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

        // Fetch user stats using current season ID
        const statsResponse = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/user/${userNum}/stats/${currentSeasonId}`
        );
        setUserStats(statsResponse.data.userStats[0]); // Assuming the first element is the correct one

        // Fetch user games
        const gamesResponse = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/user/${userNum}/games`
        );
        setUserGames(gamesResponse.data.userGames);

        // Fetch character images for each game
        const imageUrls: { [key: number]: string } = {};
        for (const game of gamesResponse.data.userGames) {
          if (game.characterNum && !imageUrls[game.characterNum]) {
            const imageUrl = await getCharacterSkinImage(
              game.characterNum,
              Number(String(game.skinCode).slice(-3))
            );
            imageUrls[game.characterNum] = imageUrl;
          }
        }
        setCharacterImageUrls(imageUrls);
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
      </div>

      {userRank && userRank.userRank && (
        <div className="rank-info-section card mt-4 w-1/4">
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
              </div>
            </div>
          </div>
        </div>
      )}

      {userStats && (
        <div className="stats-info-section card mt-4 w-1/4">
          <div className="card-body">
            <h3 className="card-title">통계 정보</h3>
            <div className="stats-details">
              <p>게임 수: {userStats.totalGames}</p>
              <p>우승 횟수: {userStats.totalWins}</p>
              <p>총 TK: {userStats.totalTeamKills}</p>
              <p>평균 순위: {userStats.averageRank}</p>
              <p>평균 킬: {userStats.averageKills}</p>
              <p>평균 어시: {userStats.averageAssistants}</p>
              <p>승률: {userStats.top1}</p>
              <p>Top 2: {userStats.top2}</p>
              <p>Top 3: {userStats.top3}</p>
            </div>
          </div>
        </div>
      )}

      <div className="recent-games-section card mt-4">
        <div className="card-body">
          <h3 className="card-title">Recent Games</h3>
          {userGames.length > 0 ? (
            <div className="list-group">
              {userGames.map((game) => (
                <div
                  key={game.gameId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                      }}
                    >
                      <div>
                        {game.matchingMode === 6 ? (
                          <span
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 'bold',
                              color: game.gameRank === 1 ? 'green' : 'red',
                            }}
                          >
                            {game.gameRank === 1 ? '승리' : '패배'}
                          </span>
                        ) : (
                          game.gameRank != null && (
                            <span
                              style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color:
                                  game.gameRank === 1
                                    ? 'limegreen'
                                    : game.gameRank === 2 || game.gameRank === 3
                                    ? 'deepskyblue'
                                    : undefined,
                              }}
                            >
                              #{game.gameRank}
                            </span>
                          )
                        )}
                      </div>
                      <div>{PlayModeKR[game.matchingMode]}</div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                        }}
                      >
                        {(() => {
                          const startDate = new Date(game.startDtm);
                          const now = new Date();
                          const diffMs = now.getTime() - startDate.getTime();
                          const diffSec = Math.floor(diffMs / 1000);
                          if (diffSec < 60) return `${diffSec}초 전`;
                          const diffMin = Math.floor(diffSec / 60);
                          if (diffMin < 60) return `${diffMin}분 전`;
                          const diffHour = Math.floor(diffMin / 60);
                          if (diffHour < 24) return `${diffHour}시간 전`;
                          const diffDay = Math.floor(diffHour / 24);
                          if (diffDay < 7) return `${diffDay}일 전`;
                          const month = startDate.getMonth() + 1;
                          const day = startDate.getDate();
                          return `${month}월 ${day}일`;
                        })()}
                      </span>
                    </div>

                    {game.characterNum &&
                      characterImageUrls[game.characterNum] && (
                        <img
                          src={characterImageUrls[game.characterNum]}
                          alt={`Character ${game.characterNum}`}
                          style={{
                            width: '50px',
                            height: '50px',
                            marginRight: '10px',
                            objectFit: 'cover',
                            aspectRatio: '1 / 1',
                            borderRadius: '100%',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ccc',
                          }}
                        />
                      )}
                    <div>
                      Game ID: {game.gameId}
                      {game.mmr != null && (
                        <div>
                          MMR: {game.mmr}{' '}
                          {game.mmrChange != null && (
                            <span
                              className={
                                game.mmrChange > 0
                                  ? 'text-success'
                                  : game.mmrChange < 0
                                  ? 'text-danger'
                                  : 'text-secondary'
                              }
                            >
                              ({game.mmrChange > 0 ? '+' : ''}
                              {game.mmrChange})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/match/${game.gameId}`}
                    className="btn btn-info btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent games found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
