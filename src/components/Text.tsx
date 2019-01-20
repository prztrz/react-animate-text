import * as React from 'react';
import { interval, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Animation } from '../types';

interface Props {
  children: string;
  charInterval: number;
  type?: Animation;
  onComplete?: () => void;
}

interface State {
  currentCharIndex: number;
}

const getSource$ = (charInterval: number, limit: number) =>
  interval(charInterval).pipe(
    map(val => val + 1),
    take(limit),
  );

export default class Text extends React.Component<Props, State> {
  static defaultProps = {
    charInterval: 200,
    type: 'type',
  };

  subscription: Subscription;

  state = {
    currentCharIndex: 0,
  };

  componentDidMount() {
    const { charInterval, children, onComplete } = this.props;

    this.subscription = getSource$(charInterval, children.length).subscribe({
      next: currentCharIndex => {
        this.setState({ currentCharIndex });
      },
      complete: () => onComplete && onComplete(),
    });
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { children, type } = this.props;
    const { currentCharIndex } = this.state;
    switch (type) {
      case 'delete':
        return <>{children.substring(currentCharIndex)}</>;
      case 'backspace':
        return <>{children.substring(0, children.length - currentCharIndex)}</>;
      case 'type':
      default:
        return <>{children.substring(0, currentCharIndex)}</>;
    }
  }
}
