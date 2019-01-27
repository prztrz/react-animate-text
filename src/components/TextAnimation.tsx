import * as React from 'react';

import { wrapChildren } from '../helpers';
import { Animation } from '../types';
import { Provider } from '../context';

export interface Props {
  children: React.ReactNode;
  charInterval: number;
  animation?: Animation;
  onComplete?: () => void;
  onNextChar?: (currentText: string) => void;
}

interface State {
  currentTextIndex: number;
}

export default class TextAnim extends React.Component<Props, State> {
  static defaultProps = {
    animation: 'type',
    charInterval: 200,
  };

  state = {
    currentTextIndex: 0,
  };

  increaseCurrentText = () =>
    this.setState(({ currentTextIndex }) => ({
      currentTextIndex: currentTextIndex + 1,
    }));

  render() {
    const { children, charInterval, animation, onNextChar } = this.props;
    const { currentTextIndex: currentText } = this.state;
    return (
      <Provider
        value={{
          charInterval,
          animation,
          onComplete: this.increaseCurrentText,
          onNextChar,
        }}
      >
        {wrapChildren(children, currentText, animation)}
      </Provider>
    );
  }
}
