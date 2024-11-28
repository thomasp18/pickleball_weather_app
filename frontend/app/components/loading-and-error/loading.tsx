import Banana from '@/svg/banana';
import { useEffect, useState } from 'react';
import Template from './template';

function Loading() {
  const [numDots, setNumDots] = useState(3);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNumDots((num) => {
        const newNum = num + 1;
        return newNum > 3 ? 0 : newNum;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const bananaSpaced = (
    <div style={{ paddingBottom: '3rem' }}>
      <Banana />
    </div>
  );

  return <Template rotate emoji={bananaSpaced} text={`Loading${'.'.repeat(numDots)}`} />;
}

export default Loading;
