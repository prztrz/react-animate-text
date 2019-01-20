import * as React from 'react';

import { wrapChildren } from '../helpers';
import { Animation } from '../types';

interface Props {
  children: React.ReactNode;
  charInterval: number;
  animation?: Animation;
  onComplete?: () => void;
}

interface State {
  currentText: number;
}

export default class TextAnim extends React.Component<Props, State> {
  static defaultProps = {
    animation: 'type',
    charInterval: 200,
  };

  state = {
    currentText: 0,
  };

  increaseCurrentText = () =>
    this.setState(({ currentText }) => ({ currentText: currentText + 1 }));

  render() {
    const { children, charInterval, animation } = this.props;
    const { currentText } = this.state;

    return wrapChildren(children, currentText, {
      charInterval,
      animation,
      onComplete: this.increaseCurrentText,
    });
  }
}
