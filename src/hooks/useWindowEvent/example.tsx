import * as React from 'react';
import { useWindowEvent } from '.';

type Position = {
  x: number;
  y: number;
  diffX: number;
  diffY: number;
};

const INITIAL_STATE: Position = {
  x: 0,
  y: 0,
  diffX: 0,
  diffY: 0,
};

const Example = () => {
  const [{ x, y, diffX, diffY }, setMousePosition] = React.useState(INITIAL_STATE);

  useWindowEvent('mousemove', (event) => {
    const { clientX, clientY } = event;

    setMousePosition({
      x: clientX,
      y: clientY,
      diffX: clientX - x,
      diffY: clientY - y,
    });
  });

  return (
    <div>
      <h4> mouse position </h4>
      X: {x} Y: {y}
      <h4> Diff from prev position </h4>
      X: {diffX} Y: {diffY}
    </div>
  );
};
