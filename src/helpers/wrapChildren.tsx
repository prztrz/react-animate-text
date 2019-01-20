import * as React from 'react';

import Text from '../components/Text';
import { ExpectedProps } from '../types';
import { EMPTY_STRING } from '../constants';

export default (
  allChildren: React.ReactNode,
  wrappedTextIndex: number = 0,
  textProps: React.ComponentProps<typeof Text>,
) => {
  let textCounter = 0;

  const wrapChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, child => {
      if (React.isValidElement<ExpectedProps>(child) && child.props.children) {
        const cloned: React.ReactNode = React.cloneElement(child, {
          ...child.props,
          children: wrapChildren(child.props.children),
        });

        return cloned;
      }

      if (['string', 'number'].includes(typeof child)) {
        if (textCounter === wrappedTextIndex) {
          textCounter++;
          return <Text {...textProps}>{String(child as string | number)}</Text>;
        }

        if (textCounter > wrappedTextIndex) {
          return EMPTY_STRING;
        }

        textCounter++;
      }

      return child;
    });
  };

  return wrapChildren(allChildren);
};
