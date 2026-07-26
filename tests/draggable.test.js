// @vitest-environment jsdom

import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const queryState = new WeakMap();

const getQueryState = (node) => {
  if (!queryState.has(node)) {
    queryState.set(node, {
      classes: new Set(),
      data: new Map(),
      draggableActions: [],
      removed: false,
      styles: {},
    });
  }

  return queryState.get(node);
};

class FakeQuery {
  constructor(values = []) {
    const nodes = Array.isArray(values) ? values : [values];
    this.nodes = nodes.filter((value) => value !== undefined && value !== null);
    this.length = this.nodes.length;
    this.nodes.forEach((node, index) => {
      this[index] = node;
      getQueryState(node);
    });
  }

  add(other) {
    return new FakeQuery([
      ...this.nodes,
      ...JQuery(other).nodes,
    ]);
  }

  addClass(classes) {
    this.nodes.forEach((node) => {
      classes.split(' ').filter(Boolean).forEach((className) => {
        getQueryState(node).classes.add(className);
      });
    });
    return this;
  }

  animate(styles, complete) {
    this.css(styles);
    if (complete) {
      complete.call(this);
    }
    return this;
  }

  append() {
    return this;
  }

  appendTo(target) {
    const targetNode = JQuery(target)[0];
    this.nodes.forEach((node) => {
      if (node instanceof Node && targetNode instanceof Node) {
        targetNode.append(node);
      }
    });
    return this;
  }

  css(property) {
    if (typeof property === 'string') {
      const node = this.nodes[0];
      return node ? getQueryState(node).styles[property] ?? '' : '';
    }

    this.nodes.forEach((node) => {
      Object.assign(getQueryState(node).styles, property);
    });
    return this;
  }

  data(key, value) {
    const state = getQueryState(this.nodes[0]);
    if (value === undefined) {
      return state.data.get(key);
    }

    state.data.set(key, value);
    return this;
  }

  detach() {
    this.nodes.forEach((node) => {
      if (node instanceof Node) {
        node.remove();
      }
    });
    return this;
  }

  draggable(action) {
    this.nodes.forEach((node) => {
      getQueryState(node).draggableActions.push(action);
    });
    return this;
  }

  focus() {
    return this;
  }

  hasClass(className) {
    const node = this.nodes[0];
    return node ? getQueryState(node).classes.has(className) : false;
  }

  is(element) {
    return this.nodes[0] === JQuery(element)[0];
  }

  prependTo() {
    return this;
  }

  remove() {
    this.nodes.forEach((node) => {
      getQueryState(node).removed = true;
      if (node instanceof Node) {
        node.remove();
      }
    });
    return this;
  }

  removeClass(classes) {
    this.nodes.forEach((node) => {
      classes.split(' ').filter(Boolean).forEach((className) => {
        getQueryState(node).classes.delete(className);
      });
    });
    return this;
  }

  removeData(key) {
    this.nodes.forEach((node) => {
      getQueryState(node).data.delete(key);
    });
    return this;
  }
}

const JQuery = (value, options = {}) => {
  if (value instanceof FakeQuery) {
    return value;
  }

  let node = value;
  if (typeof value === 'string') {
    node = {
      html: value,
    };
  }

  const query = new FakeQuery(node);
  if (options.class) {
    query.addClass(options.class);
  }
  if (options.appendTo) {
    query.appendTo(options.appendTo);
  }
  return query;
};
JQuery.extend = (target, source) => Object.assign(target, source);

class EventDispatcher {
  constructor() {
    this.emittedEvents = [];
  }

  trigger(name, data) {
    this.emittedEvents.push({
      data,
      name,
    });
  }
}

const draggableComponents = [];

globalThis.H5P = {
  Components: {
    Draggable(configuration) {
      const element = document.createElement('div');
      element.setContentOpacity = vi.fn();
      element.setOpacity = vi.fn();
      draggableComponents.push({
        configuration,
        element,
      });
      return element;
    },
  },
  EventDispatcher,
  jQuery: JQuery,
  newRunnable: vi.fn(),
};

let Draggable;

beforeAll(async () => {
  ({ default: Draggable } = await import('../src/draggable.js'));
});

beforeEach(() => {
  draggableComponents.length = 0;
  H5P.newRunnable.mockClear();
});

const createDefinition = (overrides = {}) => {
  return {
    backgroundOpacity: 100,
    dropZones: ['0', '2'],
    height: 10,
    multiple: false,
    type: {
      library: 'H5P.AdvancedText 1.1',
      metadata: {
        title: 'Text',
      },
      params: {
        text: 'Text',
      },
    },
    value: 4,
    width: 20,
    x: 5,
    y: 10,
    ...overrides,
  };
};

const createDraggable = ({
  answers,
  definition = {},
  id = 3,
} = {}) => {
  return new Draggable(
    createDefinition(definition),
    id,
    answers,
    {
      correctAnswer: 'Correct answer',
      prefix: 'Grabbable 1 of 1.',
      suffix: 'Placed in dropzone {num}',
      wrongAnswer: 'Wrong answer',
    },
    [],
    1,
  );
};

const createElement = ({
  classes = [],
  dropZone,
  suffixLength = 1,
} = {}) => {
  const query = new FakeQuery(document.createElement('div'));
  classes.forEach((className) => {
    query.addClass(className);
  });

  return {
    $: query,
    $suffix: new FakeQuery(
      Array.from({ length: suffixLength }, () => ({
        suffix: true,
      })),
    ),
    dropZone,
  };
};

const eventNames = (draggable) => {
  return draggable.emittedEvents.map((event) => event.name);
};

describe('Draggable construction', () => {
  it('copies definition data and starts without elements when no state exists', () => {
    const draggable = createDraggable();

    expect(draggable).toMatchObject({
      backgroundOpacity: 100,
      dropZones: ['0', '2'],
      elements: [],
      height: 10,
      id: 3,
      multiple: false,
      value: 4,
      width: 20,
      x: 5,
      y: 10,
    });
  });

  it('restores saved placement using percentage strings', () => {
    const draggable = createDraggable({
      answers: [
        {
          dz: 2,
          x: 12.5,
          y: 25,
        },
      ],
    });

    expect(draggable.elements).toEqual([
      {
        dropZone: 2,
        position: {
          left: '12.5%',
          top: '25%',
        },
      },
    ]);
  });

  it('prepends an empty base element before saved copies for a multiple draggable', () => {
    const draggable = createDraggable({
      answers: [
        {
          dz: 0,
          x: 10,
          y: 20,
        },
      ],
      definition: {
        multiple: true,
      },
    });

    expect(draggable.elements).toHaveLength(2);
    expect(draggable.elements[0]).toEqual({});
    expect(draggable.elements[1].dropZone).toBe(0);
  });
});

describe('Draggable ownership and zone lookup', () => {
  it('matches accepted zones after parsing stored string ids', () => {
    const draggable = createDraggable();

    expect(draggable.hasDropZone(0)).toBe(true);
    expect(draggable.hasDropZone(2)).toBe(true);
    expect(draggable.hasDropZone(1)).toBe(false);
  });

  it('throws during accepted-zone lookup when zone data is missing', () => {
    const draggable = createDraggable({
      definition: {
        dropZones: undefined,
      },
    });

    expect(() => draggable.hasDropZone(0)).toThrow(TypeError);
  });

  it('finds an owned element while skipping sparse entries', () => {
    const draggable = createDraggable();
    const element = createElement();
    draggable.elements = [undefined, element];

    expect(draggable.findElement(element.$[0])).toEqual({
      element,
      index: 1,
    });
  });

  it('returns undefined when an element is not owned', () => {
    const draggable = createDraggable();
    draggable.elements = [createElement()];

    expect(draggable.findElement(document.createElement('div'))).toBeUndefined();
  });

  it('throws when a defined sparse placeholder has no jQuery element', () => {
    const draggable = createDraggable();
    draggable.elements = [{}];

    expect(() => draggable.findElement({})).toThrow(TypeError);
  });

  it('finds zone ownership while skipping missing elements', () => {
    const draggable = createDraggable();
    draggable.elements = [
      undefined,
      createElement({
        dropZone: 2,
      }),
    ];

    expect(draggable.isInDropZone(2)).toBe(true);
    expect(draggable.isInDropZone(0)).toBe(false);
  });
});

describe('Draggable copy decisions and identity', () => {
  it.each([
    {
      dropZone: undefined,
      expected: true,
      multiple: true,
    },
    {
      dropZone: 0,
      expected: false,
      multiple: true,
    },
    {
      dropZone: undefined,
      expected: false,
      multiple: false,
    },
  ])('returns $expected for multiple=$multiple and dropZone=$dropZone', ({
    dropZone,
    expected,
    multiple,
  }) => {
    const draggable = createDraggable({
      definition: {
        multiple,
      },
    });

    expect(draggable.mustCopyElement({ dropZone })).toBe(expected);
  });

  it('creates another element while preserving the owning draggable identity', () => {
    const draggable = createDraggable({
      definition: {
        multiple: true,
      },
      id: 7,
    });
    const container = new FakeQuery(document.createElement('div'));

    draggable.appendTo(container, 42);
    const first = draggable.elements[0];
    first.clone();

    expect(draggable.id).toBe(7);
    expect(draggable.elements).toHaveLength(2);
    expect(draggable.elements[0]).toBe(first);
    expect(draggable.elements[1]).not.toBe(first);
    expect(eventNames(draggable)).toEqual([
      'elementadd',
      'elementadd',
    ]);
  });
});

describe('Draggable placement bookkeeping', () => {
  it('marks placed elements and creates a drop-zone suffix', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 2,
    });

    draggable.updatePlacement(element);

    expect(element.$.hasClass('h5p-dropped')).toBe(true);
    expect(element.$suffix).toHaveLength(1);
  });

  it('clears placement and result classes when no drop zone is stored', () => {
    const draggable = createDraggable();
    const element = createElement({
      classes: [
        'h5p-correct',
        'h5p-dropped',
        'h5p-question-solution',
        'h5p-wrong',
      ],
    });

    draggable.updatePlacement(element);

    expect(element.$.hasClass('h5p-dropped')).toBe(false);
    expect(element.$.hasClass('h5p-correct')).toBe(false);
    expect(element.$.hasClass('h5p-wrong')).toBe(false);
    expect(element.$.hasClass('h5p-question-solution')).toBe(false);
  });

  it('moves an element between zones and emits leaving and interacted events', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 0,
    });
    draggable.elements = [element];

    draggable.addToDropZone(0, element, 2);

    expect(element.dropZone).toBe(2);
    expect(element.$.hasClass('h5p-dropped')).toBe(true);
    expect(eventNames(draggable)).toEqual([
      'leavingDropZone',
      'interacted',
    ]);
  });

  it('emits interacted but not leaving when placement stays in the same zone', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 0,
    });
    draggable.elements = [element];

    draggable.addToDropZone(0, element, 0);

    expect(eventNames(draggable)).toEqual(['interacted']);
  });

  it('removes a duplicate multiple copy and leaves a sparse array entry', () => {
    const draggable = createDraggable({
      definition: {
        multiple: true,
      },
    });
    const existing = createElement({
      dropZone: 0,
    });
    const duplicate = createElement({
      dropZone: 2,
    });
    draggable.elements = [existing, duplicate];
    draggable.element = duplicate;

    draggable.addToDropZone(1, duplicate, 0);

    expect(draggable.elements[0]).toBe(existing);
    expect(1 in draggable.elements).toBe(false);
    expect(getQueryState(duplicate.$[0]).removed).toBe(true);
    expect(eventNames(draggable)).toEqual(['leavingDropZone']);
  });
});

describe('Draggable element reset behavior', () => {
  it('clears ordinary placement and position while emitting leaving', () => {
    const draggable = createDraggable();
    const container = new FakeQuery(document.createElement('div'));
    draggable.appendTo(container, 42);
    const element = draggable.elements[0];
    element.dropZone = 2;
    element.position = {
      left: '20%',
      top: '30%',
    };
    draggable.emittedEvents = [];

    element.reset();

    expect(element.dropZone).toBeUndefined();
    expect(element.position).toBeUndefined();
    expect(eventNames(draggable)).toEqual(['leavingDropZone']);
  });

  it('deletes a multiple element and emits removal after leaving its zone', () => {
    const draggable = createDraggable({
      definition: {
        multiple: true,
      },
    });
    const container = new FakeQuery(document.createElement('div'));
    draggable.appendTo(container, 42);
    const element = draggable.elements[0];
    element.dropZone = 0;
    draggable.emittedEvents = [];

    element.reset();

    expect(0 in draggable.elements).toBe(false);
    expect(getQueryState(element.$[0]).removed).toBe(true);
    expect(eventNames(draggable)).toEqual([
      'leavingDropZone',
      'elementremove',
    ]);
  });

  it('emits ownership events while disabling and enabling existing elements', () => {
    const draggable = createDraggable();
    const element = createElement();
    draggable.elements = [undefined, element];

    draggable.disable();
    draggable.enable();

    expect(getQueryState(element.$[0]).draggableActions).toEqual([
      'disable',
      'enable',
    ]);
    expect(eventNames(draggable)).toEqual([
      'elementremove',
      'elementadd',
    ]);
  });
});

describe('Draggable result classification', () => {
  it('awards and visually marks a correct placed element', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 2,
    });
    draggable.elements = [element];

    expect(draggable.results(false, [2], undefined, false)).toBe(1);
    expect(draggable.rawPoints).toBe(1);
    expect(element.$.hasClass('h5p-correct')).toBe(true);
    expect(element.$.hasClass('h5p-dg-normal')).toBe(true);
  });

  it('penalizes and visually marks an incorrect placed element inline', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 1,
    });
    draggable.elements = [element];

    expect(draggable.results(false, [2], undefined, true)).toBe(-1);
    expect(draggable.rawPoints).toBe(0);
    expect(element.$.hasClass('h5p-wrong')).toBe(true);
    expect(element.$.hasClass('h5p-dg-inline')).toBe(true);
  });

  it('leaves an unanswered element unmarked and unscored', () => {
    const draggable = createDraggable();
    const element = createElement();
    draggable.elements = [element];

    expect(draggable.results(false, [2], undefined, false)).toBe(0);
    expect(element.$.hasClass('h5p-correct')).toBe(false);
    expect(element.$.hasClass('h5p-wrong')).toBe(false);
  });

  it('marks a placed distractor wrong when it has no solutions', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 0,
    });
    draggable.elements = [element];

    expect(draggable.results(false, undefined, undefined, false)).toBe(-1);
    expect(element.$.hasClass('h5p-wrong')).toBe(true);
  });

  it('skips sparse elements while scoring remaining placements', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 2,
    });
    draggable.elements = [undefined, element];

    expect(draggable.results(true, [2], undefined, false)).toBe(1);
    expect(draggable.rawPoints).toBe(1);
  });

  it('does not award a placed element already marked as a shown solution', () => {
    const draggable = createDraggable();
    const element = createElement({
      classes: ['h5p-question-solution'],
      dropZone: 2,
    });
    draggable.elements = [element];

    expect(draggable.results(true, [2], undefined, false)).toBe(0);
    expect(draggable.rawPoints).toBe(0);
  });

  it('awards correctness without visual marking when suffix length is not one', () => {
    const draggable = createDraggable();
    const element = createElement({
      dropZone: 2,
      suffixLength: 0,
    });
    draggable.elements = [element];

    expect(draggable.results(false, [2], undefined, false)).toBe(1);
    expect(element.$.hasClass('h5p-correct')).toBe(false);
  });
});
