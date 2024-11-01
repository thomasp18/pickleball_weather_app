import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * Fetches data from any URL
 */
const useRequest = (method, url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(true);

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
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // custom hook returns value
  return { response, error, loading };
};

export default useRequest;