import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getCharacterSkinImage, getItemImage } from '../utils/imageUtils';

interface MatchData {
  code: number;
  message: string;
  userGames: any[]; // This will contain BattleUserResult objects
}

function MatchDetail() {
  const { gameId } = useParams<{ gameId: string }>();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [characterImageUrls, setCharacterImageUrls] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(
          `${window.location.protocol}//${window.location.hostname}:5000/api/games/${gameId}`
        );
        setMatchData(response.data);

        // Fetch character images for each player
        const imageUrls: { [key: number]: string } = {};
        for (const player of response.data.userGames) {
          if (player.characterNum) {
            const imageUrl = await getCharacterSkinImage(player.characterNum);
            imageUrls[player.characterNum] = imageUrl;
          }
        }
        setCharacterImageUrls(imageUrls);
      } catch (err) {
        setError('Failed to fetch match data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [gameId]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!matchData || matchData.userGames.length === 0) {
    return <div className="text-center mt-5">No match data found.</div>;
  }

  // Group players by gameRank
  const playersByRank: { [key: number]: any[] } = {};
  matchData.userGames.forEach((player: any) => {
    if (player.gameRank) {
      if (!playersByRank[player.gameRank]) {
        playersByRank[player.gameRank] = [];
      }
      playersByRank[player.gameRank].push(player);
    }
  });

  // Sort ranks for consistent display
  const sortedRanks = Object.keys(playersByRank).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <div className="mt-5">
      <h2 className="mb-4">Match Details for Game ID: {gameId}</h2>
      {sortedRanks.map((rank) => (
        <div key={rank} className="mb-4">
          <h3>#{rank}</h3>
          {playersByRank[parseInt(rank)].map((player: any) => (
            <div key={player.userNum} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{player.nickname}</h5>
                <p className="card-text">Kills: {player.playerKill}</p>
                <p className="card-text">Assists: {player.playerAssistant}</p>
                <p className="card-text">Monster Kills: {player.monsterKill}</p>

                {/* Character Image */}
                {player.characterNum &&
                  characterImageUrls[player.characterNum] && (
                    <div>
                      <h6>Character:</h6>
                      <img
                        src={characterImageUrls[player.characterNum]}
                        alt={`Character ${player.characterNum}`}
                        style={{ width: '50px', height: '50px' }}
                      />
                    </div>
                  )}

                {/* Equipment Images */}
                {player.equipment && player.equipment.length > 0 && (
                  <div className="mt-3">
                    <h6>Equipment:</h6>
                    <div className="d-flex flex-wrap">
                      {player.equipment.map((item: [number, number]) => {
                        const [slot, itemCode] = item;
                        return itemCode !== 0 ? (
                          <img
                            key={itemCode} // Use itemCode as key for uniqueness
                            src={getItemImage(itemCode)}
                            alt={`Item ${itemCode}`}
                            style={{
                              width: '40px',
                              height: '40px',
                              marginRight: '5px',
                            }}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MatchDetail;
