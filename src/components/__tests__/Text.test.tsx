import * as React from 'react';
import * as fc from 'fast-check';
import { render, cleanup } from 'react-testing-library';
import { Provider } from '../../context';

import Text from '../Text';
import { EMPTY_STRING } from '../../constants';

beforeEach(jest.useFakeTimers);

describe('Text Component', () => {
  it('does not set state on unmounted component', () => {
    fc.assert(
      fc
        .property(fc.string(), fc.integer(), (text, charInterval) => {
          const mockConsoleError = jest.spyOn(console, 'error');
          const { unmount } = render(
            <Provider value={{ charInterval }}>
              <Text>{text}</Text>
            </Provider>,
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
        .property(fc.string(), fc.integer(1, 100000), (text, charInterval) => {
          const onComplete = jest.fn();

          render(
            <Provider value={{ charInterval, onComplete }}>
              <Text>{text}</Text>
            </Provider>,
          );

          jest.advanceTimersByTime(charInterval * text.length);
          expect(onComplete).toBeCalledTimes(1);
        })
        .afterEach(cleanup)
        .beforeEach(jest.useFakeTimers),
    );
  });

  it('calls onNextChar with current text every animation frame', () => {
    fc.assert(
      fc
        .property(fc.string(), fc.integer(1, 100000), (text, charInterval) => {
          const onNextChar = jest.fn();
          render(
            <Provider value={{ charInterval, onNextChar }}>
              <Text>{text}</Text>
            </Provider>,
          );

          expect(onNextChar).not.toBeCalled();

          Array.from(text).reduce((str, char) => {
            jest.advanceTimersByTime(charInterval);
            const currentText = str + char;
            expect(onNextChar).toBeCalledWith(currentText);

            return currentText;
          }, '');
        })
        .afterEach(cleanup)
        .beforeEach(jest.useFakeTimers),
    );
  });

  describe('type mode', () => {
    it('renders subsequent characters every specified interval', async () => {
      fc.assert(
        fc
          .property(
            fc.string(),
            fc.integer(1, 100000),
            (text, charInterval) => {
              const { container } = render(
                <Provider value={{ charInterval }}>
                  <Text>{text}</Text>
                </Provider>,
              );

              expect(container).toHaveTextContent(EMPTY_STRING);

              Array.from(text).reduce((str, char) => {
                jest.advanceTimersByTime(charInterval);
                const currentText = str + char;
                expect(container.textContent).toBe(currentText);

                return currentText;
              }, '');
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });

  describe('delete mode', () => {
    it('deletes subsequent characters every specified interval', () => {
      fc.assert(
        fc
          .property(
            fc.string(),
            fc.integer(1, 100000),
            (text, charInterval) => {
              const { container } = render(
                <Provider value={{ charInterval, animation: 'delete' }}>
                  <Text>{text}</Text>
                </Provider>,
              );

              expect(container.textContent).toBe(text);

              for (let i = 0; i < text.length; i++) {
                jest.advanceTimersByTime(charInterval);
                const currentText = text.substring(i + 1);
                expect(container.textContent).toBe(currentText);
              }
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });

  describe('backspace mode', () => {
    it('backspaces subsequent characters every specified interval', () => {
      fc.assert(
        fc
          .property(
            fc.string(),
            fc.integer(1, 100000),
            (text, charInterval) => {
              const { container } = render(
                <Provider value={{ charInterval, animation: 'backspace' }}>
                  <Text>{text}</Text>
                </Provider>,
              );

              expect(container.textContent).toBe(text);

              for (let i = text.length - 1; i >= 0; i--) {
                jest.advanceTimersByTime(charInterval);
                const currentText = text.substring(0, i);
                expect(container.textContent).toBe(currentText);
              }
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });
});
