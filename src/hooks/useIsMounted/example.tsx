import * as React from 'react';
import { useIsMounted } from '.';

function IsMountedExample() {
  const [items, setItems] = React.useState<any[]>();

  const isMounted = useIsMounted();

  React.useEffect(() => {
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
