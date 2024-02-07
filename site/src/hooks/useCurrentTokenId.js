// Gets the current token id that should be bid on
// -1 = max supply reached
import { useState, useEffect } from 'react';

// Helper function to fetch data from the server
const fetchCurrentTokenId = async () => {
  try {
    const endpoint = import.meta.env.VITE_SERVER_URL + '/auction/current-token';
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current token ID:', error);
    throw error; // Rethrow to be caught by the consuming function
  }
};

/**
 * @description Fetch the token ID that should be bid on
 * @returns 
 */
const useCurrentTokenId = () => {
  const [tokenId, setTokenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTokenId = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrentTokenId();
        setTokenId(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getTokenId();
  }, []);

  return { tokenId, loading, error };
};

export default useCurrentTokenId;
