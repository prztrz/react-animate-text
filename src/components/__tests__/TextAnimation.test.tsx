import * as React from 'react';
import * as fc from 'fast-check';
import { render, cleanup } from 'react-testing-library';

import TextAnimation from '../TextAnimation';
import { EMPTY_STRING } from '../../constants';

describe('TextAnimation', () => {
  it('calls onNextChar every text animation frame', () => {
    fc.assert(
      fc
        .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
          const onNextCharMock = jest.fn();
          render(
            <TextAnimation charInterval={interval} onNextChar={onNextCharMock}>
              {text}
            </TextAnimation>,
          );

          jest.advanceTimersByTime(interval * text.length);
          expect(onNextCharMock).toBeCalledTimes(text.length);
        })
        .afterEach(cleanup)
        .beforeEach(jest.useFakeTimers),
    );
  });
  describe('type mode', () => {
    it('renders caret on the end of text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container, getByTestId } = render(
              <TextAnimation
                charInterval={interval}
                caret={<div data-testid="caret" />}
              >
                {text}
              </TextAnimation>,
            );

            expect(getByTestId('caret')).toBeInTheDocument();

            jest.advanceTimersByTime(interval * text.length);

            expect(
              container.children[container.children.length - 1],
            ).toHaveAttribute('data-testid', 'caret');
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
    it('animates unnested text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <TextAnimation charInterval={interval}>{text}</TextAnimation>,
            );

            expect(container).toHaveTextContent(EMPTY_STRING);

            jest.advanceTimersByTime(interval * text.length);
            expect(container.textContent).toBe(text);
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });

    it('animates nested text', () => {
      fc.assert(
        fc
          .property(
            fc.string(),
            fc.integer(1, 100000),
            fc.integer(1, 50),
            (text, interval, nesting) => {
              let structure = <div data-testid="txt-container">{text}</div>;

              for (let i = 0; i < nesting; i++) {
                structure = <div>{structure}</div>;
              }

              const { getByTestId } = render(
                <TextAnimation charInterval={interval}>
                  {structure}
                </TextAnimation>,
              );

              const textContainer = getByTestId('txt-container');
              expect(textContainer).toHaveTextContent(EMPTY_STRING);

              jest.advanceTimersByTime(interval * text.length);
              expect(textContainer.textContent).toBe(text);
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });

    it('animates texts in order from first to last one', () => {
      fc.assert(
        fc
          .property(
            fc.array(fc.string(), 2, 10),
            fc.integer(1, 100000),
            (texts, interval) => {
              const { getByTestId } = render(
                <TextAnimation charInterval={interval}>
                  {texts.map((text, i) => (
                    <div key={i} data-testid={`txt-container-${i}`}>
                      {text}
                    </div>
                  ))}
                </TextAnimation>,
              );

              texts.forEach((text, i) => {
                const currentContainer = getByTestId(`txt-container-${i}`);

                expect(currentContainer.textContent).toBe(EMPTY_STRING);

                jest.advanceTimersByTime(interval * text.length);
                expect(currentContainer.textContent).toBe(text);
              });
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });
  describe('delete mode', () => {
    it('renders caret before text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container, getByTestId } = render(
              <TextAnimation
                charInterval={interval}
                caret={<div data-testid="caret" />}
              >
                {text}
              </TextAnimation>,
            );

            expect(getByTestId('caret')).toBeInTheDocument();

            jest.advanceTimersByTime(interval * text.length);

            expect(container.children[0]).toHaveAttribute(
              'data-testid',
              'caret',
            );
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
    it('animates unnested text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <TextAnimation animation="delete" charInterval={interval}>
                {text}
              </TextAnimation>,
            );

            expect(container.textContent).toBe(text);

            jest.advanceTimersByTime(interval * text.length);
            expect(container).toHaveTextContent(EMPTY_STRING);
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });

    it('animates nested text', () => {
      fc.assert(
        fc
          .property(
            fc.string(),
            fc.integer(1, 100000),
            fc.integer(1, 50),
            (text, interval, nesting) => {
              let structure = <div data-testid="txt-container">{text}</div>;

              for (let i = 0; i < nesting; i++) {
                structure = <div>{structure}</div>;
              }

              const { getByTestId } = render(
                <TextAnimation animation="delete" charInterval={interval}>
                  {structure}
                </TextAnimation>,
              );

              const textContainer = getByTestId('txt-container');
              expect(textContainer.textContent).toBe(text);

              jest.advanceTimersByTime(interval * text.length);
              expect(textContainer).toHaveTextContent(EMPTY_STRING);
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });

    it('animates texts in order from first to last one', () => {
      fc.assert(
        fc
          .property(
            fc.array(fc.string(), 2, 10),
            fc.integer(1, 100000),
            (texts, interval) => {
              const { getByTestId } = render(
                <TextAnimation animation="delete" charInterval={interval}>
                  {texts.map((text, i) => (
                    <div key={i} data-testid={`txt-container-${i}`}>
                      {text}
                    </div>
                  ))}
                </TextAnimation>,
              );

              texts.forEach((text, i) => {
                const currentContainer = getByTestId(`txt-container-${i}`);
                expect(currentContainer.textContent).toBe(text);

                jest.advanceTimersByTime(interval * text.length);
                expect(currentContainer.textContent).toBe(EMPTY_STRING);
              });
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });

  describe('backspace mode', () => {
    it('renders caret on the end of text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container, getByTestId } = render(
              <TextAnimation
                charInterval={interval}
                caret={<div data-testid="caret" />}
              >
                {text}
              </TextAnimation>,
            );

            expect(getByTestId('caret')).toBeInTheDocument();

            jest.advanceTimersByTime(interval * text.length);

            expect(
              container.children[container.children.length - 1],
            ).toHaveAttribute('data-testid', 'caret');
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
    it('animates unnested text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <TextAnimation animation="backspace" charInterval={interval}>
                {text}
              </TextAnimation>,
            );

            expect(container.textContent).toBe(text);

            jest.advanceTimersByTime(interval * text.length);
            expect(container).toHaveTextContent(EMPTY_STRING);
          })
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });

    it('animates nested text', () => {
      fc.assert(
        fc
          .property(
            fc.string(),
            fc.integer(1, 100000),
            fc.integer(1, 50),
            (text, interval, nesting) => {
              let structure = <div data-testid="txt-container">{text}</div>;

              for (let i = 0; i < nesting; i++) {
                structure = <div>{structure}</div>;
              }

              const { getByTestId } = render(
                <TextAnimation animation="backspace" charInterval={interval}>
                  {structure}
                </TextAnimation>,
              );

              const textContainer = getByTestId('txt-container');
              expect(textContainer.textContent).toBe(text);

              jest.advanceTimersByTime(interval * text.length);
              expect(textContainer).toHaveTextContent(EMPTY_STRING);
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });

    it('animates texts in order from last to first one', () => {
      fc.assert(
        fc
          .property(
            fc.array(fc.string(), 2, 10),
            fc.integer(1, 100000),
            (texts, interval) => {
              const { getByTestId } = render(
                <TextAnimation animation="backspace" charInterval={interval}>
                  {texts.map((text, i) => (
                    <div key={i} data-testid={`txt-container-${i}`}>
                      {text}
                    </div>
                  ))}
                </TextAnimation>,
              );

              for (let i = texts.length - 1; i > -1; i--) {
                const currentContainer = getByTestId(`txt-container-${i}`);
                const currentText = texts[i];
                expect(currentContainer.textContent).toBe(currentText);
                jest.advanceTimersByTime(interval * currentText.length);
                expect(currentContainer.textContent).toBe(EMPTY_STRING);
              }
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });
});
