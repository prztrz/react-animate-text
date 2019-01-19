import * as React from 'react';
import * as fc from 'fast-check';
import { render } from 'react-testing-library';

import Text from '../Text';
import { EMPTY_STRING } from '../../constants';

beforeEach(jest.useFakeTimers);

describe('Text Component', () => {
  it('does not try to set state on unmounted component', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer(), (text, interval) => {
        const mockConsoleError = jest.spyOn(console, 'error');
        const { unmount } = render(<Text charInterval={interval}>{text}</Text>);

        unmount();
        jest.runOnlyPendingTimers();

        expect(mockConsoleError).not.toBeCalled();

        mockConsoleError.mockRestore();
      }),
    );
  });

  it('calls onComplete() when finish rendering whole text', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.integer(-100000, 100000),
        (text, interval) => {
          const onCompleteMock = jest.fn();

          render(
            <Text charInterval={interval} onComplete={onCompleteMock}>
              {text}
            </Text>,
          );

          const currentInterval = interval > 0 ? interval : 0;
          jest.advanceTimersByTime(currentInterval * text.length);
          expect(onCompleteMock).toBeCalledTimes(1);
        },
      ),
    );
  });

  describe('type mode', () => {
    it('renders subsequent characters every specified interval', async () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(-100000, 100000),
          (text, interval) => {
            const { container } = render(
              <Text charInterval={interval}>{text}</Text>,
            );

            expect(container).toHaveTextContent(EMPTY_STRING);

            if (interval <= 0) {
              jest.advanceTimersByTime(0);
              expect(container.textContent).toBe(text);
            } else {
              Array.from(text).reduce((str, char) => {
                jest.advanceTimersByTime(interval);
                const currentText = str + char;
                expect(container.textContent).toBe(currentText);

                return currentText;
              }, '');
            }
          },
        ),
      );
    });
  });

  describe('delete mode', () => {
    it('deletes subsequent characters every specified interval', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(-100000, 100000),
          (text, interval) => {
            const { container } = render(
              <Text charInterval={interval} type="delete">
                {text}
              </Text>,
            );

            expect(container.textContent).toBe(text);

            if (interval <= 0) {
              jest.advanceTimersByTime(0);
              expect(container.textContent).toBe(EMPTY_STRING);
            } else {
              // tslint:disable-next-line
              for (let i = 0; i < text.length; i++) {
                jest.advanceTimersByTime(interval);
                const currentText = text.substring(i + 1);
                expect(container.textContent).toBe(currentText);
              }
            }
          },
        ),
      );
    });
  });

  describe('backspace mode', () => {
    it('backspaces subsequent characters every specified interval', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(-100000, 100000),
          (text, interval) => {
            const { container } = render(
              <Text charInterval={interval} type="backspace">
                {text}
              </Text>,
            );

            expect(container.textContent).toBe(text);

            if (interval <= 0) {
              jest.advanceTimersByTime(0);
              expect(container.textContent).toBe(EMPTY_STRING);
            } else {
              // tslint:disable-next-line
              for (let i = text.length - 1; i >= 0; i--) {
                jest.advanceTimersByTime(interval);
                const currentText = text.substring(0, i);
                expect(container.textContent).toBe(currentText);
              }
            }
          },
        ),
      );
    });
  });
});
