// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import DragUtils from '../src/drag-utils.js';

const createCssElement = (initialStyles) => {
  const styles = { ...initialStyles };
  const element = {
    css(property) {
      if (typeof property === 'string') {
        return styles[property] ?? '';
      }

      Object.assign(styles, property);
      return element;
    },
    styles,
  };

  return element;
};

describe('DragUtils.convertSrgbToRgba', () => {
  it('converts srgb channels to rounded rgba channels', () => {
    expect(DragUtils.convertSrgbToRgba('color(srgb 0.25 0.5 0.75)'))
      .toBe('rgba(64, 128, 191, 1)');
  });

  it('preserves an explicit alpha channel', () => {
    expect(DragUtils.convertSrgbToRgba('color(srgb 1 0 0 / 0.4)'))
      .toBe('rgba(255, 0, 0, 0.4)');
  });

  it.each([
    ['', ''],
    [undefined, undefined],
    ['rgb(1, 2, 3)', 'rgb(1, 2, 3)'],
  ])('returns unsupported boundary input unchanged', (input, expected) => {
    expect(DragUtils.convertSrgbToRgba(input)).toBe(expected);
  });
});

describe('DragUtils.setAlphas', () => {
  it('adds an alpha channel to an rgb colour', () => {
    expect(DragUtils.setAlphas('rgb(10, 20, 30)', 'rgb(', 0.5))
      .toBe('rgba(10, 20, 30,0.5)');
  });

  it('multiplies an existing rgba alpha channel', () => {
    expect(DragUtils.setAlphas('rgba(10, 20, 30, 0.4)', 'rgba(', 0.5))
      .toBe('rgba(10, 20, 30,0.2)');
  });

  it('returns undefined for a missing style', () => {
    expect(DragUtils.setAlphas(undefined, 'rgb(', 0.5)).toBeUndefined();
  });
});

describe('DragUtils.setOpacity', () => {
  it('applies percentage opacity to a background colour', () => {
    const element = createCssElement({
      backgroundColor: 'rgb(10, 20, 30)',
    });

    DragUtils.setOpacity(element, 'backgroundColor', 50);

    expect(element.styles.backgroundColor).toBe('rgba(10, 20, 30,0.5)');
  });

  it('uses full opacity when no percentage is supplied', () => {
    const element = createCssElement({
      borderColor: 'rgb(1, 2, 3)',
    });

    DragUtils.setOpacity(element, 'borderColor');

    expect(element.styles).toMatchObject({
      borderTopColor: 'rgba(1, 2, 3,1)',
      borderRightColor: 'rgba(1, 2, 3,1)',
      borderBottomColor: 'rgba(1, 2, 3,1)',
      borderLeftColor: 'rgba(1, 2, 3,1)',
    });
  });
});

describe('DragUtils.positionToPercentage', () => {
  it('converts pixel positions relative to the container dimensions', () => {
    const container = {
      innerHeight: () => 200,
      innerWidth: () => 400,
    };
    const element = {
      css: (property) => property === 'top' ? '50px' : '100px',
    };

    expect(DragUtils.positionToPercentage(container, element)).toEqual({
      top: '25%',
      left: '25%',
    });
  });

  it('documents non-numeric positions as NaN percentages', () => {
    const container = {
      innerHeight: () => 200,
      innerWidth: () => 400,
    };
    const element = {
      css: () => 'auto',
    };

    expect(DragUtils.positionToPercentage(container, element)).toEqual({
      top: 'NaN%',
      left: 'NaN%',
    });
  });
});

describe('DragUtils.strip', () => {
  it('removes nested markup and decodes HTML entities', () => {
    expect(DragUtils.strip('<p>Hello <strong>world</strong> &amp; all</p>'))
      .toBe('Hello world & all');
  });

  it('concatenates adjacent element text as the DOM exposes it', () => {
    expect(DragUtils.strip('<p>first</p><p>second</p>')).toBe('firstsecond');
  });

  it.each([
    ['', ''],
    [null, ''],
  ])('handles empty boundary input', (input, expected) => {
    expect(DragUtils.strip(input)).toBe(expected);
  });
});

describe('DragUtils.elementToDraggable', () => {
  it('skips sparse entries and annotates a matching result', () => {
    const target = {};
    const draggable = {
      findElement: (element) => element === target ? { element: target } : undefined,
    };

    expect(DragUtils.elementToDraggable([undefined, draggable], target))
      .toEqual({
        element: target,
        draggable,
      });
  });

  it('returns undefined when no draggable owns the element', () => {
    const draggable = {
      findElement: () => undefined,
    };

    expect(DragUtils.elementToDraggable([draggable], {})).toBeUndefined();
  });
});
