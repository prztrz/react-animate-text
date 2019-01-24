import React, { Component } from 'react';

import TextAnimation from 'react-typewriter';

export default class App extends Component {
  render() {
    return (
      <div>
        <TextAnimation>
          Hel<span>ssss</span>lo
        </TextAnimation>
        <br />
        <TextAnimation animation="delete">
          yo<span>inoi</span>ded
        </TextAnimation>
        <br />
        <TextAnimation animation="backspace">
          yo<span>inoi</span>ded
        </TextAnimation>
      </div>
    );
  }
}
