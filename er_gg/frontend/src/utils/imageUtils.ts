// er_gg/frontend/src/utils/imageUtils.ts
import axios from 'axios';

// In-memory cache for character names to avoid repeated API calls
const characterNameCache: { [key: number]: string } = {};

export const getCharacterSkinImage = async (
  characterCode: number,
  skinCode: number = 0
): Promise<string> => {
  let characterName = characterNameCache[characterCode];

  if (!characterName) {
    try {
      const response = await axios.get(
        `${window.location.protocol}//${window.location.hostname}:5000/api/character-name/${characterCode}`
      );
      characterName = response.data.name;
    } catch (error) {
      console.error(
        `Error fetching character name for code ${characterCode}:`,
        error
      );
      return ''; // Return empty string on error
    }
  }
  return `https://cdn.dak.gg/assets/er/game-assets/1.50.0/CharProfile_${characterName}_S${skinCode
    .toString()
    .padStart(3, '0')}.png`;
};

// This is a placeholder. A comprehensive mapping for item codes to image paths
// would require a separate data file or a more complex mapping logic.
export const getItemImage = (itemCode: number): string => {
  return ''; // Placeholder for item images
};

export const getRankTierImage = (mmr: number, rank: number): string => {
  let tier = getTierName(mmr, rank <= 1000 && rank > 30, rank <= 300)[2]; // Get the English tier name

  return `${window.location.protocol}//${window.location.hostname}:5000/images/RankTier/${tier}.png`;
};

type TierResult = [string, string, string];

export function getTierName(
  mmr: number,
  demigod: boolean = false,
  eternity: boolean = false
): TierResult {
  const roma = ['IV', 'III', 'II', 'I'];

  if (eternity) return ['이터니티', `${mmr - 7800}점`, 'eternity'];
  if (demigod) return ['데미갓', `${mmr - 7800}점`, 'demigod'];

  const tiers: [string, string, Array<[number, number]>][] = [
    [
      '아이언',
      'iron',
      [
        [0, 149],
        [150, 299],
        [300, 449],
        [450, 599],
      ],
    ],
    [
      '브론즈',
      'bronze',
      [
        [600, 799],
        [800, 999],
        [1000, 1199],
        [1200, 1399],
      ],
    ],
    [
      '실버',
      'silver',
      [
        [1400, 1649],
        [1650, 1899],
        [1900, 2149],
        [2150, 2399],
      ],
    ],
    [
      '골드',
      'gold',
      [
        [2400, 2699],
        [2700, 2999],
        [3000, 3299],
        [3300, 3599],
      ],
    ],
    [
      '플래티넘',
      'platinum',
      [
        [3600, 3949],
        [3950, 4299],
        [4300, 4649],
        [4650, 4999],
      ],
    ],
    [
      '다이아몬드',
      'diamond',
      [
        [5000, 5349],
        [5350, 5699],
        [5700, 6049],
        [6050, 6399],
      ],
    ],
    ['메테오라이트', 'meteorite', [[6400, 7099]]],
    ['미스릴', 'mithril', [[7100, Infinity]]],
  ];

  for (const [tierKr, tierEn, divisions] of tiers) {
    for (let i = divisions.length - 1; i >= 0; i--) {
      const [low, high] = divisions[i];
      if (mmr >= low && mmr <= high) {
        const divisionNum = divisions.length === 4 ? i : null;
        const tierKrName =
          divisionNum !== null ? `${tierKr} ${roma[divisionNum]}` : tierKr;
        const intraScore = `${mmr - low}점`;
        return [tierKrName, intraScore, tierEn];
      }
    }
  }

  return ['언랭크', '0점', 'unrank'];
}
