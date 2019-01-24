import * as React from 'react';
import { interval, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

import TextAnimation from './TextAnimation';
import context from '../context';

export interface Props {
  children: string;
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
  static contextType: React.Context<
    Partial<React.ComponentPropsWithoutRef<typeof TextAnimation>>
  > = context;
  static defaultProps = {
    charInterval: 200,
    type: 'type',
  };

  subscription: Subscription;

  state = {
    currentCharIndex: 0,
  };

  componentDidMount() {
    const { children } = this.props;
    const { charInterval, onComplete } = this.context;

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
    const { children } = this.props;
    const { currentCharIndex } = this.state;
    const { animation } = this.context;

    switch (animation) {
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
