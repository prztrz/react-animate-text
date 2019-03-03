# react-animate-text

> React tool for common text animations written in typescript

[![NPM](https://img.shields.io/npm/v/react-typewriter.svg)](https://www.npmjs.com/package/react-typewriter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

You need to install this along with [rxjs](https://github.com/ReactiveX/rxjs) as it is peer dependency.

```bash
npm install react-animate-text rxjs
yarn add react-animate-text rxjs
```

## Usage

To animate text simply wrap it in `react-animate-text` component

```js
import TextAnimation from 'react-animate-text';

<TextAnimation>Hello world</TextAnimation>;
```

simple as that! [try it yourself](https://codesandbox.io/s/z2qnor873x)

Actually it does not need to be text, you can pass any react composition, `react-animate-text` will animate text in order of they apperance. Styles and other attributes will be preserved

```js
import TextAnimation from 'react-animate-text';

<TextAnimation>
  <main>
    <h1>This is header</h1>
    <span style={{ color: 'red' }}>Exciting styled text</span>
    <div>
      <div>
        <div>
          <span>Man it is nested!</span>
        </div>
      </div>
    </div>
  </main>
</TextAnimation>;
```

[try it yourself](https://codesandbox.io/s/lrn7273q77)

Check the full API below

## API

| Prop           | type                              | default value | required | description                                                                                                                                    |
| -------------- | --------------------------------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `animation`    | "type" \| "delete" \| "backspace" | "type"        | no       | Applied animation for texts<BR>"type" - animates typing texts<BR>"delete" - animates deleting texts<BR>"backspace" - animates backspacing text |
| `caret`        | React.Node                        | none          | no       | ReactNode used as caret.<BR>Cared is displayed at the begining of delete animation and at the end of type and backspace animations.            |
| `charInterval` | number                            | 200           | no       | Interval between subsequent animation frames (typing/deleting/backspacing subsequent characters) in miliseconds                                |
| `children`     | React.Node                        | none          | yes      | String or any react composition.<BR>All included texts will be animated in order of their appearance.                                          |
| `onNextChar`   | string => any                     | none          | no       | Function called every subsequent animation frame. It receives current displayed text as argument.                                              |  |  |

## License

MIT © [prztrz](https://github.com/prztrz)
