import * as React from 'react';
import * as fc from 'fast-check';
import { render, cleanup } from 'react-testing-library';

import TextAnim from '../TextAnim';
import { EMPTY_STRING } from '../../constants';

describe('Core component', () => {
  describe('type mode', () => {
    it('animates unnested text', () => {
      fc.assert(
        fc
          .property(fc.string(), fc.integer(1, 100000), (text, interval) => {
            const { container } = render(
              <TextAnim charInterval={interval}>{text}</TextAnim>,
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
                <TextAnim charInterval={interval}>{structure}</TextAnim>,
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
                <TextAnim charInterval={interval}>
                  {texts.map((text, i) => (
                    <div key={i} data-testid={`txt-container-${i}`}>
                      {text}
                    </div>
                  ))}
                </TextAnim>,
              );

              for (let i = 0; i < texts.length; i++) {
                const currentText = texts[i];
                const currentContainer = getByTestId(`txt-container-${i}`);

                expect(currentContainer.textContent).toBe(EMPTY_STRING);

                jest.advanceTimersByTime(interval * currentText.length);
                expect(currentContainer.textContent).toBe(currentText);
              }
            },
          )
          .afterEach(cleanup)
          .beforeEach(jest.useFakeTimers),
      );
    });
  });
  // describe('delete mode', () => { });
  // describe('backspace mode', () => { });
});
