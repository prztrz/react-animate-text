import * as React from 'react';

import { getOutputData } from '../helpers';
import { Animation } from '../types';
import { Provider } from '../context';

export interface Props {
  children: React.ReactNode;
  charInterval: number;
  animation?: Animation;
  onComplete?: () => void;
  onNextChar?: (currentText: string) => void;
  caret?: React.ReactNode;
}

interface State {
  currentTextIndex: number;
}

export default class TextAnimation extends React.Component<Props, State> {
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
    const { children, charInterval, animation, onNextChar, caret } = this.props;
    const { currentTextIndex } = this.state;
    const { output, isLastText } = getOutputData(
      children,
      currentTextIndex,
      animation,
    );

    return (
      <Provider
        value={{
          charInterval,
          animation,
          onComplete: isLastText ? null : this.increaseCurrentText,
          onNextChar,
          caret,
        }}
      >
        {output}
      </Provider>
    );
  }
}
