import React, { Component } from 'react';

import TextAnimation from 'react-typewriter';

export default class App extends Component {
  render() {
    return (
      <div>
        <TextAnimation
          animation="backspace"
          onNextChar={() => {
            console.log('ahoh');
          }}
        >
          OH YEAH
        </TextAnimation>
      </div>
    );
  }
}
