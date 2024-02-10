import React from 'react';

import { createOptimizedContext } from './index';

type AppContext = {
  value: string;
};

const { Provider, useStoreSelector, useStoreUpdate } = createOptimizedContext<AppContext>();

/** will not rerender while state.value changing */
const FormInput = () => {
  const updateValue = useStoreUpdate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue({
      value: event.target.value,
    });
  };

  return <input type='text' onChange={handleChange} />;
};

const Form: React.FC = () => {
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

const App: React.FC = () => {
  return (
    <Provider initialState={{ value: '' }}>
      <Form />
      <CustomInput />
    </Provider>
  );
};
