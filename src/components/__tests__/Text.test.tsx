import * as React from 'react';
import * as fc from 'fast-check';
import { render, cleanup } from 'react-testing-library';

import Text from '../Text';
import { EMPTY_STRING } from '../../constants';

beforeEach(jest.useFakeTimers);

describe('Text Component', () => {
  it('does not set state on unmounted component', () => {
    fc.assert(
      fc
        .property(fc.string(), fc.integer(), (text, interval) => {
          const mockConsoleError = jest.spyOn(console, 'error');
          const { unmount } = render(
            <Text charInterval={interval}>{text}</Text>,
          );

          unmount();
          jest.runOnlyPendingTimers();

          expect(mockConsoleError).not.toBeCalled();

          mockConsoleError.mockRestore();
        })
        .afterEach(cleanup)
        .beforeEach(jest.useFakeTimers),
    );
  });

  it('calls onComplete() when finish rendering whole text', () => {
    fc.assert(
      fc
        .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
          const onCompleteMock = jest.fn();

          render(
            <Text charInterval={interval} onComplete={onCompleteMock}>
              {text}
            </Text>,
          );

          jest.advanceTimersByTime(interval * text.length);
          expect(onCompleteMock).toBeCalledTimes(1);
        })
        .afterEach(cleanup)
        .beforeEach(jest.useFakeTimers),
    );
  });

  describe('type mode', () => {
    it('renders subsequent characters every specified interval', async () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <Text charInterval={interval}>{text}</Text>,
            );

            expect(container).toHaveTextContent(EMPTY_STRING);

            Array.from(text).reduce((str, char) => {
              jest.advanceTimersByTime(interval);
              const currentText = str + char;
              expect(container.textContent).toBe(currentText);

              return currentText;
            }, '');
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });

  describe('delete mode', () => {
    it('deletes subsequent characters every specified interval', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <Text charInterval={interval} type="delete">
                {text}
              </Text>,
            );

            expect(container.textContent).toBe(text);

            for (let i = 0; i < text.length; i++) {
              jest.advanceTimersByTime(interval);
              const currentText = text.substring(i + 1);
              expect(container.textContent).toBe(currentText);
            }
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });

  describe('backspace mode', () => {
    it('backspaces subsequent characters every specified interval', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <Text charInterval={interval} type="backspace">
                {text}
              </Text>,
            );

            expect(container.textContent).toBe(text);

            for (let i = text.length - 1; i >= 0; i--) {
              jest.advanceTimersByTime(interval);
              const currentText = text.substring(0, i);
              expect(container.textContent).toBe(currentText);
            }
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });
});
