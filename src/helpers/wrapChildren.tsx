import * as React from 'react';

import Text from '../components/Text';
import { ExpectedProps, Animation } from '../types';
import { EMPTY_STRING } from '../constants';

const getTextElement = (
  child: string | number,
  wrappedTextIndex: number,
  textCounter: number,
  animation: Animation = 'type',
  textProps: Partial<React.ComponentProps<typeof Text>>,
) => {
  if (textCounter === wrappedTextIndex) {
    return (
      <Text key={textCounter} {...textProps}>
        {String(child)}
      </Text>
    );
  }

  const isBeforeWrappedText = textCounter < wrappedTextIndex;
  const isAfterWrappedText = textCounter > wrappedTextIndex;
  const isRemovingAnimation = ['delete', 'backspace'].includes(animation);

  return (
    ((isBeforeWrappedText && isRemovingAnimation) ||
      (isAfterWrappedText && animation === 'type')) &&
    EMPTY_STRING
  );
};

export default function(
  allChildren: React.ReactNode,
  wrappedTextIndex: number = 0,
  animation: Animation = 'type',
  textProps: Partial<React.ComponentProps<typeof Text>>,
) {
  let textCounter = 0;

  const wrapChildren = (children: React.ReactNode): React.ReactNode => {
    const childrenArray =
      animation === 'backspace'
        ? React.Children.toArray(children).reverse()
        : React.Children.toArray(children);

    const wrappedChildren = childrenArray.map(child => {
      if (React.isValidElement<ExpectedProps>(child) && child.props.children) {
        const cloned: React.ReactNode = React.cloneElement(child, {
          ...child.props,
          children: wrapChildren(child.props.children),
        });

        return cloned;
      }

      if (['string', 'number'].includes(typeof child)) {
        const currentElement = getTextElement(
          child as string | number,
          wrappedTextIndex,
          textCounter,
          animation,
          textProps,
        );

        textCounter++;

        return currentElement || currentElement === EMPTY_STRING || child;
      }

      return child;
    });

    return animation === 'backspace'
      ? wrappedChildren.reverse()
      : wrappedChildren;
  };

  return wrapChildren(allChildren);
}
