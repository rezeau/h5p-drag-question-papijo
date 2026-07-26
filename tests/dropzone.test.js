import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

class FakeQuery {
  constructor(value = {}) {
    this[0] = value;
    this.length = value === null ? 0 : 1;
    this.classes = new Set();
    this.styles = {};
    this.dataStore = new Map();
    this.child = this;
  }

  addClass(classes) {
    classes.split(' ').filter(Boolean).forEach((className) => {
      this.classes.add(className);
    });
    return this;
  }

  appendTo() {
    return this;
  }

  blur(handler) {
    this.blurHandler = handler;
    return this;
  }

  children() {
    return this.child;
  }

  css(property) {
    if (typeof property === 'string') {
      return this.styles[property] ?? '';
    }

    Object.assign(this.styles, property);
    return this;
  }

  data(key, value) {
    if (value === undefined) {
      return this.dataStore.get(key);
    }

    this.dataStore.set(key, value);
    return this;
  }

  droppable() {
    return this;
  }

  focus(handler) {
    this.focusHandler = handler;
    return this;
  }

  hasClass(className) {
    return this.classes.has(className);
  }

  parent() {
    return this.parentQuery;
  }

  removeClass(classes) {
    classes.split(' ').filter(Boolean).forEach((className) => {
      this.classes.delete(className);
    });
    return this;
  }

  removeData(key) {
    this.dataStore.delete(key);
    return this;
  }
}

const JQuery = (value) => {
  return value instanceof FakeQuery ? value : new FakeQuery(value);
};
JQuery.prototype = FakeQuery.prototype;
JQuery.inArray = (value, values) => {
  return Array.isArray(values) ? values.indexOf(value) : -1;
};

const dropzoneComponent = {
  configuration: undefined,
};

const EventDispatcher = function () {
  this.trigger = () => {};
};

globalThis.H5P = {
  Components: {
    Dropzone(configuration) {
      dropzoneComponent.configuration = configuration;
      return {};
    },
  },
  EventDispatcher,
  JoubelUI: {
    createTip: () => null,
  },
  jQuery: JQuery,
};

let DropZone;

beforeAll(async () => {
  ({ default: DropZone } = await import('../src/dropzone.js'));
});

afterEach(() => {
  vi.useRealTimers();
  dropzoneComponent.configuration = undefined;
});

const createDefinition = (overrides = {}) => {
  return {
    acceptedNumber: undefined,
    acceptedValue: undefined,
    autoAlign: {
      enabled: false,
      size: {
        height: 100,
        width: 100,
      },
      spacing: 0,
    },
    backgroundOpacity: 100,
    behaviour: {},
    height: 20,
    label: 'Zone',
    resetSingleDraggables: false,
    showLabel: true,
    single: false,
    tipsAndFeedback: {},
    width: 20,
    x: 0,
    y: 0,
    ...overrides,
  };
};

const createZone = (overrides = {}) => {
  const zone = new DropZone(createDefinition(overrides), 0, {
    prefix: 'Dropzone {num}. ',
    tipAvailable: 'Tip available',
    tipLabel: 'Show tip',
  });
  zone.$dropZone = new FakeQuery();
  zone.$dropZone.child = new FakeQuery();
  return zone;
};

const createElement = (dropZone = 0) => {
  return {
    $: new FakeQuery(),
    dropZone,
  };
};

const createDraggable = ({
  dropZone = 0,
  elements = [createElement(dropZone)],
  id = 0,
  multiple = false,
  value = 0,
} = {}) => {
  return {
    elements,
    hasDropZone: vi.fn(() => true),
    id,
    isInDropZone: vi.fn((zoneId) => {
      return elements.some((element) => element?.dropZone === zoneId);
    }),
    multiple,
    resetPosition: vi.fn(),
    value,
  };
};

describe('DropZone construction', () => {
  it('uses an empty tip when the optional group is present without a tip', () => {
    expect(createZone().tip).toBe('');
  });

  it('throws when the optional tipsAndFeedback group is missing', () => {
    const definition = createDefinition();
    delete definition.tipsAndFeedback;

    expect(() => new DropZone(definition, 0, {})).toThrow(TypeError);
  });
});

describe('DropZone.accepts', () => {
  it('accepts a mapped draggable for a non-single zone', () => {
    const zone = createZone();
    const draggable = createDraggable();

    expect(zone.accepts(draggable, [draggable])).toBe(true);
    expect(draggable.hasDropZone).toHaveBeenCalledWith(0);
  });

  it('rejects a draggable with an empty accepted-zone mapping', () => {
    const zone = createZone();
    const draggable = createDraggable();
    draggable.hasDropZone.mockReturnValue(false);

    expect(zone.accepts(draggable, [draggable])).toBe(false);
  });

  it('rejects an occupied single zone by default', () => {
    const zone = createZone({
      single: true,
    });
    const occupant = createDraggable({
      id: 1,
    });
    const incoming = createDraggable({
      id: 2,
    });

    expect(zone.accepts(incoming, [occupant])).toBe(false);
  });

  it('allows replacing a different ordinary occupant when reset is enabled', () => {
    const zone = createZone({
      resetSingleDraggables: true,
      single: true,
    });
    const occupant = createDraggable({
      id: 1,
    });
    const incoming = createDraggable({
      id: 2,
    });

    expect(zone.accepts(incoming, [occupant])).toBe(true);
  });

  it.each([
    {
      description: 'a multiple occupant',
      incomingId: 2,
      occupantClasses: [],
      occupantId: 1,
      occupantMultiple: true,
    },
    {
      description: 'a correct occupant',
      incomingId: 2,
      occupantClasses: ['h5p-correct'],
      occupantId: 1,
      occupantMultiple: false,
    },
    {
      description: 'another instance with the same draggable id',
      incomingId: 1,
      occupantClasses: [],
      occupantId: 1,
      occupantMultiple: false,
    },
  ])('rejects $description even when reset is enabled', ({
    incomingId,
    occupantClasses,
    occupantId,
    occupantMultiple,
  }) => {
    const zone = createZone({
      resetSingleDraggables: true,
      single: true,
    });
    const occupant = createDraggable({
      id: occupantId,
      multiple: occupantMultiple,
    });
    occupantClasses.forEach((className) => {
      occupant.elements[0].$.addClass(className);
    });
    const incoming = createDraggable({
      id: incomingId,
    });

    expect(zone.accepts(incoming, [occupant])).toBe(false);
  });
});

describe('DropZone alignable bookkeeping', () => {
  it('adds a dropped element once and records its destination', () => {
    vi.useFakeTimers();
    const zone = new DropZone(createDefinition(), 0, {
      prefix: 'Dropzone {num}. ',
    });
    const container = new FakeQuery();
    const draggableElement = new FakeQuery();

    zone.appendTo(container, []);
    const { handleDropEvent } = dropzoneComponent.configuration;

    handleDropEvent({}, {
      draggable: draggableElement,
    });
    handleDropEvent({}, {
      draggable: draggableElement,
    });

    expect(draggableElement.data('addToZone')).toBe(0);
    expect(zone.alignables).toEqual([draggableElement]);
    vi.runAllTimers();
  });

  it('removes a known alignable without scheduling when alignment is disabled', () => {
    const zone = createZone();
    const first = new FakeQuery();
    const second = new FakeQuery();
    zone.alignables = [first, second];

    zone.removeAlignable(first);

    expect(zone.alignables).toEqual([second]);
    expect(zone.autoAlignTimer).toBeUndefined();
  });

  it('schedules one deferred re-alignment when alignment is enabled', () => {
    vi.useFakeTimers();
    const zone = createZone({
      autoAlign: {
        enabled: true,
        size: {
          height: 100,
          width: 100,
        },
        spacing: 0,
      },
    });
    const alignable = new FakeQuery();
    zone.alignables = [alignable];
    zone.autoAlign = vi.fn();

    zone.removeAlignable(alignable);

    expect(zone.autoAlignTimer).toBeDefined();
    vi.runAllTimers();
    expect(zone.autoAlign).toHaveBeenCalledOnce();
    expect(zone.autoAlignTimer).toBeUndefined();
  });

  it('updates positions and emits alignment events without real layout', () => {
    const zone = createZone();
    zone.x = 10;
    zone.y = 20;
    zone.$dropZone[0] = {
      getBoundingClientRect: () => ({
        height: 100,
        width: 100,
      }),
    };
    zone.$dropZone.parentQuery = new FakeQuery({
      getBoundingClientRect: () => ({
        height: 100,
        width: 100,
      }),
    });
    const first = new FakeQuery({
      getBoundingClientRect: () => ({
        height: 10,
        width: 20,
      }),
    });
    const second = new FakeQuery({
      getBoundingClientRect: () => ({
        height: 10,
        width: 20,
      }),
    });
    zone.alignables = [first, second];
    zone.trigger = vi.fn();

    zone.autoAlign();

    expect(first.styles).toMatchObject({
      left: '10%',
      top: '20%',
    });
    expect(second.styles).toMatchObject({
      left: '30%',
      top: '20%',
    });
    expect(zone.trigger).toHaveBeenCalledTimes(2);
  });
});

describe('DropZone completion status', () => {
  it('marks, reads, and clears completion', () => {
    const zone = createZone();

    expect(zone.getCompletedStatus()).toBe(false);
    zone.markCompleted();
    expect(zone.getCompletedStatus()).toBe(true);
    zone.unMarkCompleted();
    expect(zone.getCompletedStatus()).toBe(false);
  });
});

describe('DropZone.results', () => {
  it('completes quantity scoring when the accepted count is reached', () => {
    const zone = createZone({
      acceptedNumber: 2,
    });
    const first = createDraggable({
      id: 1,
    });
    const second = createDraggable({
      id: 2,
    });

    expect(zone.results([first, second], [[1, 2]])).toBe(1);
    expect(zone.getCompletedStatus()).toBe(true);
    expect(first.elements[0].$.hasClass('h5p-correct-quantity')).toBe(true);
    expect(second.elements[0].$.hasClass('h5p-correct-quantity')).toBe(true);
  });

  it('completes value scoring when accepted values sum to the target', () => {
    const zone = createZone({
      acceptedValue: 5,
    });
    const first = createDraggable({
      id: 1,
      value: 2,
    });
    const second = createDraggable({
      id: 2,
      value: 3,
    });

    expect(zone.results([first, second], [[1, 2]])).toBe(1);
    expect(zone.getCompletedStatus()).toBe(true);
  });

  it.each([
    {
      label: 'missing',
      solutions: [],
    },
    {
      label: 'empty',
      solutions: [[]],
    },
  ])('returns zero when the accepted-element mapping is $label', ({
    solutions,
  }) => {
    const zone = createZone({
      acceptedNumber: 1,
    });
    const draggable = createDraggable({
      id: 1,
    });

    expect(zone.results([draggable], solutions)).toBe(0);
    expect(draggable.elements[0].$.hasClass('h5p-incorrect-quantity'))
      .toBe(true);
  });

  it('is order-dependent when an extra incorrect draggable follows a correct one', () => {
    const correct = createDraggable({
      id: 1,
    });
    const incorrect = createDraggable({
      id: 2,
    });

    expect(createZone({ acceptedNumber: 1 }).results(
      [incorrect, correct],
      [[1]],
    )).toBe(1);
    expect(createZone({ acceptedNumber: 1 }).results(
      [correct, incorrect],
      [[1]],
    )).toBe(0);
  });

  it('skips missing draggable entries before scoring remaining data', () => {
    const zone = createZone({
      acceptedNumber: 1,
    });
    const draggable = createDraggable({
      id: 1,
    });

    expect(zone.results([undefined, draggable], [[1]])).toBe(1);
  });

  it.each([
    {
      acceptedNumber: 0,
      acceptedValue: undefined,
      expected: 1,
      label: 'an expected count of zero',
    },
    {
      acceptedNumber: undefined,
      acceptedValue: 5,
      expected: 0,
      label: 'a required non-zero value',
    },
    {
      acceptedNumber: undefined,
      acceptedValue: undefined,
      expected: 1,
      label: 'no quantity or value constraint',
    },
  ])('returns $expected for an empty zone with $label', ({
    acceptedNumber,
    acceptedValue,
    expected,
  }) => {
    const zone = createZone({
      acceptedNumber,
      acceptedValue,
    });

    expect(zone.results([], [[]])).toBe(expected);
  });

  it('returns zero immediately when a draggable has no elements[0]', () => {
    const zone = createZone({
      acceptedNumber: 1,
    });
    const missingElement = createDraggable({
      elements: [],
      id: 1,
    });

    expect(zone.results([missingElement], [[1]])).toBe(0);
    expect(zone.getCompletedStatus()).toBe(false);
  });
});
