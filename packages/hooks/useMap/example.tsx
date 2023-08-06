import React from 'react';
import type { FC } from 'react';

import { useMap } from './useMap';

const EXAMPLE_ITEM = [1, 2, 3, 4, 5];

export const SomeFunctionComponent: FC = () => {
  /** not optimal for primitives, use useSet hook instead */
  const someItemsSet = useMap<number, boolean>();

  const handleClick = (item: number) => {
    if (someItemsSet.has(item)) {
      someItemsSet.remove(item);
      return;
    }

    someItemsSet.set(item, true);
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
        {someItemsSet.map((value, item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
};
