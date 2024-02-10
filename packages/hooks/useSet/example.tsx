import React from 'react';

import { useSet } from './index';

const EXAMPLE_ITEM = [1, 2, 3, 4, 5];

const SomeFunctionComponent: React.FC = () => {
  const someItemsSet = useSet<number>();

  const handleClick = (item: number) => {
    if (someItemsSet.has(item)) {
      someItemsSet.remove(item);
      return;
    }

    someItemsSet.add(item);
  };

  return (
    <div>
      <div>
        {EXAMPLE_ITEM.map((item) => (
          <button key={item} onClick={() => handleClick(item)}>
            {item}
          </button>
        ))}
      </div>
      <div>
        {someItemsSet.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
};
