import {
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';

class EventDispatcher {}

const JQuery = (markup) => {
  return {
    markup,
    text: () => typeof markup === 'string' ? markup.replace(/<[^>]*>/g, '') : '',
  };
};
JQuery.inArray = (value, values) => {
  return Array.isArray(values) ? values.indexOf(value) : -1;
};

const Question = function () {};

globalThis.H5P = {
  createTitle: (title) => title,
  EventDispatcher,
  Question,
  jQuery: JQuery,
};

let DragQuestion;

beforeAll(async () => {
  await import('../src/drag-question-papijo.js');
  DragQuestion = H5P.DragQuestionPapiJo;
});

const createSubject = (properties = {}) => {
  return Object.assign(
    Object.create(DragQuestion.prototype),
    properties,
  );
};

const createClassQuery = (classes = []) => {
  const classNames = new Set(classes);
  return {
    hasClass: (className) => classNames.has(className),
  };
};

const createIntroductionSubject = ({
  description,
  questionTitle = 'Question title must not be displayed',
  showTitle,
} = {}) => {
  const introductions = [];
  const settings = {
    questionTitle,
  };

  if (description !== undefined) {
    settings.description = description;
  }

  const subject = createSubject({
    options: {
      behaviour: {
        enableFullScreen: false,
        showTitle,
      },
      question: {
        settings,
      },
    },
    createQuestionContent: () => ({}),
    registerButtons: () => {},
    setContent: () => {},
    setIntroduction: (introduction) => introductions.push(introduction),
    trigger: () => {},
  });

  subject.registerDomElements();

  return {
    introductions,
    subject,
  };
};

describe('Drag Question task introduction', () => {
  it('displays the Task description when present', () => {
    const { introductions } = createIntroductionSubject({
      description: 'Follow the instructions.',
    });

    expect(introductions).toHaveLength(1);
    expect(introductions[0].markup).toContain('Follow the instructions.');
  });

  it.each([true, false])('ignores legacy showTitle=%s and displays only the Task description', (showTitle) => {
    const { introductions } = createIntroductionSubject({
      description: 'Visible task description',
      questionTitle: 'Hidden question title',
      showTitle,
    });

    expect(introductions).toHaveLength(1);
    expect(introductions[0].markup).toContain('Visible task description');
    expect(introductions[0].markup).not.toContain('Hidden question title');
  });

  it.each([
    ['empty', ''],
    ['whitespace-only', '   '],
    ['missing', undefined],
  ])('does not render an introduction when the Task description is %s', (label, description) => {
    const { introductions, subject } = createIntroductionSubject({
      description,
      questionTitle: 'Hidden question title',
      showTitle: true,
    });

    expect(introductions).toHaveLength(0);
    expect(subject.$introduction).toBeUndefined();
  });

  it('preserves authored HTML in the Task description', () => {
    const description = '<h2>Sort these</h2><ul><li><strong>Carefully</strong></li></ul>';
    const { introductions } = createIntroductionSubject({ description });

    expect(introductions[0].markup).toContain(description);
  });
});

describe('Drag Question title reporting', () => {
  it('continues to use questionTitle in the xAPI definition', () => {
    const subject = createSubject({
      options: {
        question: {
          settings: {
            questionTitle: '<strong>Reporting title</strong>',
          },
          task: {
            dropZones: [],
            elements: [],
          },
        },
      },
    });

    expect(subject.getXAPIDefinition().description['en-US']).toBe('Reporting title');
  });

  it('continues to expose the H5P metadata title', () => {
    const subject = createSubject({
      contentData: {
        metadata: {
          title: 'Metadata title',
        },
      },
    });

    expect(subject.getTitle()).toBe('Metadata title');
  });
});

const createScoreSubject = ({
  blankIsCorrect = false,
  correctDZs = [],
  dropZones = [],
  elements = [],
  quantityMode = false,
  singlePoint = false,
  weight = 1,
} = {}) => {
  return createSubject({
    blankIsCorrect,
    correctDZs,
    options: {
      behaviour: {
        enableDroppedQuantity: quantityMode,
        singlePoint,
      },
      question: {
        task: {
          dropZones,
          elements,
        },
      },
    },
    weight,
  });
};

describe('Drag Question maximum-score calculation', () => {
  it('counts ordinary correct mappings across drop zones', () => {
    const subject = createScoreSubject({
      correctDZs: [
        [0],
        [1],
      ],
      dropZones: [
        {
          correctElements: ['0'],
          single: false,
        },
        {
          correctElements: ['1'],
          single: false,
        },
      ],
      elements: [
        {
          multiple: false,
        },
        {
          multiple: false,
        },
      ],
    });

    expect(subject.calculateMaxScore()).toBe(2);
  });

  it('returns zero when no correct mappings exist and blank is not correct', () => {
    const subject = createScoreSubject({
      dropZones: [
        {
          correctElements: [],
          single: false,
        },
      ],
      elements: [
        {
          multiple: false,
        },
      ],
    });

    expect(subject.calculateMaxScore()).toBe(0);
  });

  it('returns one immediately when blank input is considered correct', () => {
    const subject = createScoreSubject({
      blankIsCorrect: true,
      dropZones: [],
      elements: [],
    });

    expect(subject.calculateMaxScore()).toBe(1);
  });

  it('uses the configured weight in single-point mode', () => {
    const subject = createScoreSubject({
      correctDZs: [
        [0],
        [1],
      ],
      dropZones: [
        {
          correctElements: ['0'],
          single: false,
        },
        {
          correctElements: ['1'],
          single: false,
        },
      ],
      elements: [
        {
          multiple: false,
        },
        {
          multiple: false,
        },
      ],
      singlePoint: true,
      weight: 3,
    });

    expect(subject.getMaxScore()).toBe(3);
  });

  it('counts every correct destination for a multiple draggable', () => {
    const subject = createScoreSubject({
      correctDZs: [
        [0, 1],
      ],
      dropZones: [
        {
          correctElements: ['0'],
          single: false,
        },
        {
          correctElements: ['0'],
          single: false,
        },
      ],
      elements: [
        {
          multiple: true,
        },
      ],
    });

    expect(subject.calculateMaxScore()).toBe(2);
  });

  it('preserves source indexes while skipping sparse element entries', () => {
    const elements = [];
    elements[2] = {
      multiple: false,
    };
    const correctDZs = [];
    correctDZs[2] = [0];
    const subject = createScoreSubject({
      correctDZs,
      dropZones: [
        {
          correctElements: ['2'],
          single: false,
        },
      ],
      elements,
    });

    expect(subject.calculateMaxScore()).toBe(1);
  });

  it('uses the number of drop zones as maximum score in quantity mode', () => {
    const subject = createScoreSubject({
      dropZones: [{}, {}, {}],
      elements: [],
      quantityMode: true,
    });

    expect(subject.calculateMaxScore()).toBe(3);
  });
});

describe('Drag Question answer-selection detection', () => {
  it('returns false when there are no draggables', () => {
    const subject = createSubject({
      draggables: [],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('returns false when no draggable has been placed', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery([]),
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('returns true for one placed ordinary draggable', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(['h5p-dropped']),
              dropZone: 0,
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(true);
  });

  it('returns true when all ordinary draggables have been placed', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(['h5p-dropped']),
              dropZone: 0,
            },
          ],
        },
        {
          elements: [
            {
              $: createClassQuery(['h5p-dropped']),
              dropZone: 2,
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(true);
  });

  it('returns true for a placed learner-created copy of a multiple draggable', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery([]),
            },
            {
              $: createClassQuery(['h5p-dropped']),
              dropZone: 2,
            },
          ],
          multiple: true,
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(true);
  });

  it('returns false when only some ordinary draggables have been placed', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(['h5p-dropped']),
              dropZone: 0,
            },
          ],
        },
        {
          elements: [
            {
              $: createClassQuery([]),
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('does not let multiple copies compensate for another unanswered draggable', () => {
    const placedCopy = (dropZone) => {
      return {
        $: createClassQuery(['h5p-dropped']),
        dropZone,
      };
    };
    const subject = createSubject({
      draggables: [
        {
          elements: [
            placedCopy(0),
            placedCopy(1),
          ],
          multiple: true,
        },
        {
          elements: [
            {
              $: createClassQuery([]),
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('ignores static-element holes in a sparse draggable array', () => {
    const draggables = [];
    draggables[2] = {
      elements: [
        {
          $: createClassQuery(['h5p-dropped']),
          dropZone: 1,
        },
      ],
    };
    const subject = createSubject({
      draggables,
    });

    expect(subject.isAnswerSelected()).toBe(true);
    expect(subject.draggables.length).toBe(3);
  });

  it('returns false for an array containing only holes and undefined entries', () => {
    const draggables = new Array(3);
    draggables[1] = undefined;
    const subject = createSubject({
      draggables,
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('ignores undefined entries before a placed draggable', () => {
    const subject = createSubject({
      draggables: [
        undefined,
        {
          elements: [
            {
              $: createClassQuery(['h5p-dropped']),
              dropZone: 0,
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(true);
  });

  it('ignores elements inserted by Show Solution', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery([
                'h5p-dropped',
                'h5p-question-solution',
              ]),
              dropZone: 0,
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('returns false when the draggable collection is missing', () => {
    const subject = createSubject({
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('treats draggables with missing or malformed element collections as incomplete', () => {
    const subject = createSubject({
      draggables: [
        {},
        {
          elements: undefined,
        },
        {
          elements: null,
        },
        {
          elements: {},
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });

  it('ignores holes and undefined entries in an element collection', () => {
    const elements = new Array(3);
    elements[1] = undefined;
    elements[2] = {
      $: createClassQuery(['h5p-dropped']),
      dropZone: 1,
    };
    const subject = createSubject({
      draggables: [
        {
          elements,
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(true);
  });

  it('ignores placed-looking elements without expected class helpers', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              dropZone: 0,
            },
            {
              $: {},
              dropZone: 1,
            },
          ],
        },
      ],
    });

    expect(subject.isAnswerSelected()).toBe(false);
  });
});

describe('Drag Question user-answer mapping', () => {
  it('returns ordinary elements with their stable source index', () => {
    const element = {
      dropZone: 2,
    };
    const subject = createSubject({
      draggables: [
        {
          elements: [element],
        },
      ],
    });

    expect(subject.getUserAnswers()).toEqual([
      {
        elements: [element],
        index: 0,
      },
    ]);
    expect(subject.getUserXAPIResponse()).toBe('2[.]0');
  });

  it('maps multiple copies to the same source index', () => {
    const subject = createSubject({
      draggables: [
        undefined,
        {
          elements: [
            {
              dropZone: 0,
            },
            {
              dropZone: 2,
            },
          ],
        },
      ],
    });

    expect(subject.getUserXAPIResponse()).toBe('0[.]1[,]2[.]1');
  });

  it('omits unanswered elements from the encoded response', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {},
            {
              dropZone: 1,
            },
          ],
        },
      ],
    });

    expect(subject.getUserXAPIResponse()).toBe('1[.]0');
  });

  it('preserves sparse draggable indexes in encoded identifiers', () => {
    const draggables = [];
    draggables[3] = {
      elements: [
        {
          dropZone: 1,
        },
      ],
    };
    const subject = createSubject({
      draggables,
    });

    expect(subject.getUserXAPIResponse()).toBe('1[.]3');
  });

  it('preserves duplicate mappings when copies share a target', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              dropZone: 2,
            },
            {
              dropZone: 2,
            },
          ],
        },
      ],
    });

    expect(subject.getUserXAPIResponse()).toBe('2[.]0[,]2[.]0');
  });

  it('returns an empty response for empty and unanswered mappings', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [],
        },
        {
          elements: [{}],
        },
      ],
    });

    expect(subject.getUserXAPIResponse()).toBe('');
  });

  it('filters missing draggables and entries without element collections', () => {
    const subject = createSubject({
      draggables: [
        undefined,
        {},
        {
          elements: [],
        },
      ],
    });

    expect(subject.getUserAnswers()).toEqual([
      {
        elements: [],
        index: 2,
      },
    ]);
  });

  it('throws while encoding a null element entry', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [null],
        },
      ],
    });

    expect(() => subject.getUserXAPIResponse()).toThrow(TypeError);
  });
});

describe('Drag Question state serialization', () => {
  it('serializes an ordinary position and drop-zone id', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(),
              dropZone: 2,
              position: {
                left: '12.5%',
                top: '25%',
              },
            },
          ],
        },
      ],
    });

    expect(subject.getCurrentState()).toEqual({
      answers: [
        [
          {
            dz: 2,
            x: 12.5,
            y: 25,
          },
        ],
      ],
    });
  });

  it('serializes multiple copies in their current element order', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(),
              dropZone: 2,
              position: {
                left: '80%',
                top: '70%',
              },
            },
            {
              $: createClassQuery(),
              dropZone: 0,
              position: {
                left: '10%',
                top: '20%',
              },
            },
          ],
        },
      ],
    });

    expect(subject.getCurrentState().answers[0]).toEqual([
      {
        dz: 2,
        x: 80,
        y: 70,
      },
      {
        dz: 0,
        x: 10,
        y: 20,
      },
    ]);
  });

  it('preserves sparse draggable source indexes', () => {
    const draggables = [];
    draggables[3] = {
      elements: [
        {
          $: createClassQuery(),
          dropZone: 1,
          position: {
            left: '10%',
            top: '20%',
          },
        },
      ],
    };
    const subject = createSubject({
      draggables,
    });

    const state = subject.getCurrentState();
    expect(state.answers).toHaveLength(4);
    expect(0 in state.answers).toBe(false);
    expect(state.answers[3][0].dz).toBe(1);
  });

  it('skips sparse elements and unanswered elements', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            undefined,
            {
              $: createClassQuery(),
            },
          ],
        },
      ],
    });

    expect(subject.getCurrentState()).toEqual({
      answers: [],
    });
  });

  it.each([
    'h5p-question-solution',
    'h5p-question-hidden',
  ])('skips elements marked with %s', (className) => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery([className]),
              dropZone: 1,
              position: {
                left: '10%',
                top: '20%',
              },
            },
          ],
        },
      ],
    });

    expect(subject.getCurrentState()).toEqual({
      answers: [],
    });
  });

  it('stores null coordinates when placement has no position data', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(),
              dropZone: 1,
            },
          ],
        },
      ],
    });

    expect(subject.getCurrentState().answers[0][0]).toEqual({
      dz: 1,
      x: null,
      y: null,
    });
  });

  it('throws when a placed element has no jQuery-style class interface', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              dropZone: 1,
              position: {
                left: '10%',
                top: '20%',
              },
            },
          ],
        },
      ],
    });

    expect(() => subject.getCurrentState()).toThrow(TypeError);
  });

  it('throws when position data is incomplete', () => {
    const subject = createSubject({
      draggables: [
        {
          elements: [
            {
              $: createClassQuery(),
              dropZone: 1,
              position: {
                top: '20%',
              },
            },
          ],
        },
      ],
    });

    expect(() => subject.getCurrentState()).toThrow(TypeError);
  });
});
