import * as React from 'react';
import TextAnimation from '../components/TextAnimation';

const context = React.createContext<
  Partial<React.ComponentPropsWithoutRef<typeof TextAnimation>>
>({
  charInterval: 200,
  animation: 'type',
  onComplete: undefined,
  onNextChar: undefined,
});

export default context;
export const { Provider } = context;
