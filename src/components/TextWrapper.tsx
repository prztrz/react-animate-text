import * as React from 'react';
import { Consumer } from '../context';
import Text from './Text';
import { Animation } from '../types';

interface Props {
  text: string | number;
}

export default ({ text }: Props) => (
  <Consumer>
    {({
      caret,
      animation,
    }: {
      caret: React.ReactNode;
      animation: Animation;
    }) => (
      <>
        {animation === 'delete' && (caret || null)}
        <Text>{String(text)}</Text>
        {animation !== 'delete' && (caret || null)}
      </>
    )}
  </Consumer>
);
