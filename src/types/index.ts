import * as React from 'react';

export type Animation = 'type' | 'delete' | 'backspace';

export interface ExpectedProps {
  children: React.ReactNode;
  [key: string]: any;
}
