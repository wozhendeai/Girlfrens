// Gets the current token id that should be bid on
// -1 = max supply reached
import { useState, useEffect } from 'react';

// Helper function to fetch data from the server
const fetchCurrentTokenId = async () => {
  const response = await fetch(import.meta.env.SERVER_URL + '/auction/current-token');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// The hook
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
  }, []); // The empty array ensures this effect runs once on mount

  return { tokenId, loading, error };
};

export default useCurrentTokenId;
