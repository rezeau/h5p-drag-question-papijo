import fs from 'node:fs';
import vm from 'node:vm';

import { describe, expect, it, vi } from 'vitest';

const presaveSource = fs.readFileSync(
  new URL('../presave.js', import.meta.url),
  'utf8',
);

class InvalidContentSemanticsException extends Error {}

const loadPresave = () => {
  const presaveApi = {
    checkNestedRequirements(content, path) {
      return path
        .split('.')
        .reduce((value, key) => value?.[key], { content }) !== undefined;
    },
    exceptions: {
      InvalidContentSemanticsException,
    },
    validateScore: vi.fn(),
  };
  const sandbox = {
    H5PEditor: {
      Presave: presaveApi,
    },
    H5PPresave: {},
  };

  vm.runInNewContext(presaveSource, sandbox, {
    filename: 'presave.js',
  });

  return {
    calculate: sandbox.H5PPresave['H5P.DragQuestion'],
    presaveApi,
  };
};

const runCalculation = (content) => {
  const { calculate, presaveApi } = loadPresave();
  const finished = vi.fn();

  calculate(content, finished);

  return {
    finished,
    presaveApi,
    result: finished.mock.calls[0][0],
  };
};

describe('Drag Question presave maximum score', () => {
  it('rejects content without the required task structure', () => {
    const { calculate } = loadPresave();

    expect(() => calculate({}, vi.fn()))
      .toThrow(InvalidContentSemanticsException);
  });

  it('uses one point when there are no drop zones', () => {
    const { presaveApi, result } = runCalculation({
      question: {
        task: {
          elements: [],
        },
      },
    });

    expect(result).toEqual({ maxScore: 1 });
    expect(presaveApi.validateScore).toHaveBeenCalledWith(1);
  });

  it('uses one point when no drop zone has correct elements', () => {
    const { result } = runCalculation({
      question: {
        task: {
          dropZones: [
            { correctElements: [] },
          ],
          elements: [
            { multiple: false },
          ],
        },
      },
    });

    expect(result).toEqual({ maxScore: 1 });
  });

  it('uses one point when single-point scoring is enabled', () => {
    const { result } = runCalculation({
      behaviour: {
        singlePoint: true,
      },
      question: {
        task: {
          dropZones: [
            { correctElements: [0, 1] },
            { correctElements: [0] },
          ],
          elements: [
            { multiple: false },
            { multiple: false },
          ],
        },
      },
    });

    expect(result).toEqual({ maxScore: 1 });
  });

  it('counts one point for each eligible non-multiple element', () => {
    const { result } = runCalculation({
      question: {
        task: {
          dropZones: [
            { correctElements: [0, 1] },
            { correctElements: [0] },
          ],
          elements: [
            { multiple: false },
            { multiple: false },
          ],
        },
      },
    });

    expect(result).toEqual({ maxScore: 2 });
  });

  it('documents the existing sparse-map length score for multiple elements', () => {
    const { result } = runCalculation({
      question: {
        task: {
          dropZones: [
            { correctElements: [0, 2] },
          ],
          elements: [
            { multiple: true },
            { multiple: false },
            { multiple: false },
          ],
        },
      },
    });

    expect(result).toEqual({ maxScore: 4 });
  });

  it('validates and returns zero when correct mappings exist without elements', () => {
    const { finished, presaveApi, result } = runCalculation({
      question: {
        task: {
          dropZones: [
            { correctElements: [0] },
          ],
        },
      },
    });

    expect(result).toEqual({ maxScore: 0 });
    expect(presaveApi.validateScore).toHaveBeenCalledWith(0);
    expect(finished).toHaveBeenCalledOnce();
  });
});
