import { useEffect, useState } from 'react';
import { useIsMounted } from '.';

export function IsMountedExample() {
  const [items, setItems] = useState<any[]>();

  const isMounted = useIsMounted();

  useEffect(() => {
    fetch('some url here')
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted.current) {
          return;
        }

        setItems(res);
      });
  }, []);

  // ....
}
