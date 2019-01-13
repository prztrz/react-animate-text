import * as React from 'react';
import * as faker from 'faker';
import { render } from 'react-testing-library';

import Text from '../Text';
import { EMPTY_STRING } from '../../constants';

beforeEach(jest.useFakeTimers);

describe('Text Component', () => {
  const text = faker.random.alphaNumeric(
    faker.random.number({ min: 3, max: 10 }),
  );

  const interval = faker.random.number({ min: 100, max: 1000 });

  it('calls onComplete() when finish rendering whole text', () => {
    const onCompleteMock = jest.fn();
    render(
      <Text charInterval={interval} onComplete={onCompleteMock}>
        {text}
      </Text>,
    );

    jest.advanceTimersByTime(interval * text.length);
    expect(onCompleteMock).toBeCalledTimes(1);
  });

  describe('type mode', () => {
    it('renders subsequent characters every specified interval', async () => {
      const { container } = render(<Text charInterval={interval}>{text}</Text>);

      expect(container).toHaveTextContent(EMPTY_STRING);

      Array.from(text).reduce((str, char) => {
        jest.advanceTimersByTime(interval);
        const currentText = str + char;
        expect(container).toHaveTextContent(currentText);

        return currentText;
      }, '');
    });
  });

  it('deletes subsequent characters every specified interval', () => {
    const { container } = render(
      <Text charInterval={interval} type="delete">
        {text}
      </Text>,
    );

    expect(container).toHaveTextContent(text);

    // tslint:disable-next-line
    for (let i = 0; i < text.length; i++) {
      jest.advanceTimersByTime(interval);
      const currentText = text.substring(i + 1);
      expect(container).toHaveTextContent(currentText);
    }
  });

  it('deletes subsequent characters every specified interval', () => {
    const { container } = render(
      <Text charInterval={interval} type="backspace">
        {text}
      </Text>,
    );

    expect(container).toHaveTextContent(text);

    // tslint:disable-next-line
    for (let i = text.length - 1; i >= 0; i--) {
      jest.advanceTimersByTime(interval);
      const currentText = text.substring(0, i);
      expect(container).toHaveTextContent(currentText);
    }
  });
});
