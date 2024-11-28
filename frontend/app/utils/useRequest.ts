import axios, { Method } from 'axios';
import { useEffect, useState } from 'react';

/**
 * Fetches data from any URL
 */
const useRequest = (method: Method, url: string) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axios.request({
      url, method
    })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  // custom hook returns value
  return { response, error, loading, refetch };
};

export default useRequest;