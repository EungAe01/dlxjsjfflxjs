// er_gg/frontend/src/utils/imageUtils.ts
import axios from 'axios';

// In-memory cache for character names to avoid repeated API calls
const characterNameCache: { [key: number]: string } = {};

export const getCharacterImage = async (characterCode: number): Promise<string> => {
  let characterName = characterNameCache[characterCode];

  if (!characterName) {
    try {
      const response = await axios.get(`http://localhost:5000/api/character-name/${characterCode}`);
      characterName = response.data.name;
      characterNameCache[characterCode] = characterName; // Cache the name
    } catch (error) {
      console.error(`Error fetching character name for code ${characterCode}:`, error);
      return ''; // Return empty string on error
    }
  }

  // Assuming character images are named after their names (e.g., 'Hyunwoo.png')
  // and located in a specific folder like /images/Character
  // You might need to adjust the path based on your actual image structure.
  // For now, we'll assume a direct mapping to a character image folder.
  // If character images are within the Item folder, you'll need a more specific path.
  return `/images/Item/Character/${characterName}.png`; // Placeholder path
};

// This is a placeholder. A comprehensive mapping for item codes to image paths
// would require a separate data file or a more complex mapping logic.
export const getItemImage = (itemCode: number): string => {
  return ''; // Placeholder for item images
};