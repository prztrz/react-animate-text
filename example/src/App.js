import React, { Component } from 'react';

import TextAnimation from 'react-typewriter';

export default class App extends Component {
  render() {
    return (
      <div>
        <TextAnimation
          charInterval={20}
          animation="backspace"
          caret="[x]"
          // onNextChar={() => {
          //   console.log('ahoh');
          // }}
        >
          <div>text count: 1</div>
          <div>
            text count:2 <div>textcount: 3</div>
          </div>
        </TextAnimation>
      </div>
    );
  }
}
