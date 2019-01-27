import * as React from 'react';
import { interval, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

import TextAnimation from './TextAnimation';
import context from '../context';

export interface Props {
  children: string;
  isLastOne?: boolean;
}

interface State {
  currentText: string;
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
    currentText: this.context.animation === 'type' ? '' : this.props.children,
  };

  componentDidMount() {
    const { children } = this.props;
    const { charInterval, onComplete } = this.context;

    this.subscription = getSource$(charInterval, children.length).subscribe({
      next: index =>
        this.setState(
          { currentText: this.getCurrentText(index) },
          this.onNextChar,
        ),
      complete: () => onComplete && onComplete(),
    });
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  getCurrentText = (currentCharIndex: number) => {
    const { animation } = this.context;
    const { children } = this.props;

    switch (animation) {
      case 'delete':
        return children.substring(currentCharIndex);
      case 'backspace':
        return children.substring(0, children.length - currentCharIndex);
      case 'type':
      default:
        return children.substring(0, currentCharIndex);
    }
  };

  onNextChar = () => {
    const { currentText } = this.state;
    return this.context.onNextChar && this.context.onNextChar(currentText);
  };

  render() {
    return this.state.currentText;
  }
}
