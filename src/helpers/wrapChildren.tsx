import * as React from 'react';

import Text from '../components/Text';
import { ExpectedProps, Animation } from '../types';
import { EMPTY_STRING } from '../constants';

export default function(
  allChildren: React.ReactNode,
  wrappedTextIndex: number = 0,
  animation: Animation = 'type',
) {
  let textCounter = 0;

  const wrapChildren = (children: React.ReactNode): React.ReactNode => {
    const childrenArray =
      animation === 'backspace'
        ? React.Children.toArray(children).reverse()
        : React.Children.toArray(children);

    const wrappedChildren = childrenArray.map(child => {
      if (React.isValidElement<ExpectedProps>(child) && child.props.children) {
        return React.cloneElement(child, {
          ...child.props,
          children: wrapChildren(child.props.children),
        });
      }

      if (['string', 'number'].includes(typeof child)) {
        const textPosition = textCounter - wrappedTextIndex;
        textCounter++;

        if (textPosition === 0) {
          return <Text key={textCounter}>{String(child)}</Text>;
        }

        return (textPosition > 0 && animation === 'type') ||
          (textPosition < 0 && animation !== 'type')
          ? EMPTY_STRING
          : child;
      }

      return child;
    });

    return animation === 'backspace'
      ? wrappedChildren.reverse()
      : wrappedChildren;
  };

  return wrapChildren(allChildren);
}
