import { useEffect, useState } from 'react';
import Template from './template';

function Loading() {
  const [numDots, setNumDots] = useState(3);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNumDots(num => {
        const newNum = num + 1;
        return newNum > 3 ? 0 : newNum;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <Template rotate emoji={'🍌'} text={`Loading${'.'.repeat(numDots)}`} />;
}

export default Loading;