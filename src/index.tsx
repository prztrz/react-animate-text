import * as React from 'react';

import TextAnim from './components/TextAnim';

export interface Props {
  text: string;
}

export default class ExampleComponent extends React.Component<Props> {
  public render() {
    return (
      <div>
        Core:{' '}
        <TextAnim charInterval={200}>
          <span style={{ color: 'red' }}>
            <div>heyo</div>
            ojoj
            <span>
              <div>
                <strong>hohoho</strong>hihihi
              </div>
            </span>
            <small>OMG</small>
          </span>
        </TextAnim>
        <TextAnim animation="delete">
          delet<strong>dedededed</strong>eme
        </TextAnim>
      </div>
    );
  }
}
