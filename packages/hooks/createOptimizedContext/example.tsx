import React from 'react';
import type { FC, ChangeEvent } from 'react';

import { createOptimizedContext } from './createOptimalContext';

type AppContext = {
  value: string;
};

const { Provider, useStoreSelector, useStoreUpdate } = createOptimizedContext<AppContext>();

/** will not rerender while state.value changing */
const FormInput = () => {
  const updateValue = useStoreUpdate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateValue({
      value: event.target.value,
    });
  };

  return <input type='text' onChange={handleChange} />;
};

const Form: FC = () => {
  return (
    <div>
      this is Form
      <FormInput />
    </div>
  );
};

const CustomInput = () => {
  const value = useStoreSelector((state) => state.value);

  return <div>{value}</div>;
};

const App: FC = () => {
  return (
    <Provider initialState={{ value: '' }}>
      <Form />
      <CustomInput />
    </Provider>
  );
};
