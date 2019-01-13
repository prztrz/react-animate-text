import * as React from 'react';

import Text from './components/Text';

export interface Props {
  text: string;
}

export default class ExampleComponent extends React.Component<Props> {
  public render() {
    return (
      <div>
        Type: <Text charInterval={200}>This is type component</Text>
        <br />
        Delete:
        <Text type="delete" charInterval={500}>
          This is delete component
        </Text>
        <br />
        Backspace:{' '}
        <Text type="backspace" charInterval={200}>
          This is backspace component
        </Text>
      </div>
    );
  }
}
