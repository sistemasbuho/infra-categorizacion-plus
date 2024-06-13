import { useState, useEffect } from 'react';

function useFetchData(
  url: string,
  method: string = 'GET',
  contentType: string = 'application/json'
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const options = {
          method: method,
          headers: {
            'Content-Type': contentType,
          },
        };
        const response = await fetch(url, { ...options });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, method, contentType]);

  return { data, loading, error };
}

export default useFetchData;
