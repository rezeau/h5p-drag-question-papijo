/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Returns a curried version of a function
 *
 * @param {function} fn
 *
 * @public
 *
 * @return {function}
 */
var curry = exports.curry = function curry(fn) {
  var arity = fn.length;

  return function f1() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= arity) {
      return fn.apply(null, args);
    } else {
      return function f2() {
        var args2 = Array.prototype.slice.call(arguments, 0);
        return f1.apply(null, args.concat(args2));
      };
    }
  };
};

/**
 * Compose functions together, executing from right to left
 *
 * @param {function...} fns
 *
 * @function
 * @public
 *
 * @return {function}
 */
var compose = exports.compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(function (f, g) {
    return function () {
      return f(g.apply(undefined, arguments));
    };
  });
};

/**
 * Applies a function to each element in an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var forEach = exports.forEach = curry(function (fn, arr) {
  arr.forEach(fn);
});

/**
 * Maps a function to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var map = exports.map = curry(function (fn, arr) {
  return arr.map(fn);
});

/**
 * Applies a filter to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var filter = exports.filter = curry(function (fn, arr) {
  return arr.filter(fn);
});

/**
 * Applies a some to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var some = exports.some = curry(function (fn, arr) {
  return arr.some(fn);
});

/**
 * Returns true if an array contains a value
 *
 * @param {*} value
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var contains = exports.contains = curry(function (value, arr) {
  return arr.indexOf(value) != -1;
});

/**
 * Returns an array without the supplied values
 *
 * @param {Array} values
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
var without = exports.without = curry(function (values, arr) {
  return filter(function (value) {
    return !contains(value, values);
  }, arr);
});

/**
 * Takes a string that is either 'true' or 'false' and returns the opposite
 *
 * @param {string} bool
 *
 * @public
 * @return {string}
 */
var inverseBooleanString = exports.inverseBooleanString = function inverseBooleanString(bool) {
  return (bool !== 'true').toString();
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.toggleClass = exports.toggleVisibility = exports.show = exports.hide = exports.removeClass = exports.addClass = exports.classListContains = exports.removeChild = exports.querySelectorAll = exports.nodeListToArray = exports.querySelector = exports.appendChild = exports.toggleAttribute = exports.attributeEquals = exports.hasAttribute = exports.removeAttribute = exports.setAttribute = exports.getAttribute = undefined;

var _functional = __webpack_require__(0);

/**
 * Get an attribute value from element
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 * @return {string}
 */
var getAttribute = exports.getAttribute = (0, _functional.curry)(function (name, el) {
  return el.getAttribute(name);
});

/**
 * Set an attribute on a html element
 *
 * @param {string} name
 * @param {string} value
 * @param {HTMLElement} el
 *
 * @function
 */
var setAttribute = exports.setAttribute = (0, _functional.curry)(function (name, value, el) {
  return el.setAttribute(name, value);
});

/**
 * Remove attribute from html element
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 */
var removeAttribute = exports.removeAttribute = (0, _functional.curry)(function (name, el) {
  return el.removeAttribute(name);
});

/**
 * Check if element has an attribute
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 * @return {boolean}
 */
var hasAttribute = exports.hasAttribute = (0, _functional.curry)(function (name, el) {
  return el.hasAttribute(name);
});

/**
 * Check if element has an attribute that equals
 *
 * @param {string} name
 * @param {string} value
 * @param {HTMLElement} el
 *
 * @function
 * @return {boolean}
 */
var attributeEquals = exports.attributeEquals = (0, _functional.curry)(function (name, value, el) {
  return el.getAttribute(name) === value;
});

/**
 * Toggles an attribute between 'true' and 'false';
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 */
var toggleAttribute = exports.toggleAttribute = (0, _functional.curry)(function (name, el) {
  var value = getAttribute(name, el);
  setAttribute(name, (0, _functional.inverseBooleanString)(value), el);
});

/**
 * The appendChild() method adds a node to the end of the list of children of a specified parent node.
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 *
 * @function
 * @return {HTMLElement}
 */
var appendChild = exports.appendChild = (0, _functional.curry)(function (parent, child) {
  return parent.appendChild(child);
});

/**
 * Returns the first element that is a descendant of the element on which it is invoked
 * that matches the specified group of selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {HTMLElement}
 */
var querySelector = exports.querySelector = (0, _functional.curry)(function (selector, el) {
  return el.querySelector(selector);
});

/**
 * Transforms a NodeList to an Array
 *
 * @param {NodeList} nodeList
 *
 * @return {Node[]}
 */
var nodeListToArray = exports.nodeListToArray = function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};

/**
 * Returns a non-live NodeList of all elements descended from the element on which it
 * is invoked that matches the specified group of CSS selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {Node[]}
 */
var querySelectorAll = exports.querySelectorAll = (0, _functional.curry)(function (selector, el) {
  return nodeListToArray(el.querySelectorAll(selector));
});

/**
 * The removeChild() method removes a child node from the DOM. Returns removed node.
 *
 * @param {Node} parent
 * @param {Node} oldChild
 *
 * @return {Node}
 */
var removeChild = exports.removeChild = (0, _functional.curry)(function (parent, oldChild) {
  return parent.removeChild(oldChild);
});

/**
 * Returns true if a node has a class
 *
 * @param {string} cls
 * @param {HTMLElement} el
 *
 * @function
 */
var classListContains = exports.classListContains = (0, _functional.curry)(function (cls, el) {
  return el.classList.contains(cls);
});

/**
 * Adds a css class to an element
 *
 * @param {string} cls
 * @param {Element} element
 *
 * @function
 */
var addClass = exports.addClass = (0, _functional.curry)(function (cls, element) {
  return element.classList.add(cls);
});

/**
 * Removes a css class from an element
 *
 * @param {string} cls
 * @param {Element} element
 *
 * @function
 */
var removeClass = exports.removeClass = (0, _functional.curry)(function (cls, element) {
  return element.classList.remove(cls);
});

/**
 * Adds hidden class on an element
 *
 * @param {HTMLElement} element
 * @function
 */
var hide = exports.hide = addClass('hidden');

/**
 * Removes hidden class from an element
 * @function
 */
var show = exports.show = removeClass('hidden');

/**
 * Toggles hidden class on an element
 *
 * @param {boolean} visible
 * @param {HTMLElement} element
 */
var toggleVisibility = exports.toggleVisibility = (0, _functional.curry)(function (visible, element) {
  return (visible ? show : hide)(element);
});

/**
 * Toggles a class on an element
 *
 * @param {string} cls
 * @param {boolean} add
 * @param {HTMLElement} element
 */
var toggleClass = exports.toggleClass = (0, _functional.curry)(function (cls, add, element) {
  element.classList[add ? 'add' : 'remove'](cls);
});

/**
 * Helper for creating a DOM element
 *
 * @function
 *
 * @param {string} tag
 * @param {string} [id]
 * @param {string[]} [classes] - array of strings
 * @param {Object} [attributes]
 *
 * @return {HTMLElement}
 */
var createElement = exports.createElement = function createElement(_ref) {
  var tag = _ref.tag,
      id = _ref.id,
      classes = _ref.classes,
      attributes = _ref.attributes;

  var element = document.createElement(tag);

  if (id) {
    element.id = id;
  }
  if (classes) {
    classes.forEach(function (clazz) {
      element.classList.add(clazz);
    });
  }
  if (attributes) {
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
  }

  return element;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragUtils = function () {
  function DragUtils() {
    _classCallCheck(this, DragUtils);
  }

  _createClass(DragUtils, null, [{
    key: 'setElementOpacity',


    /**
     * Makes element background transparent.
     *
     * @param {jQuery} $element
     * @param {Number} opacity
     */
    value: function setElementOpacity($element, opacity) {
      DragUtils.setOpacity($element, 'borderColor', opacity);
      DragUtils.setOpacity($element, 'boxShadow', opacity);
      DragUtils.setOpacity($element, 'background', opacity);
    }

    /**
     * Makes element background, border and shadow transparent.
     *
     * @param {jQuery} $element
     * @param {String} property
     * @param {Number} opacity
     */

  }, {
    key: 'setOpacity',
    value: function setOpacity($element, property, opacity) {
      if (property === 'background') {
        // Set both color and gradient.
        DragUtils.setOpacity($element, 'backgroundColor', opacity);
        DragUtils.setOpacity($element, 'backgroundImage', opacity);
        return;
      }

      opacity = opacity === undefined ? 1 : opacity / 100;

      // Private. Get css properties objects.
      function getProperties(property, value) {
        switch (property) {
          case 'borderColor':
            return {
              borderTopColor: value,
              borderRightColor: value,
              borderBottomColor: value,
              borderLeftColor: value
            };

          default:
            var properties = {};
            properties[property] = value;
            return properties;
        }
      }

      var original = $element.css(property);

      // Reset css to be sure we're using CSS and not inline values.
      var properties = getProperties(property, '');
      $element.css(properties);

      // Determine prop and assume all props are the same and use the first.
      for (var prop in properties) {
        break;
      }

      // Get value from css
      var style = $element.css(prop);
      if (style === '' || style === 'none') {
        // No value from CSS, fall back to original
        style = original;
      }

      style = DragUtils.setAlphas(style, 'rgba(', opacity); // Update rgba
      style = DragUtils.setAlphas(style, 'rgb(', opacity); // Convert rgb

      $element.css(getProperties(property, style));
    }

    /**
     * Updates alpha channel for colors in the given style.
     *
     * @param {String} style
     * @param {String} prefix
     * @param {Number} alpha
     */

  }, {
    key: 'setAlphas',
    value: function setAlphas(style, prefix, alpha) {
      // Style undefined
      if (!style) {
        return;
      }
      var colorStart = style.indexOf(prefix);

      while (colorStart !== -1) {
        var colorEnd = style.indexOf(')', colorStart);
        var channels = style.substring(colorStart + prefix.length, colorEnd).split(',');

        // Set alpha channel
        channels[3] = channels[3] !== undefined ? parseFloat(channels[3]) * alpha : alpha;

        style = style.substring(0, colorStart) + 'rgba(' + channels.join(',') + style.substring(colorEnd, style.length);

        // Look for more colors
        colorStart = style.indexOf(prefix, colorEnd);
      }

      return style;
    }

    /**
     * Find draggable instance from element
     *
     * @private
     * @param {Draggable[]} draggables
     * @param {Element} element
     */

  }, {
    key: 'elementToDraggable',
    value: function elementToDraggable(draggables, element) {
      for (var i = 0; i < draggables.length; i++) {
        if (!draggables[i]) {
          continue;
        }
        var result = draggables[i].findElement(element);
        if (result) {
          result.draggable = draggables[i];
          return result;
        }
      }
    }

    /**
     * Find draggable instance from element
     *
     * @private
     * @param {DropZone[]} dropZones
     * @param {Element} element
     */

  }, {
    key: 'elementToDropZone',
    value: function elementToDropZone(dropZones, element) {
      for (var i = 0; i < dropZones.length; i++) {
        if (dropZones[i].$dropZone.is(element)) {
          return dropZones[i];
        }
      }
    }

    /**
     * Get css position in percentage.
     *
     * @param {jQuery} $container
     * @param {jQuery} $element
     * @returns {Object} CSS position
     */

  }, {
    key: 'positionToPercentage',
    value: function positionToPercentage($container, $element) {
      return {
        top: parseInt($element.css('top')) * 100 / $container.innerHeight() + '%',
        left: parseInt($element.css('left')) * 100 / $container.innerWidth() + '%'
      };
    }

    /**
     * Makes sure element gets correct opacity when hovered.
     *
     * @param {jQuery} $element
     * @param {Object} element
     */

  }, {
    key: 'addHover',
    value: function addHover($element, backgroundOpacity) {
      $element.hover(function () {
        $element.addClass('h5p-draggable-hover');
        if (!$element.parent().hasClass('h5p-dragging')) {
          DragUtils.setElementOpacity($element, backgroundOpacity);
        }
      }, function () {
        if (!$element.parent().hasClass('h5p-dragging')) {
          setTimeout(function () {
            $element.removeClass('h5p-draggable-hover');
            DragUtils.setElementOpacity($element, backgroundOpacity);
          }, 1);
        }
      });
      DragUtils.setElementOpacity($element, backgroundOpacity);
    }

    /**
     * Stripping away html tags
     *
     * @param {string} html
     * @return {string}
     */

  }, {
    key: 'strip',
    value: function strip(html) {
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
  }]);

  return DragUtils;
}();

exports.default = DragUtils;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _controls = __webpack_require__(4);

var _controls2 = _interopRequireDefault(_controls);

var _drag = __webpack_require__(6);

var _drag2 = _interopRequireDefault(_drag);

var _drop = __webpack_require__(7);

var _drop2 = _interopRequireDefault(_drop);

var _keyboard = __webpack_require__(8);

var _keyboard2 = _interopRequireDefault(_keyboard);

var _dragUtils = __webpack_require__(2);

var _dragUtils2 = _interopRequireDefault(_dragUtils);

var _dropzone = __webpack_require__(9);

var _dropzone2 = _interopRequireDefault(_dropzone);

var _draggable2 = __webpack_require__(10);

var _draggable3 = _interopRequireDefault(_draggable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = H5P.jQuery;
var numInstances = 0;

/**
 * Constructor
 *
 * @class
 * @extends H5P.Question
 * @param {Object} options Run parameters
 * @param {number} id Content identification
 * @param {Object} contentData
 */
function C(options, contentId, contentData) {
  var self = this;
  var i, j;
  numInstances++;
  this.id = this.contentId = contentId;
  H5P.Question.call(self, 'dragquestion');
  this.options = $.extend(true, {}, {
    scoreShow: 'Check',
    tryAgain: 'Retry',
    showSolutionButton: "Show solution",
    grabbablePrefix: 'Grabbable {num} of {total}.',
    grabbableSuffix: 'Placed in dropzone {num}.',
    dropzonePrefix: 'Dropzone {num} of {total}.',
    noDropzone: 'No dropzone',
    tipLabel: 'Show tip.',
    tipAvailable: 'Tip available',
    correctAnswer: 'Correct answer',
    wrongAnswer: 'Wrong answer',
    feedbackHeader: 'Feedback',
    scoreBarLabel: 'You got :num out of :total points',
    scoreExplanationButtonLabel: 'Show score explanation',
    displaySolutionDescription: "Task is updated to contain the solution.",
    noInput: "Please answer before viewing the solution",
    question: {
      settings: {
        questionTitle: 'Drag and drop',
        showTitle: true,
        size: {
          width: 620,
          height: 310
        }
      },
      task: {
        elements: [],
        dropZones: []
      }
    },
    overallFeedback: [],
    behaviour: {
      enableRetry: true,
      enableSolutionButton: false,
      enableCheckButton: true,
      preventResize: false,
      singlePoint: false,
      showSolutionsRequiresInput: true,
      removeCorrectWrongStyles: false,
      applyPenalties: true,
      enableScoreExplanation: true,
      dropZoneHighlighting: 'dragging',
      autoAlignSpacing: 2,
      showScorePoints: true,
      showScoreInline: false,
      keepCorrectAnswers: false,
      randomizeDraggables: false,
      resetSingleDraggables: false,
      enableDroppedQuantity: false
    }
  }, options);

  // If single point is enabled, it makes no sense displaying
  // the score explanation. Note: In the editor, the score explanation is hidden
  // by the showWhen widget if singlePoint is enabled
  if (this.options.behaviour.singlePoint) {
    this.options.behaviour.enableScoreExplanation = false;
  }

  this.draggables = [];
  this.dropZones = [];
  this.nbDraggables = []; // Used by enableDroppedQuantity option.
  this.nbPlacedDraggables = []; // Used by enableDroppedQuantity option.
  // Initialize these arrays.
  var task = this.options.question.task;
  for (i = 0; i < task.dropZones.length; i++) {
    var dropZone = task.dropZones[i];
    this.nbDraggables[i] = 0;
    this.nbPlacedDraggables[i] = 0;
  }
  this.answered = contentData && contentData.previousState !== undefined && contentData.previousState.answers !== undefined && contentData.previousState.answers.length;
  this.hasSavedState = this.answered;
  this.blankIsCorrect = true;
  this.backgroundOpacity = this.options.behaviour.backgroundOpacity === undefined || this.options.behaviour.backgroundOpacity === '' ? undefined : this.options.behaviour.backgroundOpacity;
  this.backgroundColor = this.options.question.settings.backgroundColor === "rgba(255, 255, 255, 0)" ? undefined : this.options.question.settings.backgroundColor;
  this.backgroundOpacityDropZones = this.options.behaviour.backgroundOpacityDropZones === undefined || this.options.behaviour.backgroundOpacityDropZones === '' ? undefined : this.options.behaviour.backgroundOpacityDropZones;
  this.overrideBorderColor = this.options.behaviour.overrideBorderColor === "rgba(0, 0, 0, 0)" ? undefined : this.options.behaviour.overrideBorderColor;
  this.dropZonesBackgroundColor = this.options.behaviour.dropZonesBackgroundColor === undefined ? "rgb(245, 245, 245)" : this.options.behaviour.dropZonesBackgroundColor;

  // Used in contracts (by showsolutions)
  this.solutionViewed = false;
  this.answerChecked = false;
  this.scoreViewed = false;
  this.maxScoreReached = false;

  self.$noDropZone = $('<div class="h5p-dq-no-dz" role="button" style="display:none;"><span class="h5p-hidden-read">' + self.options.noDropzone + '</span></div>');

  // Initialize controls for good a11y
  var controls = getControls(self.draggables, self.dropZones, self.$noDropZone[0]);

  /**
   * Update the drop effect for all drop zones accepting this draggable.
   *
   * @private
   * @param {string} effect
   */
  var setDropEffect = function setDropEffect(effect) {
    for (var i = 0; i < controls.drop.elements.length; i++) {
      controls.drop.elements[i].setAttribute('aria-dropeffect', effect);
    }
  };

  // List of drop zones that has no elements, i.e. not used for the task
  var dropZonesWithoutElements = [];

  // Create map over correct drop zones for elements
  var task = this.options.question.task;
  this.correctDZs = [];
  for (i = 0; i < task.dropZones.length; i++) {
    dropZonesWithoutElements.push(true); // All true by default
    var correctElements = task.dropZones[i].correctElements;
    var acceptedNumber = task.dropZones[i].acceptedNumber;
    for (j = 0; j < correctElements.length; j++) {
      var correctElement = correctElements[j];
      if (this.correctDZs[correctElement] === undefined) {
        this.correctDZs[correctElement] = [];
      }
      this.correctDZs[correctElement].push(i);
    }
    if (this.overrideBorderColor !== undefined) {
      task.dropZones[i].bordercolor = this.overrideBorderColor;
    }
    task.dropZones[i].background = this.dropZonesBackgroundColor;
  }

  this.weight = 1;

  // Add draggable elements JR

  var grabbablel10n = {
    prefix: self.options.grabbablePrefix.replace('{total}', task.elements.length),
    suffix: self.options.grabbableSuffix,
    correctAnswer: self.options.correctAnswer,
    wrongAnswer: self.options.wrongAnswer
  };

  for (i = 0; i < task.elements.length; i++) {
    var element = task.elements[i];
    // Just in case a draggable was created multiple BEFORE enableDroppedQuantity was set. 
    if (this.options.behaviour.enableDroppedQuantity) {
      element.multiple = false;
    }

    if (element.dropZones === undefined || !element.dropZones.length) {
      continue; // Not a draggable
    }

    if (this.backgroundOpacity !== undefined) {
      element.backgroundOpacity = this.backgroundOpacity;
    }

    // Restore answers from last session
    var answers = null;
    if (contentData && contentData.previousState !== undefined && contentData.previousState.answers !== undefined && contentData.previousState.answers[i] !== undefined) {
      answers = contentData.previousState.answers[i];
    }

    // Create new draggable instance
    var draggable = new _draggable3.default(element, i, answers, grabbablel10n);
    var highlightDropZones = self.options.behaviour.dropZoneHighlighting === 'dragging';
    draggable.on('elementadd', function (event) {
      controls.drag.addElement(event.data);
    });
    draggable.on('elementremove', function (event) {
      controls.drag.removeElement(event.data);
      if (event.data.getAttribute('aria-grabbed') === 'true') {
        controls.drag.firesEvent('select', event.data);
        event.data.removeAttribute('aria-grabbed');
      }
    });
    draggable.on('focus', function (event) {
      controls.drag.setTabbable(event.data);
      event.data.focus();
    });
    draggable.on('dragstart', function (event) {
      if (highlightDropZones) {
        self.$container.addClass('h5p-dq-highlight-dz');
      }
      setDropEffect(event.data);
    });
    draggable.on('dragend', function () {
      if (highlightDropZones) {
        self.$container.removeClass('h5p-dq-highlight-dz');
      }
      setDropEffect('none');
    });
    draggable.on('interacted', function () {
      self.answered = true;
      self.triggerXAPIScored(self.getScore(), self.getMaxScore(), 'interacted');
    });
    draggable.on('leavingDropZone', function (event) {
      self.dropZones[event.data.dropZone].removeAlignable(event.data.$);
    });

    this.draggables[i] = draggable;

    for (j = 0; j < element.dropZones.length; j++) {
      dropZonesWithoutElements[element.dropZones[j]] = false;
    }
  }

  // Create map over correct draggables for dropzones (if enableDroppedQuantity)                
  if (this.options.behaviour.enableDroppedQuantity) {
    this.correctDraggables = [];
    for (i = 0; i < task.dropZones.length; i++) {
      this.correctDraggables[i] = [];
      for (j = 0; j < this.correctDZs.length; j++) {
        if (this.correctDZs[j] == undefined) {
          continue;
        }
        var dragOkDZ = $.inArray(i, this.correctDZs[j]);
        if (dragOkDZ !== -1) {
          this.correctDraggables[i].push(j);
        }
      }
    }
  }

  // Create a count to subtrack from score
  this.numDropZonesWithoutElements = 0;

  var dropzonel10n = {
    prefix: self.options.dropzonePrefix.replace('{total}', task.dropZones.length),
    tipLabel: self.options.tipLabel,
    tipAvailable: self.options.tipAvailable
  };

  // Add drop zones
  for (i = 0; i < task.dropZones.length; i++) {
    var dropZone = task.dropZones[i];

    if (dropZonesWithoutElements[i] === true) {
      this.numDropZonesWithoutElements += 1;
    }

    if (this.blankIsCorrect && dropZone.correctElements.length) {
      this.blankIsCorrect = false;
    }

    if (this.backgroundOpacityDropZones !== undefined) {
      dropZone.backgroundOpacity = this.backgroundOpacityDropZones;
    }

    dropZone.resetSingleDraggables = this.options.behaviour.resetSingleDraggables;

    dropZone.autoAlign = {
      enabled: dropZone.autoAlign,
      spacing: self.options.behaviour.autoAlignSpacing,
      size: self.options.question.settings.size
    };

    this.dropZones[i] = new _dropzone2.default(dropZone, i, dropzonel10n);

    // Update element internal position when aligned
    this.dropZones[i].on('elementaligned', function (event) {
      var $aligned = event.data;

      for (var _i = 0; _i < self.draggables.length; _i++) {
        var _draggable = self.draggables[_i];
        if (!_draggable || !_draggable.elements || !_draggable.elements.length) {
          continue;
        }

        for (var _j = 0; _j < _draggable.elements.length; _j++) {
          var _element = _draggable.elements[_j];
          if (!_element || _element.$[0] !== $aligned[0]) {
            continue;
          }

          // Update position
          _element.position = _dragUtils2.default.positionToPercentage(self.$container, _element.$);
          return;
        }
      }
    });
  }

  this.on('resize', self.resize, self);
  this.on('domChanged', function (event) {
    if (self.contentId === event.data.contentId) {
      self.trigger('resize');
    }
  });

  this.on('enterFullScreen', function () {
    if (self.$container) {
      self.$container.parents('.h5p-content').css('height', '100%');
      self.trigger('resize');
    }
  });

  this.on('exitFullScreen', function () {
    if (self.$container) {
      self.$container.parents('.h5p-content').css('height', 'auto');
      self.trigger('resize');
    }
  });
}

C.prototype = Object.create(H5P.Question.prototype);
C.prototype.constructor = C;

/**
 * Registers this question type's DOM elements before they are attached.
 * Called from H5P.Question.
 */
C.prototype.registerDomElements = function () {
  var self = this;

  // Register introduction section
  if (self.options.question.settings.showTitle) {
    self.$introduction = $('<p class="h5p-dragquestion-introduction" id="dq-intro-' + numInstances + '">' + self.options.question.settings.questionTitle + '</p>');
    self.setIntroduction(self.$introduction);
  }

  // Set class if no background
  var classes = '';
  if (this.options.question.settings.background !== undefined) {
    classes += 'h5p-dragquestion-has-no-background';
  }
  if (self.options.behaviour.dropZoneHighlighting === 'always') {
    if (classes) {
      classes += ' ';
    }
    classes += 'h5p-dq-highlight-dz-always';
  }

  // Register task content area
  self.setContent(self.createQuestionContent(), {
    'class': classes
  });

  // First we check if full screen is supported
  if (H5P.canHasFullScreen !== false && this.options.behaviour.enableFullScreen) {

    // We create a function that is used to enter or
    // exit full screen when our button is pressed
    var toggleFullScreen = function toggleFullScreen() {
      if (H5P.isFullscreen) {
        H5P.exitFullScreen(self.$container);
      } else {
        H5P.fullScreen(self.$container.parent().parent(), self);
      }
    };

    // Create full screen button
    var $fullScreenButton = $('<div/>', {
      'class': 'h5p-my-fullscreen-button-enter',
      title: this.options.localize.fullscreen,
      role: 'button',
      tabindex: 0,
      on: {
        click: toggleFullScreen,
        keypress: function keypress(event) {
          if (event.which === 13 || event.which === 32) {
            toggleFullScreen();
            event.preventDefault();
          }
        }
      },
      prependTo: this.$container.parent()
    });

    // Respond to enter full screen event
    this.on('enterFullScreen', function () {
      $fullScreenButton.attr('class', 'h5p-my-fullscreen-button-exit');
      $fullScreenButton.attr('title', this.options.localize.exitFullscreen);
    });

    // Respond to exit full screen event
    this.on('exitFullScreen', function () {
      $fullScreenButton.attr('class', 'h5p-my-fullscreen-button-enter');
      $fullScreenButton.attr('title', this.options.localize.fullscreen);
    });
  }

  // ... and buttons
  self.registerButtons();

  setTimeout(function () {
    self.trigger('resize');
  }, 200);
};

/**
 * Get xAPI data.
 * Contract used by report rendering engine.
 *
 * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
 *
 * @return {Object} xAPI data
 */
C.prototype.getXAPIData = function () {
  var xAPIEvent = this.createXAPIEventTemplate('answered');
  this.addQuestionToXAPI(xAPIEvent);
  this.addResponseToXAPI(xAPIEvent);
  return {
    statement: xAPIEvent.data.statement
  };
};

/**
 * Add the question itselt to the definition part of an xAPIEvent
 */
C.prototype.addQuestionToXAPI = function (xAPIEvent) {
  var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
  $.extend(definition, this.getXAPIDefinition());
};

/**
 * Get object definition for xAPI statement.
 *
 * @return {Object} xAPI object definition
 */
C.prototype.getXAPIDefinition = function () {
  var definition = {};
  definition.description = {
    // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
    'en-US': $('<div>' + this.options.question.settings.questionTitle + '</div>').text()
  };
  definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
  definition.interactionType = 'matching';

  // Add sources, i.e. draggables
  definition.source = [];
  for (var i = 0; i < this.options.question.task.elements.length; i++) {
    var el = this.options.question.task.elements[i];
    if (el.dropZones && el.dropZones.length) {
      var desc = el.type.params.alt ? el.type.params.alt : el.type.params.text;

      definition.source.push({
        'id': '' + i,
        'description': {
          // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
          'en-US': $('<div>' + desc + '</div>').text()
        }
      });
    }
  }

  // Add targets, i.e. drop zones, and the correct response pattern.
  definition.correctResponsesPattern = [''];
  definition.target = [];
  var firstCorrectPair = true;
  for (i = 0; i < this.options.question.task.dropZones.length; i++) {
    definition.target.push({
      'id': '' + i,
      'description': {
        // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
        'en-US': $('<div>' + this.options.question.task.dropZones[i].label + '</div>').text()
      }
    });
    if (this.options.question.task.dropZones[i].correctElements) {
      for (var j = 0; j < this.options.question.task.dropZones[i].correctElements.length; j++) {
        if (!firstCorrectPair) {
          definition.correctResponsesPattern[0] += '[,]';
        }
        definition.correctResponsesPattern[0] += i + '[.]' + this.options.question.task.dropZones[i].correctElements[j];
        firstCorrectPair = false;
      }
    }
  }

  return definition;
};

/**
 * Add the response part to an xAPI event
 *
 * @param {H5P.XAPIEvent} xAPIEvent
 *  The xAPI event we will add a response to
 */
C.prototype.addResponseToXAPI = function (xAPIEvent) {
  var maxScore = this.getMaxScore();
  var score = this.getScore();
  var success = score == maxScore ? true : false;
  xAPIEvent.setScoredResult(score, maxScore, this, true, success);
  xAPIEvent.data.statement.result.response = this.getUserXAPIResponse();
};

/**
 * Get what the user has answered encoded as an xAPI response pattern
 *
 * @return {string} xAPI encoded user response pattern
 */
C.prototype.getUserXAPIResponse = function () {
  var answers = this.getUserAnswers();
  if (!answers) {
    return '';
  }

  return answers.filter(function (answerMapping) {
    return answerMapping.elements.length;
  }).map(function (answerMapping, index) {
    return answerMapping.elements.filter(function (element) {
      return element.dropZone !== undefined;
    }).map(function (element) {
      return element.dropZone + '[.]' + index;
    }).join('[,]');
  }).filter(function (pattern) {
    return pattern !== undefined && pattern !== '';
  }).join('[,]');
};

/**
 * Returns user answers
 */
C.prototype.getUserAnswers = function () {
  return this.draggables.map(function (draggable, index) {
    return {
      index: index,
      draggable: draggable
    };
  }).filter(function (draggableMapping) {
    return draggableMapping.draggable !== undefined && draggableMapping.draggable.elements;
  }).map(function (draggableMapping) {
    return {
      index: draggableMapping.index,
      elements: draggableMapping.draggable.elements
    };
  });
};

/**
 * Append field to wrapper.
 */
C.prototype.createQuestionContent = function () {
  var i;
  // If reattaching, we no longer show solution. So forget that we
  // might have done so before.

  this.$container = $('<div class="h5p-inner" role="application" aria-labelledby="dq-intro-' + numInstances + '"></div>');
  if (this.options.question.settings.background !== undefined) {
    this.$container.css('backgroundImage', 'url("' + H5P.getPath(this.options.question.settings.background.path, this.id) + '")');
  } else if (this.backgroundColor !== undefined) {
    this.$container.css('background-color', this.backgroundColor);
  }

  var task = this.options.question.task;

  // Add elements (static and draggable)
  for (i = 0; i < task.elements.length; i++) {
    var element = task.elements[i];

    if (element.dropZones !== undefined && element.dropZones.length !== 0) {
      // Attach draggable elements
      this.draggables[i].appendTo(this.$container, this.id);
    } else {
      // Add static element
      var $element = this.addElement(element, 'static', i);
      H5P.newRunnable(element.type, this.id, $element);

      // Override image hover and use user defined hover text or none.
      if (element.type.library.indexOf('H5P.Image ') === 0) {
        $element.find('img').attr('title', element.type.params.title || '');
      }

      var timedOutOpacity = function timedOutOpacity($el, el) {
        setTimeout(function () {
          _dragUtils2.default.setOpacity($el, 'background', el.backgroundOpacity);
        }, 0);
      };
      timedOutOpacity($element, element);
    }
  }

  // Attach invisible 'reset' drop zone for keyboard users
  this.$noDropZone.appendTo(this.$container);

  // Attach drop zones
  for (i = 0; i < this.dropZones.length; i++) {
    this.dropZones[i].appendTo(this.$container, this.draggables);
  }
  return this.$container;
};

C.prototype.registerButtons = function () {
  if (this.options.behaviour.enableCheckButton) {
    // Add show score button
    this.addSolutionButton();
  }
  this.addRetryButton();
  if (this.oneDropzonesHasCorrectElement()) {
    this.addShowSolutionButton();
    if (this.options.behaviour.randomizeDraggables) {
      this.reTry();
    };
  };
};

/**
 * Add solution button to our container.
 */
C.prototype.addSolutionButton = function () {
  var that = this;

  this.addButton('check-answer', this.options.scoreShow, function () {
    that.answerChecked = true;
    that.showAllSolutions();
    that.showScore();
    that.addExplanation();
    // Just in case question-explanation has been hidden by showsolution
    $('.h5p-question-explanation').show();
    var xAPIEvent = that.createXAPIEventTemplate('answered');
    that.addQuestionToXAPI(xAPIEvent);
    that.addResponseToXAPI(xAPIEvent);
    that.trigger(xAPIEvent);
    if (that.options.behaviour.removeCorrectWrongStyles && that.maxScoreReached) {
      that.draggables.forEach(function (draggable) {
        draggable.elements.forEach(function (element) {
          if (element.$.hasClass('h5p-correct')) {
            element.$.removeClass('h5p-correct');
          };
          if (element.$suffix) {
            element.$suffix.remove();
          }
        });
      });
    }
    // Focus top of task for better focus and read-speaker flow
    var $nextFocus = that.$introduction ? that.$introduction : that.$container.children().first();
    $nextFocus.focus();
  });
};

/**
 * Add explanation/feedback (the part on the bottom part)
 */
C.prototype.addExplanation = function () {
  var _this = this;

  var task = this.options.question.task;

  var explanations = [];

  // Go through all dropzones, and find answers:
  task.dropZones.forEach(function (dropZone, dropZoneId) {
    var feedback = {
      correct: dropZone.tipsAndFeedback.feedbackOnCorrect,
      incorrect: dropZone.tipsAndFeedback.feedbackOnIncorrect
    };
    // Don't run this code if feedback is not configured;
    if (feedback.correct === undefined && feedback.incorrect === undefined) {
      return;
    }

    // Index for correct draggables
    var correctElements = dropZone.correctElements;

    // Find all dragables placed on this dropzone:
    var placedDraggables = {};
    _this.draggables.forEach(function (draggable) {
      draggable.elements.forEach(function (dz) {
        if (dz.dropZone == dropZoneId) {
          // Save reference to draggable, and mark it as correct/incorrect
          placedDraggables[draggable.id] = {
            instance: draggable,
            correct: correctElements.indexOf("" + draggable.id) !== -1
          };
        }
      });
    });

    // Go through each placed draggable
    Object.keys(placedDraggables).forEach(function (draggableId) {
      var draggable = placedDraggables[draggableId];
      var draggableLabel = _dragUtils2.default.strip(draggable.instance.type.params.alt || draggable.instance.type.params.text) || '?';
      var dropZoneLabel = _dragUtils2.default.strip(dropZone.label);

      if (draggable.correct && feedback.correct) {
        explanations.push({
          correct: dropZoneLabel + ' + ' + draggableLabel,
          text: feedback.correct
        });

        draggable.instance.setFeedback(feedback.correct, dropZoneId);
      } else if (!draggable.correct && feedback.incorrect) {
        explanations.push({
          correct: dropZoneLabel + ' + ',
          wrong: draggableLabel,
          text: feedback.incorrect
        });

        draggable.instance.setFeedback(feedback.incorrect, dropZoneId);
      }
    });
  });

  if (explanations.length !== 0) {
    this.setExplanation(explanations, this.options.feedbackHeader);
  }
};

/**
 * Add retry button to our container.
 */
C.prototype.addRetryButton = function () {
  var that = this;

  this.addButton('try-again', this.options.tryAgain, function () {
    var forceReset = false;
    if (that.solutionViewed) {
      forceReset = true;
      that.solutionViewed = false;
    };

    if (that.maxScoreReached) {
      forceReset = true;
      that.maxScoreReached = false;
    };

    that.reTry(forceReset);
    that.showButton('check-answer');
    that.hideButton('try-again');
    that.hideButton('show-solution');
  }, false);
};
/**
* Determine if all of the draggables has been dropped somewhere.
* Show solution will only be allowed if that is true.
*
* @return {boolean}
*/
C.prototype.isAnswerSelected = function () {
  var selected = this.$container.find('.h5p-dropped').length >= this.draggables.length;
  return selected;
};

/**
 * Determine if at least one dropzone has at least one correct draggable element.
 *
 * @return {boolean}
 */
C.prototype.oneDropzonesHasCorrectElement = function () {
  var task = this.options.question.task;
  for (var i = 0; i < task.dropZones.length; i++) {
    if (task.dropZones[i].correctElements.length !== 0) {
      //alert('FALSE');
      return true;
    }
  }
  //alert('TRUE');
  return false;
};

/**
 * Add show solution button to our container.
 */
C.prototype.addShowSolutionButton = function () {
  var that = this;
  this.addButton('show-solution', this.options.showSolutionButton, function () {
    if (that.options.behaviour.showSolutionsRequiresInput && !that.isAnswerSelected()) {
      // Require answer before solution can be viewed
      that.updateFeedbackContent(that.options.noInput);
      that.read(that.options.noInput);
      that.hideButton('show-solution');
      return;
    }
    that.showSolution();
    that.hideButton('check-answer');
    that.hideButton('show-solution');
    that.showButton('try-again');
    that.read(that.options.displaySolutionDescription);
  }, false);
};

/**
 * Add element/drop zone to task.
 *
 * @param {Object} element
 * @param {String} type Class
 * @param {Number} id
 * @returns {jQuery}
 */
C.prototype.addElement = function (element, type, id) {
  return $('<div class="h5p-' + type + '" style="left:' + element.x + '%;top:' + element.y + '%;width:' + element.width + 'em;height:' + element.height + 'em"></div>').appendTo(this.$container).data('id', id);
};

/**
 * Set correct height of container
 */
C.prototype.resize = function (e) {
  var self = this;
  // Make sure we use all the height we can get. Needed to scale up.
  if (this.$container === undefined || !this.$container.is(':visible')) {
    // Not yet attached or visible – not possible to resize correctly
    return;
  }

  // Check if decreasing iframe size
  var decreaseSize = e && e.data && e.data.decreaseSize;
  if (!decreaseSize) {
    this.$container.css('height', '99999px');
    self.$container.parents('.h5p-standalone.h5p-dragquestion').css('width', '');
  }

  var size = this.options.question.settings.size;
  var ratio = size.width / size.height;
  var parentContainer = this.$container.parent();
  // Use parent container as basis for resize.
  var width = parentContainer.width() - parseFloat(parentContainer.css('margin-left')) - parseFloat(parentContainer.css('margin-right'));

  // Check if we need to apply semi full screen fix.
  var $semiFullScreen = self.$container.parents('.h5p-standalone.h5p-dragquestion.h5p-semi-fullscreen');
  if ($semiFullScreen.length) {
    // Reset semi fullscreen width
    $semiFullScreen.css('width', '');

    // Decrease iframe size
    if (!decreaseSize) {
      self.$container.css('width', '10px');
      $semiFullScreen.css('width', '');

      // Trigger changes
      setTimeout(function () {
        self.trigger('resize', { decreaseSize: true });
      }, 200);
    }

    // Set width equal to iframe parent width, since iframe content has not been update yet.
    var $iframe = $(window.frameElement);
    if ($iframe) {
      var $iframeParent = $iframe.parent();
      width = $iframeParent.width();
      $semiFullScreen.css('width', width + 'px');
    }
  }

  var height = width / ratio;

  // Set natural size if no parent width
  if (width <= 0) {
    width = size.width;
    height = size.height;
  }

  this.$container.css({
    width: width + 'px',
    height: height + 'px',
    fontSize: 16 * (width / size.width) + 'px'
  });
};

/**
 * Disables all draggables.
 * @public
 */
C.prototype.disableDraggables = function () {
  this.draggables.forEach(function (draggable) {
    draggable.disable();
  });
};

/**
 * Enables all draggables.
 * @public
 */
C.prototype.enableDraggables = function () {
  this.draggables.forEach(function (draggable) {
    draggable.enable();
  });
};

/**
 * Shows the correct solutions on the boxes and disables input and buttons depending on settings.
 * @public
 * @params {Boolean} skipVisuals Skip visual animations.
 */
C.prototype.showAllSolutions = function (skipVisuals) {
  this.points = 0;
  this.rawPoints = 0;
  this.allSolutionsViewed = true;

  // One correct point for each "no solution" dropzone if there are no solutions
  if (this.blankIsCorrect) {
    this.points = 1;
    this.rawPoints = 1;
  }

  var scorePoints;

  if (!skipVisuals && this.options.behaviour.showScorePoints && !this.options.behaviour.singlePoint && this.options.behaviour.applyPenalties) {
    scorePoints = new H5P.Question.ScorePoints();
    this.scoreInline = this.options.behaviour.showScoreInline;
  }
  this.maxScoreReached = false;

  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    //Disable all draggables in check mode.
    if (!skipVisuals) {
      draggable.disable();
    }
  }
  // Normal mode
  if (!this.options.behaviour.enableDroppedQuantity) {
    for (var i = 0; i < this.draggables.length; i++) {
      var draggable = this.draggables[i];
      if (draggable === undefined) {
        continue;
      }
      // Find out where we are.
      this.points += draggable.results(skipVisuals, this.correctDZs[i], scorePoints, this.scoreInline);
      this.rawPoints += draggable.rawPoints;
    }
  } else {
    for (var i = 0; i < this.dropZones.length; i++) {
      var dropzone = this.dropZones[i];
      this.points += dropzone.results(this.draggables, this.correctDraggables, scorePoints);
      //dev jr
      this.rawPoints += dropzone.rawPoints;
    }
  }

  if (this.points < 0) {
    this.points = 0;
  }
  if (!this.answered && this.blankIsCorrect) {
    this.points = this.weight;
  }
  if (this.options.behaviour.singlePoint) {
    this.points = this.points === this.calculateMaxScore() ? 1 : 0;
  }

  if (!skipVisuals) {
    this.hideButton('check-answer');
  }

  if (this.options.behaviour.enableRetry && !skipVisuals) {
    this.showButton('try-again');
  }

  if (this.options.behaviour.enableSolutionButton && !skipVisuals) {
    this.showButton('show-solution');
  }
  if (this.points === this.getMaxScore()) {
    this.maxScoreReached = true;
  }

  if (this.hasButton('check-answer') && (this.options.behaviour.enableRetry === false || this.points === this.getMaxScore())) {
    // Max score reached, or the user cannot try again.
    // DEV JR allow retry even after Max score reached see H5P forum at ???
    //this.hideButton('try-again');
    this.hideButton('show-solution');
  }
};

/**
 * Display the correct solutions, hides button and disables input.
 * Used in contracts.
 * @public
 */
C.prototype.showSolutions = function () {
  // TODO JR does not work quite ok in contracts

  // If the contracts showSolutions has already been viewed, do not do anything.
  if (this.solutionViewed /*&& !this.answerChecked*/) {
      return;
    }

  if (!this.answerChecked) {
    this.showAllSolutions();
  }

  if (!this.scoreViewed) {
    this.showScore();
  }

  this.showSolution();

  //Hide solution button:
  this.hideButton('check-answer');
  this.hideButton('try-again');
};

/**
 * Resets the task but keeps correct answers if required.
 * @public
 */
C.prototype.reTry = function (forceReset) {
  var _this2 = this;

  var self = this;
  var that = this;
  this.points = 0;
  this.rawPoints = 0;
  this.answered = false;

  // Used in contracts (by showsolutions)
  this.solutionViewed = false;
  this.answerChecked = false;
  this.scoreViewed = false;

  // The "h5p-question-hidden" class may need to be removed from elements.
  this.draggables.forEach(function (draggable) {
    draggable.elements.forEach(function (element) {
      if (element.$.hasClass('h5p-question-hidden')) {
        element.$.removeClass('h5p-question-hidden');
      }
    });
  });

  //Enables Draggables
  this.enableDraggables();

  // IF SHUFFLE/RANDOMIZE DRAGGABLES POSITIONS
  if (self.options.behaviour.randomizeDraggables) {

    var draggablePositions = [];
    // Put current draggables coordinates into an array (except for
    // the multiple draggables which cannot be shuffled at the moment).
    // Check that the draggable does have elements, exclude distracters.
    this.draggables.forEach(function (draggable) {
      if (draggable.elements && !draggable.multiple) {
        draggablePositions.push([draggable.x, draggable.y]);
      };
    });

    // Shuffle the array of coordinates.
    draggablePositions = H5P.shuffleArray(draggablePositions);

    var skipIt = 0;
    for (var i = 0; i < this.draggables.length; i++) {
      var draggable = this.draggables[i];
      // Do not shuffle the multiple draggables --- too complicated. Maybe later...
      if (draggable === undefined || draggable.multiple) {
        skipIt++;
        continue;
      }
      var dragId = draggable.id;
      var element = draggable.elements[0];
      // If keep correct answers and draggable is in its correct dropzone, set shuffled draggable coordinates but do not actually shuffle it.
      var shuffle = true;
      // Deal with enableDroppedQuantity option
      if (element.$.hasClass('h5p-correct') || element.$.hasClass('h5p-correct-quantity')) {
        shuffle = false;
      };
      var x = draggablePositions[i - skipIt][0];
      var y = draggablePositions[i - skipIt][1];

      draggable.shufflePosition(shuffle, x, y);
    };
  };

  //Only reset position and feedback if we are not keeping the correct answers.
  // Do not reset positions if previous state is being restored.
  // DEV JR replace this by empty dropzones that are marked as wrong...
  // OR make it an option?
  if (!this.hasSavedState) {
    if (this.options.behaviour.enableDroppedQuantity) {
      var nbCorrectDropZones = 0;
      var totalDropZones = 0;
      var task = this.options.question.task;
      task.dropZones.forEach(function (dropZone, dropZoneId) {
        if (dropZone.status !== 'none') {
          totalDropZones++;
        }
        if (dropZone.status == 'correct') {
          nbCorrectDropZones++;
        }
        var acceptedNumber = dropZone.acceptedNumber;
        if (self.options.behaviour.keepCorrectAnswers && !forceReset) {
          var nbOK = 0;
          for (var i = 0; i < _this2.draggables.length; i++) {
            var draggable = _this2.draggables[i];
            if (dropZone.status == 'correct') {
              nbOK++;
            }
          }
        }
      });
    }

    this.draggables.forEach(function (draggable) {

      if (self.options.behaviour.keepCorrectAnswers && !forceReset) {
        var dragId = draggable.id;
        var $dropZones = self.dropZones; // DOM objects
        var task = self.options.question.task;
        var element = draggable.elements[0];
        var correctClass = 'h5p-correct';
        if (self.options.behaviour.enableDroppedQuantity) {
          correctClass += '-quantity';
        }
        if (element.$.hasClass(correctClass)) {
          draggable.resetPosition(self.correctDZs[draggable.id], correctClass);
        } else {
          draggable.resetPosition();
        }
      } else {
        draggable.resetPosition();
      };
    });

    if (this.options.behaviour.enableDroppedQuantity) {
      if (nbCorrectDropZones == totalDropZones) {
        //Enables Draggables
        this.enableDraggables();
        this.draggables.forEach(function (draggable) {
          draggable.resetPosition();
        });
      }
    }
  }
  this.hasSavedState = false;
  if (this.options.behaviour.enableDroppedQuantity) {
    var $dropZones = self.dropZones; // DOM objects
    for (i = 0; i < $dropZones.length; i++) {
      $dropZones[i].unmarkResult();
    }
  }
  //Show solution button
  this.showButton('check-answer');
  this.hideButton('try-again');
  this.removeFeedback();
  this.setExplanation();
};

/**
 * Moves all draggables to their correct dropZones.
 * NOT to be confused with showSolutions (note the plural ending!) routine used by contracts.
 * MARCH 2018 by Joseph Rezeau aka "papijo"
 * @public
 */

C.prototype.showSolution = function () {
  var self = this;
  self.solutionViewed = true;
  var dropZones = self.dropZones;
  // Reset all dropzones alignables to empty. ???
  for (i = 0; i < dropZones.length; i++) {
    var dropZone = dropZones[i];
    dropZone.alignables = [];
  };

  var correctDZs = [];
  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    correctDZs[draggable.id] = this.correctDZs[i];
  }

  var mustCloneElement = [];
  var oneIsMultiple = false;

  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    var multipleDrag = [];
    if (draggable.multiple) {
      oneIsMultiple = true;
      var dragId = draggable.id;
      var correctDZ = correctDZs[dragId];
      // If this draggable is not accepted by any dropZone, do not clone it.
      if (correctDZ) {
        mustCloneElement[dragId] = correctDZ.length;

        // When using Retry after ShowSolution, we may need to remove NULL elements from draggable.elements array.
        draggable.elements = draggable.elements.filter(function (n) {
          return n != undefined;
        });

        // Needed if keepstate is ON and user has moved away and back.
        // Otherwise showSolution does not work if first dropZone is undefined.
        var element = draggable.elements[0];
        if (element.dropZone == undefined) {
          var ary = draggable.elements;
          ary.push(ary.shift());
        }

        for (var j = 0; j < draggable.elements.length; j++) {
          var element = draggable.elements[j];
          // If element is correct we need to clone one less element.
          var isCorrect = element.$.hasClass('h5p-correct');
          if (isCorrect) {
            mustCloneElement[dragId]--;
          }
        }
      }
    }
  }

  if (oneIsMultiple) {
    for (var i = 0; i < this.draggables.length; i++) {
      var draggable = this.draggables[i];
      if (draggable === undefined) {
        continue;
      }
      var dragId = draggable.id;
      if (draggable.multiple) {
        for (var j = 0; j < mustCloneElement[dragId]; j++) {
          var element = draggable.elements[j];
          if (element !== undefined) {
            element.clone();
          }
        }
      }
    }
  }

  this.draggables.forEach(function (draggable) {
    var dragId = draggable.id;
    var correctDZ = correctDZs[dragId];
    // Initialize and Copy correctDZ elements to remainingCorrectDZ array
    // in order to be able to remove the correctly placed elements later on
    // to avoid double display in dropzone.
    // TODO JR check that this is the cause for wrong solutions with multiple after using F5!

    var isMultiple = draggable.multiple;
    if (isMultiple && correctDZ) {
      var remainingCorrectDZ = [];
      for (var i = 0; i < correctDZ.length; i++) {
        remainingCorrectDZ.push(correctDZ[i]);
      };
    };

    var z = 0;
    draggable.elements.forEach(function (element) {
      // Remove display of possible +1 / -1 score suffix from element; only keep the correct check mark.
      if (element.$suffix) {
        element.$suffix.remove();
      }

      if (correctDZ) {
        // Hide away multiple elements wrongly placed.
        if (isMultiple && element.$.hasClass('h5p-wrong')) {
          element.$.addClass('h5p-question-hidden');
        }
        if (!isMultiple) {
          for (var i = 0; i < correctDZ.length; i++) {
            // JR No, because a draggable can have the dropped class even if it has been removed from its drop zone!
            //if (!element.$.hasClass('h5p-dropped')) {
            element.$.addClass('h5p-question-solution');
            //};
            var dropZone = dropZones[correctDZ[i]];
            if (dropZone !== undefined) {
              draggable.addToDropZone(0, element, dropZone.id);
              // Set position in case DZ is full (auto align doesn't work)
              element.$.css({
                left: dropZone.x + '%',
                top: dropZone.y + '%'
              });
              if (element.$.hasClass('h5p-wrong')) {
                element.$.addClass('h5p-question-solution');
              };
              // Add to alignables
              if (dropZone.getIndexOf(element.$) === -1) {
                dropZone.alignables.push(element.$);
                //dropZone.autoAlign();
              };
            };
          };
        } else {
          // If element is correctly placed, leave it there but remove it from array of remainingCorrectDZ.
          if (element.$.hasClass('h5p-correct')) {
            var index = remainingCorrectDZ.indexOf(element.dropZone);
            var elDZ = element.dropZone;
            dropZone = dropZones[elDZ];
            if (dropZone.getIndexOf(element.$) === -1) {
              dropZone.alignables.push(element.$);
            }
            //dropZone.autoAlign();
            remainingCorrectDZ.splice(index, 1);
          } else {
            // If multiple element is wrongly placed then leave it in place and continue.
            if (!element.$.hasClass('h5p-wrong')) {
              // If multiple element has not yet been dropped into any correct dropzone then move it there.
              if (!element.$.hasClass('h5p-dropped')) {
                var dropZone = dropZones[remainingCorrectDZ[z]];
                if (dropZone !== undefined) {
                  element.$.addClass('h5p-question-solution');
                  element.dropZone = dropZone.id;
                  var elClass = element.$.attr('class');
                  draggable.updatePlacement(element);
                  // Set position in case DZ is full (auto align doesn't work)
                  element.$.css({
                    left: dropZone.x + '%',
                    top: dropZone.y + '%'
                  });
                  // Add to alignables
                  if (dropZone.getIndexOf(element.$) === -1) {
                    dropZone.alignables.push(element.$);

                    //dropZone.autoAlign();
                  }
                  // Now remove element.dropzone so that this element is NOT saved to currentState.
                  element.dropZone = '';
                  z++;
                };
              }
            }
          }
        };
      } else {
        // This draggable is not accepted by any dropZone. It's a so-called "distracter".
        // If it has been dropped, hide it away.
        if (element.$.hasClass('h5p-dropped')) {
          element.$.addClass('h5p-question-hidden');
        }
      }
    });
  });

  // Hide "unused" draggables. Maybe there is a better option.
  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    for (var j = 0; j < draggable.elements.length; j++) {
      var element = draggable.elements[j];
      if (!element.$.hasClass('h5p-correct') && !element.$.hasClass('h5p-question-solution')) {
        element.$.addClass('h5p-question-hidden');
      };

      if (this.options.behaviour.removeCorrectWrongStyles) {
        element.$.removeClass('h5p-wrong').removeClass('h5p-correct');
      }
    };
  };

  // Reset all dropzones alignables to empty. WHY ???
  // Align all dropzones
  for (var i = 0; i < dropZones.length; i++) {
    var dropZone = dropZones[i];
    dropZone.autoAlign();
  }

  this.disableDraggables();

  //Show solution button
  this.showButton('try-again');
  this.hideButton('show-solution');
  // remove feedback/explanation h5p-question-explanation
  $('.h5p-question-explanation').hide();
};

/**
 * Resets the task.
 * Used in contracts.
 * @public
 */
C.prototype.resetTask = function () {
  var forceReset = true;
  this.reTry(forceReset);
};

/**
 * Calculates the real max score.
 *
 * @returns {Number} Max points
 */
C.prototype.calculateMaxScore = function () {
  var max = 0;

  if (this.blankIsCorrect) {
    return 1;
  }
  if (this.options.behaviour.enableDroppedQuantity) {
    var dropZones = this.options.question.task.dropZones;
    for (var i = 0; i < dropZones.length; i++) {
      if (dropZones[i].acceptedNumber !== undefined) {
        max++;
      }
    }
    return max;
  }
  var elements = this.options.question.task.elements;
  for (var i = 0; i < elements.length; i++) {
    var correctDropZones = this.correctDZs[i];

    if (correctDropZones === undefined || !correctDropZones.length) {
      continue;
    }

    if (elements[i].multiple) {
      max += correctDropZones.length;
    } else {
      max++;
    }
  }

  return max;
};

/**
 * Get maximum score.
 *
 * @returns {Number} Max points
 */
C.prototype.getMaxScore = function () {
  return this.options.behaviour.singlePoint ? this.weight : this.calculateMaxScore();
};

/**
 * Count the number of correct answers.
 * Only works while showing solution.
 *
 * @returns {Number} Points
 */
C.prototype.getScore = function () {
  this.showAllSolutions(true);

  var actualPoints = this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint ? this.points : this.rawPoints;
  delete this.points;
  delete this.rawPoints;
  return actualPoints;
};

/**
 * Checks if all has been answered.
 *
 * @returns {Boolean}
 */
C.prototype.getAnswerGiven = function () {
  return !this.options.behaviour.showSolutionsRequiresInput || this.answered || this.blankIsCorrect;
};

/**
 * Shows the score to the user when the score button is pressed.
 */
C.prototype.showScore = function () {
  var self = this;
  var maxScore = this.calculateMaxScore();
  if (this.options.behaviour.singlePoint) {
    maxScore = 1;
  }

  if (this.options.behaviour.enableDroppedQuantity) {
    var task = this.options.question.task;
    // Count correctly filled in dropZones and add to score.
    var i = 0;
    var totalDropZones = 0;
    var $dropZones = self.dropZones; // DOM objects
    task.dropZones.forEach(function (dropZone, dropZoneId) {
      var $dropZone = $dropZones[i];
      var status = $dropZone.getCompletedStatus();
      if (status == true) {
        status = 'correct';
        dropZone.status = status;
      } else {
        status = 'wrong';
        dropZone.status = status;
      }
      if (dropZone.acceptedNumber == undefined) {
        status = 'none';
        dropZone.status = status;
      }
      $dropZone.markResult(status);
      i++;
    });
  }
  this.scoreViewed = true;
  var actualPoints = this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint ? this.points : this.rawPoints;
  var scoreText = H5P.Question.determineOverallFeedback(this.options.overallFeedback, actualPoints / maxScore).replace('@score', actualPoints).replace('@total', maxScore);
  var helpText = this.options.behaviour.enableScoreExplanation && this.options.behaviour.applyPenalties ? this.options.scoreExplanation : false;
  this.setFeedback(scoreText, actualPoints, maxScore, this.options.scoreBarLabel, helpText, undefined, this.options.scoreExplanationButtonLabel);
};

/**
 * Packs info about the current state of the task into a object for
 * serialization.
 *
 * @public
 * @returns {object}
 */

C.prototype.getCurrentState = function () {
  var state = { answers: [] };
  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }

    var draggableAnswers = [];
    for (var j = 0; j < draggable.elements.length; j++) {
      var element = draggable.elements[j];
      if (element === undefined || element.dropZone === undefined || element.$.hasClass('h5p-question-solution') || element.$.hasClass('h5p-question-hidden')) {
        continue;
      }
      // Store position and drop zone.
      draggableAnswers.push({
        x: Number(element.position.left.replace('%', '')),
        y: Number(element.position.top.replace('%', '')),
        dz: element.dropZone
      });
    }

    if (draggableAnswers.length) {
      // Add answers to state object for storage
      state.answers[i] = draggableAnswers;
    }
  }
  return state;
};

/**
 * Gather copyright information for the current content.
 *
 * @returns {H5P.ContentCopyright}
 */
C.prototype.getCopyrights = function () {
  var self = this;
  var info = new H5P.ContentCopyrights();

  var background = self.options.question.settings.background;
  if (background !== undefined && background.copyright !== undefined) {
    var image = new H5P.MediaCopyright(background.copyright);
    image.setThumbnail(new H5P.Thumbnail(H5P.getPath(background.path, self.id), background.width, background.height));
    info.addMedia(image);
  }

  for (var i = 0; i < self.options.question.task.elements.length; i++) {
    var element = self.options.question.task.elements[i];
    var instance = H5P.newRunnable(element.type, self.id);

    if (instance.getCopyrights !== undefined) {
      var rights = instance.getCopyrights();
      rights.setLabel((element.dropZones.length ? 'Draggable ' : 'Static ') + (element.type.params.contentName !== undefined ? element.type.params.contentName : 'element'));
      info.addContent(rights);
    }
  }

  return info;
};

C.prototype.getTitle = function () {
  return H5P.createTitle(this.options.question.settings.questionTitle);
};

/**
 * Initialize controls to improve a11Y.
 *
 * @private
 * @param {Draggable[]} draggables
 * @param {DropZone[]} dropZones
 * @param {Element} noDropzone
 * @return {Object<string, Controls>}
 */
var getControls = function getControls(draggables, dropZones, noDropzone) {
  // Initialize controls components
  var controls = {
    drag: new _controls2.default([new _keyboard2.default(), new _drag2.default()]),
    drop: new _controls2.default([new _keyboard2.default(), new _drop2.default()])
  };
  controls.drag.useNegativeTabIndex();
  controls.drop.useNegativeTabIndex();

  // Keep track of current selected draggable (selected via keyboard)
  var selected;

  /**
   * De-selects the currently selected draggable element.
   *
   * @private
   */
  var deselect = function deselect() {
    selected.draggable.trigger('dragend');
    selected.element.$.removeClass('h5p-draggable-hover');
    _dragUtils2.default.setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);

    if (controls.drop.elements.indexOf(noDropzone) !== -1) {
      controls.drop.removeElement(noDropzone);
      noDropzone.style.display = 'none';
    }
    for (var i = 0; i < dropZones.length; i++) {
      var dropZone = dropZones[i];

      // Remove highlighting
      dropZone.dehighlight();

      if (controls.drop.elements.indexOf(dropZone.$dropZone[0]) !== -1) {
        controls.drop.removeElement(dropZone.$dropZone[0]);
      }
    }

    if (selected.element.$.is(':visible')) {
      // Put focus back on element after deselecting
      selected.element.$.focus();
    } else {
      // Put focus on next draggable element
      var $next = selected.draggable.elements[selected.draggable.elements.length - 1].$;
      controls.drag.setTabbable($next[0]);
      $next.focus();
    }
    selected = undefined;
  };

  // Handle draggable selected through keyboard
  controls.drag.on('select', function (event) {
    var result = _dragUtils2.default.elementToDraggable(draggables, event.element);
    if (selected) {
      // De-select
      deselect();
      return;
    }
    selected = result;

    // Select
    selected.element.$.addClass('h5p-draggable-hover');
    _dragUtils2.default.setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);
    selected.draggable.trigger('dragstart', selected.draggable.mustCopyElement(selected.element) ? 'copy' : 'move');
    // Add special drop zone to reset
    controls.drop.addElement(noDropzone);

    // Position at element position
    noDropzone.style.display = 'block';
    noDropzone.style.left = selected.draggable.x + '%';
    noDropzone.style.top = selected.draggable.y + '%';
    noDropzone.style.width = selected.draggable.width + 'em';
    noDropzone.style.height = selected.draggable.height + 'em';

    // Figure out which drop zones will accept this draggable
    var $first;
    for (var i = 0; i < dropZones.length; i++) {
      var dropZone = dropZones[i];

      if (dropZone.accepts(selected.draggable, draggables)) {
        dropZone.highlight();
        controls.drop.addElement(dropZone.$dropZone[0]);
        if (!$first || selected.element.dropZone === dropZone.id) {
          $first = dropZone.$dropZone;
        }
      }
    }
    if ($first) {
      // Focus the first drop zone after selecting a draggable
      controls.drop.setTabbable($first[0]);
      $first.focus();
    }
  });

  // Handle dropzone selected through keyboard
  controls.drop.on('select', function (event) {
    if (!selected) {
      return;
    }
    if (event.element === noDropzone) {
      // Reset position
      if (selected.element.dropZone !== undefined) {
        selected.element.reset();
      }
      // BUG mentioned on the H5P forum on March 29th 2018.
      if (!selected.draggable.multiple) {
        selected.element.$.css({
          left: selected.draggable.x + '%',
          top: selected.draggable.y + '%',
          width: selected.draggable.width + 'em',
          height: selected.draggable.height + 'em'
        });
        selected.draggable.updatePlacement(selected.element);
      }
      selected.element.$[0].setAttribute('aria-grabbed', 'false');
      deselect();
      return;
    }
    var dropZone = _dragUtils2.default.elementToDropZone(dropZones, event.element);
    var mustCopyElement = selected.draggable.mustCopyElement(selected.element);
    if (mustCopyElement) {
      // Leave a new element for next drag
      selected.element.clone();
    }
    // JR added possibility to reset draggables in single zones (except for multiples)
    if (dropZone.resetSingleDraggables && dropZone.single) {
      for (var i = 0; i < draggables.length; i++) {
        if (draggables[i] && draggables[i].isInDropZone(dropZone.id)) {
          var currentDraggable = draggables[i];
          var isMultiple = currentDraggable.multiple;
          // TODO if currentDraggable is multiple just do not accept another one.
          if (!isMultiple) {
            currentDraggable.resetPosition();
          }
          continue;
        }
      }
    }

    // Add draggable to drop zone
    selected.draggable.addToDropZone(selected.index, selected.element, dropZone.id);

    // Set position in case DZ is full (auto align doesn't work)
    selected.element.$.css({
      left: dropZone.x + '%',
      top: dropZone.y + '%'
    });

    if (dropZone.getIndexOf(selected.element.$) === -1) {
      // Add to alignables
      dropZone.alignables.push(selected.element.$);
    }

    // Trigger alignment
    dropZone.autoAlign();

    // Reset selected
    selected.element.$[0].setAttribute('aria-grabbed', 'false');
    deselect();
  });

  return controls;
};

H5P.DragQuestionPapiJo = C;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = __webpack_require__(1);

var _functional = __webpack_require__(0);

var _eventful = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controls Event
 * @typedef {Object} ControlsEvent
 * @property {HTMLElement} element
 * @property {number} index
 * @property {HTMLElement[]} elements
 * @property {HTMLElement} oldElement
 */
/**
 * Add element event
 * @event Controls#addElement
 * @type ControlsEvent
 */
/**
 * Remove element event
 * @event Controls#removeElement
 * @type ControlsEvent
 */
/**
 * Previous element event
 * @event Controls#previousElement
 * @type ControlsEvent
 */
/**
 * Next element event
 * @event Controls#nextElement
 * @type ControlsEvent
 */
/**
 * Select option event
 * @event Controls#select
 * @type ControlsEvent
 */
/**
 * Drag element event
 * @event Controls#drag
 * @type ControlsEvent
 */

/**
 * @type {function} removeTabIndex
 */
var removeTabIndex = (0, _elements.removeAttribute)('tabindex');
/**
 * @type {function} removeTabIndexForAll
 */
var removeTabIndexForAll = (0, _functional.forEach)(removeTabIndex);
/**
 * @type {function} setTabIndexZero
 */
var setTabIndexZero = (0, _elements.setAttribute)('tabindex', '0');
/**
 * @type {function} setTabIndexMinusOne
 */
var setTabIndexMinusOne = (0, _elements.setAttribute)('tabindex', '-1');
/**
 * @type {function} hasTabIndex
 */
var hasTabIndex = (0, _elements.hasAttribute)('tabindex');

/**
 * @class
 * @mixes Eventful
 */

var Controls = function () {
  function Controls(plugins) {
    _classCallCheck(this, Controls);

    // add event system
    _extends(this, (0, _eventful.Eventful)());

    /**
     *@property {HTMLElement} tabbableElement
     */
    /**
     * @property {object[]} plugins
     */
    this.plugins = plugins || [];

    /**
     * @property {HTMLElement[]} elements
     */
    this.elements = [];

    /**
     * @property {boolean} useNegativeTabIndex
     */
    this.negativeTabIndexAllowed = false;

    // move tabindex to next element
    this.on('nextElement', this.nextElement, this);

    // move tabindex to previous element
    this.on('previousElement', this.previousElement, this);

    // init plugins
    this.initPlugins();
  }

  /**
   * Add controls to an element
   *
   * @param {HTMLElement} el
   *
   * @fires Controls#addElement
   * @public
   */


  _createClass(Controls, [{
    key: 'addElement',
    value: function addElement(el) {
      this.elements.push(el);

      this.firesEvent('addElement', el);

      if (this.elements.length === 1) {
        // if first
        this.setTabbable(el);
      }
    }
  }, {
    key: 'removeElement',


    /**
     * Add controls to an element
     *
     * @param {HTMLElement} el
     *
     * @fires Controls#addElement
     * @public
     */
    value: function removeElement(el) {
      this.elements = (0, _functional.without)([el], this.elements);

      // if removed element was selected
      if (hasTabIndex(el)) {
        this.setUntabbable(el);

        // set first element selected if exists
        if (this.elements[0]) {
          this.setTabbable(this.elements[0]);
        }
      }

      this.firesEvent('removeElement', el);
    }
  }, {
    key: 'firesEvent',


    /**
     * Fire event
     *
     * @param {string} type
     * @param {HTMLElement|EventTarget} el
     *
     * @public
     */
    value: function firesEvent(type, el) {
      var index = this.elements.indexOf(el);

      return this.fire(type, {
        element: el,
        index: index,
        elements: this.elements,
        oldElement: this.tabbableElement
      });
    }

    /**
     * Sets tabindex on an element, remove it from all others
     *
     * @param {number} index
     *
     * @private
     */

  }, {
    key: 'nextElement',
    value: function nextElement(_ref) {
      var index = _ref.index;

      var isLastElement = index === this.elements.length - 1;
      var nextEl = this.elements[isLastElement ? 0 : index + 1];

      this.setTabbable(nextEl);
      nextEl.focus();
    }

    /**
     * Sets tabindex on an element, remove it from all others
     *
     * @param {HTMLElement} el
     * @public
     */

  }, {
    key: 'setTabbable',
    value: function setTabbable(el) {
      (0, _functional.forEach)(this.setUntabbable.bind(this), this.elements);
      setTabIndexZero(el);
      this.tabbableElement = el;
    }

    /**
     * Removes tabbability from an element
     *
     * @param {HTMLElement} el
     */

  }, {
    key: 'setUntabbable',
    value: function setUntabbable(el) {
      if (this.negativeTabIndexAllowed) {
        setTabIndexMinusOne(el);
      } else {
        removeTabIndex(el);
      }
    }

    /**
     * Sets tabindex on an element, remove it from all others
     *
     * @param {number} index
     *
     * @private
     */

  }, {
    key: 'previousElement',
    value: function previousElement(_ref2) {
      var index = _ref2.index;

      var isFirstElement = index === 0;
      var prevEl = this.elements[isFirstElement ? this.elements.length - 1 : index - 1];

      this.setTabbable(prevEl);
      prevEl.focus();
    }

    /**
     * Use tabindex="-1" instead of removing tabindex for non-focused elements
     */

  }, {
    key: 'useNegativeTabIndex',
    value: function useNegativeTabIndex() {
      this.negativeTabIndexAllowed = true;
      this.elements.forEach(function (element) {
        if (!element.hasAttribute('tabindex')) {
          setTabIndexMinusOne(element);
        }
      });
    }

    /**
     * Initializes the plugins
     *
     * @private
     */

  }, {
    key: 'initPlugins',
    value: function initPlugins() {
      this.plugins.forEach(function (plugin) {
        if (plugin.init !== undefined) {
          plugin.init(this);
        }
      }, this);
    }
  }]);

  return Controls;
}();

exports.default = Controls;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @mixin
 */
var Eventful = exports.Eventful = function Eventful() {
  return {
    listeners: {},

    /**
     * Listen to event
     *
     * @param {string} type
     * @param {function} listener
     * @param {object} [scope]
     *
     * @function
     * @return {Eventful}
     */
    on: function on(type, listener, scope) {
      /**
       * @typedef {object} Trigger
       * @property {function} listener
       * @property {object} scope
       */
      var trigger = {
        'listener': listener,
        'scope': scope
      };

      this.listeners[type] = this.listeners[type] || [];
      this.listeners[type].push(trigger);

      return this;
    },

    /**
     * Fire event. If any of the listeners returns false, return false
     *
     * @param {string} type
     * @param {object} [event]
     *
     * @function
     * @return {boolean}
     */
    fire: function fire(type, event) {
      var triggers = this.listeners[type] || [];

      return triggers.every(function (trigger) {
        return trigger.listener.call(trigger.scope || this, event) !== false;
      });
    },

    /**
     * Listens for events on another Eventful, and propagate it trough this Eventful
     *
     * @param {string[]} types
     * @param {Eventful} eventful
     */
    propagate: function propagate(types, eventful) {
      var self = this;
      types.forEach(function (type) {
        return eventful.on(type, function (event) {
          return self.fire(type, event);
        });
      });
    }
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = __webpack_require__(1);

var _functional = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {string}
 * @readonly
 */
var ATTRIBUTE_ARIA_GRABBED = 'aria-grabbed';

/**
 * @type {function} setGrabbedTrue
 * @param {HTMLElement} element
 */
var setGrabbed = (0, _elements.setAttribute)(ATTRIBUTE_ARIA_GRABBED);

/**
 * @type {function} isGrabbed
 * @param {HTMLElement} element
 */
var isGrabbed = (0, _elements.attributeEquals)(ATTRIBUTE_ARIA_GRABBED, 'true');

/**
 * @type {function} filterHasAttributeDropEffect
 */
var filterHasAttributeGrabbed = (0, _functional.filter)((0, _elements.hasAttribute)(ATTRIBUTE_ARIA_GRABBED));

/**
 * Sets all aria-grabbed to 'false'
 * @param {HTMLElement[]} elements
 * @type {function} setAllGrabbedToFalse
 */
var _setAllGrabbedToFalse = (0, _functional.compose)((0, _functional.forEach)((0, _elements.setAttribute)(ATTRIBUTE_ARIA_GRABBED, 'false')), filterHasAttributeGrabbed);

/**
 * @type {function} hasGrabbed
 * @param {HTMLElement[]} elements
 */
var hasGrabbed = (0, _functional.compose)((0, _functional.some)(isGrabbed), filterHasAttributeGrabbed);

/**
 * @class
 */

var Drag = function () {
  function Drag() {
    _classCallCheck(this, Drag);
  }

  _createClass(Drag, [{
    key: 'init',

    /**
     * Inits this class
     *
     * @param {Controls} controls
     */
    value: function init(controls) {
      /**
       * @type {Controls}
       */
      this.controls = controls;

      // handle select event
      this.controls.on('select', this.select, this);
    }
  }, {
    key: 'addElement',


    /**
     * Marks element as aria-grabbed = 'false' and adds to controller
     *
     * @param element
     */
    value: function addElement(element) {
      setGrabbed('false', element);
      this.controls.addElement(element);
    }

    /**
     * Sets aria-grabbed to 'false' for all elements that has it
     */

  }, {
    key: 'setAllGrabbedToFalse',
    value: function setAllGrabbedToFalse() {
      _setAllGrabbedToFalse(this.controls.elements);
    }

    /**
     * Returns true if any of the elements are grabbed
     *
     * @return {boolean}
     */

  }, {
    key: 'hasAnyGrabbed',
    value: function hasAnyGrabbed() {
      return hasGrabbed(this.controls.elements);
    }

    /**
     * Un selects all, but selects new element if not already selected
     *
     * @param {HTMLElement} element
     */

  }, {
    key: 'select',
    value: function select(_ref) {
      var element = _ref.element;

      var alreadyGrabbed = isGrabbed(element);

      this.setAllGrabbedToFalse();

      if (!alreadyGrabbed) {
        setGrabbed('true', element);
      }
    }
  }]);

  return Drag;
}();

exports.default = Drag;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elements = __webpack_require__(1);

var _functional = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {string}
 * @readonly
 */
var ATTRIBUTE_ARIA_DROPEFFECT = 'aria-dropeffect';

/**
 * @type {function} setDropEffectNone
 */
var setDropEffectNone = (0, _elements.setAttribute)(ATTRIBUTE_ARIA_DROPEFFECT, 'none');

/**
 * @type {function} setDropEffectNone
 */
var setDropEffectMove = (0, _elements.setAttribute)(ATTRIBUTE_ARIA_DROPEFFECT, 'move');

/**
 * @type {function} filterHasAttributeDropEffect
 */
var filterHasAttributeDropEffect = (0, _functional.filter)((0, _elements.hasAttribute)(ATTRIBUTE_ARIA_DROPEFFECT));

/**
 * Sets all drop zones to move
 * @param {HTMLElement[]} elements
 * @type {function} setDropZoneEffectsToMove
 */
var setAllDropEffectsToMove = (0, _functional.compose)((0, _functional.forEach)(setDropEffectMove), filterHasAttributeDropEffect);

/**
 * Sets all drop zones to none
 * @param {HTMLElement[]} elements
 * @type {function} setAllDropEffectsToNone
 */
var setAllDropEffectsToNone = (0, _functional.compose)((0, _functional.forEach)(setDropEffectNone), filterHasAttributeDropEffect);

/**
 * Class for handling Drop Zones
 *
 * @class
 */

var Drop = function () {
  function Drop() {
    _classCallCheck(this, Drop);
  }

  _createClass(Drop, [{
    key: 'init',

    /**
     * Inits this class
     * @param {Controls} controls
     */
    value: function init(controls) {
      /**
       * @type {Controls}
       */
      this.controls = controls;
    }
  }, {
    key: 'setAllToMove',


    /**
     * On elements with aria-dropeffect, set aria-dropeffect to 'move'
     * @public
     */
    value: function setAllToMove() {
      setAllDropEffectsToMove(this.controls.elements);
    }

    /**
     * On elements with aria-dropeffect, set aria-dropeffect to 'none'
     * @public
     */

  }, {
    key: 'setAllToNone',
    value: function setAllToNone() {
      setAllDropEffectsToNone(this.controls.elements);
    }
  }]);

  return Drop;
}();

/**
 * Enum for ARIA drop effects
 * @readonly
 * @enum {string}
 */


exports.default = Drop;
Drop.DropEffect = {
  COPY: 'copy',
  MOVE: 'move',
  EXECUTE: 'execute',
  POPUP: 'popup',
  NONE: 'none'
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @classdesc Keyboard navigation for accessibility support
 */
var Keyboard = function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);

    /**
     * @property {boolean} selectability
     */
    this.selectability = true;
  }

  /**
   * Inits this class
   *
   * @param {Controls} controls
   */


  _createClass(Keyboard, [{
    key: 'init',
    value: function init(controls) {
      /**
       * Need to have a common binding of handleKeyDown, so that it can be a
       * common instance to be used for addEventListener and removeEventListener
       * @type {function}
       */
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);

      /**
       * @type {Controls}
       */
      this.controls = controls;
      this.controls.on('addElement', this.listenForKeyDown, this);
      this.controls.on('removeElement', this.removeKeyDownListener, this);
    }
  }, {
    key: 'listenForKeyDown',


    /**
     * Listens for a keyboard press when element is focused
     *
     * @param {HTMLElement} element
     * @private
     */
    value: function listenForKeyDown(_ref) {
      var element = _ref.element;

      element.addEventListener('keydown', this.boundHandleKeyDown);
    }
  }, {
    key: 'removeKeyDownListener',


    /**
     * Remove a keyboard press listener
     *
     * @param {HTMLElement} element
     * @private
     */
    value: function removeKeyDownListener(_ref2) {
      var element = _ref2.element;

      element.removeEventListener('keydown', this.boundHandleKeyDown);
    }
  }, {
    key: 'handleKeyDown',


    /**
     * Handles key down
     *
     * @param {KeyboardEvent} event Keyboard event
     * @private
     */
    value: function handleKeyDown(event) {
      switch (event.which) {
        case 13: // Enter
        case 32:
          // Space
          this.select(event.target);
          event.preventDefault();
          break;

        case 37: // Left Arrow
        case 38:
          // Up Arrow
          // ignore with modifiers, so not to interfere with Chromevox
          if (!this.hasChromevoxModifiers(event)) {
            this.previousElement(event.target);
            event.preventDefault();
          }
          break;
        case 39: // Right Arrow
        case 40:
          // Down Arrow
          // ignore with modifiers, so not to interfere with Chromevox
          if (!this.hasChromevoxModifiers(event)) {
            this.nextElement(event.target);
            event.preventDefault();
          }
          break;
      }
    }
  }, {
    key: 'hasChromevoxModifiers',


    /**
     * Checks if the Chromevox modifiers are pressed
     *
     * @param {KeyboardEvent} event Keyboard event
     * @private
     */
    value: function hasChromevoxModifiers(event) {
      return event.shiftKey || event.ctrlKey;
    }

    /**
     * Fires the previous element event
     *
     * @param {HTMLElement|EventTarget} el
     * @fires Controls#previousElement
     */

  }, {
    key: 'previousElement',
    value: function previousElement(el) {
      this.controls.firesEvent('previousElement', el);
    }
  }, {
    key: 'nextElement',


    /**
     * Fire the next element event
     *
     * @param {HTMLElement|EventTarget} el
     * @fires Controls#nextElement
     */
    value: function nextElement(el) {
      this.controls.firesEvent('nextElement', el);
    }
  }, {
    key: 'select',


    /**
     * Fires the select event
     *
     * @param {EventTarget|HTMLElement} el
     * @fires Controls#select
     */
    value: function select(el) {
      if (this.selectability) {
        if (this.controls.firesEvent('before-select', el) !== false) {
          this.controls.firesEvent('select', el);
          this.controls.firesEvent('after-select', el);
        }
      }
    }
  }, {
    key: 'disableSelectability',


    /**
     * Disable possibility to select a word trough click and space or enter
     *
     * @public
     */
    value: function disableSelectability() {
      this.selectability = false;
    }
  }, {
    key: 'enableSelectability',


    /**
     * Enable possibility to select a word trough click and space or enter
     *
     * @public
     */
    value: function enableSelectability() {
      this.selectability = true;
    }
  }]);

  return Keyboard;
}();

exports.default = Keyboard;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dragUtils = __webpack_require__(2);

var _dragUtils2 = _interopRequireDefault(_dragUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = H5P.jQuery;

var DropZone = function () {
  /**
   * Creates a new drop zone instance.
   * Makes it easy to keep track of all instance variables.
   *
   * @param {Object} dropZone
   * @param {Number} id
   * @param {string[]} l10n
   * @returns {_L8.DropZone}
   */
  function DropZone(dropZone, id, l10n) {
    _classCallCheck(this, DropZone);

    var self = this;
    H5P.EventDispatcher.call(self);

    self.id = id;
    self.showLabel = dropZone.showLabel;
    self.label = dropZone.label;
    self.x = dropZone.x;
    self.y = dropZone.y;
    self.width = dropZone.width;
    self.height = dropZone.height;
    self.backgroundOpacity = dropZone.backgroundOpacity;
    self.tip = dropZone.tipsAndFeedback.tip || '';
    self.single = dropZone.single;
    self.acceptedNumber = dropZone.acceptedNumber;
    self.autoAlignable = dropZone.autoAlign;
    self.alignables = [];
    self.l10n = l10n;
    self.dropzonebordercolor = dropZone.bordercolor;
    self.background = dropZone.background;
    self.resetSingleDraggables = dropZone.resetSingleDraggables;
  }

  /**
   * Insert drop zone in the given container.
   *
   * @param {jQuery} $container
   * @param {Array} draggables
   * @returns {undefined}
   */


  _createClass(DropZone, [{
    key: 'appendTo',
    value: function appendTo($container, draggables) {
      var self = this;

      // Prepare inner html with prefix for good a11y
      var html = '<div class="h5p-inner" style="color:' + self.dropzonebordercolor + ';"></div>';
      var extraClass = '';
      if (self.showLabel) {
        html = '<div class="h5p-label">' + self.label + '<span class="h5p-hidden-read"></span></div>' + html;
        extraClass = ' h5p-has-label';
      }
      html = '<span class="h5p-hidden-read">' + self.l10n.prefix.replace('{num}', self.id + 1) + '</span>' + html;

      var opacity = self.backgroundOpacity / 100;
      var style = self.background;
      style = _dragUtils2.default.setAlphas(style, 'rgba(', opacity); // Update rgba
      style = _dragUtils2.default.setAlphas(style, 'rgb(', opacity); // Convert rgb

      // Create drop zone element
      self.$dropZone = $('<div/>', {
        class: 'h5p-dropzone' + extraClass,
        tabindex: '-1',
        title: self.showLabel ? $('<div/>', { html: self.label }).text() : null,
        role: 'button',
        'aria-disabled': true,
        css: {
          left: self.x + '%',
          top: self.y + '%',
          width: self.width + 'em',
          height: self.height + 'em',
          background: style
        },
        html: html
      }).appendTo($container).children('.h5p-inner').droppable({
        activeClass: 'h5p-active',
        tolerance: 'intersect',
        accept: function accept(element) {
          /**
           * Functional note:
           * This will fire every time a draggable is starting to get dragged, globally
           * for all initialized drop zones  <-> draggables. That means in a compound H5P this
           * function will fire for all Drag Questions within that compound content type,
           * no matter if it is at a different timestamp, already completed or otherwise
           * intuitively would be disabled. This can lead to some unexpected behaviour if you
           * don't take this into consideration.
           */

          // Find draggable element belongs to
          var result = _dragUtils2.default.elementToDraggable(draggables, element);

          // Found no Draggable that the element belongs to. Don't accept it.
          if (!result) {
            return false;
          }

          // Figure out if the drop zone will accept the draggable
          return self.accepts(result.draggable, draggables);
        },
        drop: function drop(event, ui) {
          var $this = $(this);
          // JR
          if (self.single) {
            for (var i = 0; i < draggables.length; i++) {
              if (draggables[i] && draggables[i].isInDropZone(self.id)) {
                var currentDraggable = draggables[i];
                var isMultiple = currentDraggable.multiple;
                // TODO if currentDraggable is multiple just do not accept another one.
                if (!isMultiple) {
                  currentDraggable.resetPosition();
                }
                continue;
              }
            }
          }
          //DragUtils.setOpacity($this.removeClass('h5p-over'), 'background', self.backgroundOpacity);
          var opacity = self.backgroundOpacity / 100;
          var style = self.background;
          style = _dragUtils2.default.setAlphas(style, 'rgba(', opacity); // Update rgba
          style = _dragUtils2.default.setAlphas(style, 'rgb(', opacity); // Convert rgb
          $this.css({
            backgroundColor: style
          });

          ui.draggable.data('addToZone', self.id);

          if (self.getIndexOf(ui.draggable) === -1) {
            // Add to alignables
            self.alignables.push(ui.draggable);
          }

          if (self.autoAlignable.enabled) {
            // Trigger alignment
            self.autoAlign();
          }
        },
        over: function over() {
          _dragUtils2.default.setOpacity($(this).addClass('h5p-over'), 'background', self.backgroundOpacity);
        },
        out: function out() {
          _dragUtils2.default.setOpacity($(this).removeClass('h5p-over'), 'background', self.backgroundOpacity);
        }
      }).end().focus(function () {
        if ($tip instanceof H5P.jQuery) {
          $tip.attr('tabindex', '0');
        }
      }).blur(function () {
        if ($tip instanceof H5P.jQuery) {
          $tip.attr('tabindex', '-1');
        }
      });

      // Add tip after setOpacity(), so this does not get background opacity:
      var $tip = H5P.JoubelUI.createTip(self.tip, {
        tipLabel: self.l10n.tipLabel,
        tabcontrol: true
      });
      if ($tip instanceof H5P.jQuery) {
        // Create wrapper for tip
        $('<span/>', {
          'class': 'h5p-dq-tipwrap',
          'aria-label': self.l10n.tipAvailable,
          'append': $tip,
          'appendTo': self.$dropZone
        });
      }

      draggables.forEach(function (draggable) {
        var dragEl = draggable.element.$;

        // Add to alignables
        if (draggable.isInDropZone(self.id) && self.getIndexOf(dragEl) === -1) {
          self.alignables.push(dragEl);
        }
      });
      if (self.autoAlignable.enabled) {
        self.autoAlign();
      }

      // Set element opacity when element has been appended
      setTimeout(function () {
        _dragUtils2.default.setOpacity(self.$dropZone.children('.h5p-label'), 'background', self.backgroundOpacity);
        _dragUtils2.default.setOpacity(self.$dropZone.children('.h5p-inner'), 'background', self.backgroundOpacity);
      }, 0);
    }

    /**
     * Help determine if the drop zone can accept this draggable
     */

  }, {
    key: 'accepts',
    value: function accepts(draggable, draggables) {
      var self = this;
      if (!draggable.hasDropZone(self.id)) {
        // Doesn't belong in this drop zone
        return false;
      }
      // JR if SINGLE dropzone is occupied AND option resetSingleDraggables AND current draggable is NOT multiple, then accept new one (for swapping).
      if (self.single) {
        // Find out if dropzone is currently occupied.
        for (var i = 0; i < draggables.length; i++) {
          if (draggables[i] && draggables[i].isInDropZone(self.id)) {
            // This drop zone is occupied.
            var currentDraggable = draggables[i];
            var isCorrect = false;
            currentDraggable.elements.forEach(function (element) {
              if (element.$.hasClass('h5p-correct')) {
                isCorrect = true;
              };
            });
            // Do not allow to drag an element in the zone it actually occupies!
            if (!self.resetSingleDraggables || currentDraggable.multiple || isCorrect || draggable.id == currentDraggable.id) {
              return false;
            }
          }
        }
      }
      return true;
    }

    /**
     * Find index of given alignable
     *
     * @param {jQuery} $alignable
     * @return {number}
     */

  }, {
    key: 'getIndexOf',
    value: function getIndexOf($alignable) {
      var self = this;

      for (var i = 0; i < self.alignables.length; i++) {
        if (self.alignables[i][0] === $alignable[0]) {
          return i;
        }
      }

      return -1;
    }

    /**
     * Remove alignable
     *
     * @param {jQuery} $alignable
     */

  }, {
    key: 'removeAlignable',
    value: function removeAlignable($alignable) {
      var self = this;

      // Find alignable index
      var index = self.getIndexOf($alignable);
      if (index !== -1) {

        // Remove alignable
        self.alignables.splice(index, 1);

        if (self.autoAlignTimer === undefined && self.autoAlignable.enabled) {
          // Schedule re-aligment of alignables left
          self.autoAlignTimer = setTimeout(function () {
            delete self.autoAlignTimer;
            self.autoAlign();
          }, 1);
        }
      }
    }

    /**
     * Auto-align alignable elements inside drop zone.
     */

  }, {
    key: 'autoAlign',
    value: function autoAlign() {
      var self = this;
      // Determine container size in order to calculate percetages
      // TODO JR does not work as expected in contracts (i.e. drag & drop activity within Course Presentation or Quiz)
      var containerSize = self.$dropZone.parent()[0].getBoundingClientRect();

      // Calcuate borders and spacing values in percetage
      var spacing = {
        x: self.autoAlignable.spacing / self.autoAlignable.size.width * 100,
        y: self.autoAlignable.spacing / self.autoAlignable.size.height * 100
      };
      spacing = {
        x: 0,
        y: 0
      };

      // Determine coordinates for first 'spot'
      var pos = {
        x: self.x + spacing.x,
        y: self.y + spacing.y
      };

      // Determine space inside drop zone
      var dropZoneSize = self.$dropZone[0].getBoundingClientRect();
      var space = {
        x: dropZoneSize.width - spacing.x * 2,
        y: dropZoneSize.height - spacing.y * 2
      };

      // Set current space left inside drop zone
      var spaceLeft = {
        x: space.x,
        y: space.y
      };

      // Set height for the active row of elements
      var currentRowHeight = 0;

      // Current alignable element and it's size
      var $alignable, alignableSize;

      /**
       * Helper doing the actual positioning of the element + recalculating
       * next position and space left.
       *
       * @private
       */
      var alignElement = function alignElement() {
        // Position element at current spot
        $alignable.css({
          left: pos.x + '%',
          top: pos.y + '%'
        });
        self.trigger('elementaligned', $alignable);

        // Update horizontal space left + next position
        var spaceDiffX = alignableSize.width + self.autoAlignable.spacing;
        spaceLeft.x -= spaceDiffX;
        pos.x += spaceDiffX / containerSize.width * 100;
        // Keep track of the highest element in this row
        var spaceDiffY = alignableSize.height + self.autoAlignable.spacing;
        if (spaceDiffY > currentRowHeight) {
          currentRowHeight = spaceDiffY;
        }
      };

      // Try to order and align the alignables inside the drop zone
      // (in the order they were added)
      for (var i = 0; i < self.alignables.length; i++) {
        // Determine alignable size
        $alignable = self.alignables[i];
        alignableSize = $alignable[0].getBoundingClientRect();

        // Try to fit on the current row
        if (spaceLeft.x >= alignableSize.width) {
          alignElement();
        } else {
          // Did not fit, try next row

          // Reset X values
          spaceLeft.x = space.x;
          pos.x = self.x + spacing.x;

          // Bump Y values
          if (currentRowHeight) {
            // Update Y space and position according to previous row height
            spaceLeft.y -= currentRowHeight;
            pos.y += currentRowHeight / containerSize.height * 100;

            // Reset
            currentRowHeight = 0;
          }
          if (spaceLeft.y <= 0) {
            return; // No more vertical space left, stop all aligning
          }
          alignElement();
        }
      }
    }

    /**
     * Highlight the current drop zone
     */

  }, {
    key: 'highlight',
    value: function highlight() {
      this.$dropZone.attr('aria-disabled', 'false').children('.h5p-inner').addClass('h5p-active');
    }

    /**
     * De-highlight the current drop zone
     */

  }, {
    key: 'dehighlight',
    value: function dehighlight() {
      this.$dropZone.attr('aria-disabled', 'true').children('.h5p-inner').removeClass('h5p-active');
      this.$dropZone.children('.h5p-inner').css('color', 'red');
    }

    /**
     * Mark the current drop zone correct/wrong.
     */

  }, {
    key: 'markResult',
    value: function markResult(status) {
      this.$dropZone.children('.h5p-inner').addClass('h5p-dropzone-' + status + '-answer');
    }

    /**
     * REmove the current drop zone correct/wrong mark.
     */

  }, {
    key: 'unmarkResult',
    value: function unmarkResult() {
      this.$dropZone.children('.h5p-inner').removeClass('h5p-dropzone-correct-answer h5p-dropzone-wrong-answer');
      this.$dropZone.removeClass('h5p-dropzone-completed-answer');
    }

    /**
     * Mark the current drop zone completed.
     */

  }, {
    key: 'markCompleted',
    value: function markCompleted() {
      this.$dropZone.addClass('h5p-dropzone-completed-answer');
    }
  }, {
    key: 'unMarkCompleted',
    value: function unMarkCompleted() {
      this.$dropZone.removeClass('h5p-dropzone-completed-answer');
    }
  }, {
    key: 'getCompletedStatus',
    value: function getCompletedStatus() {
      var completed = this.$dropZone.hasClass('h5p-dropzone-completed-answer');
      return completed;
    }

    /**
       * JR enableDroppedQuantity Calculate score for this dropzone.
       *
       * @param {Array} draggables
       * @param {Array} solutions
       * @param {H5P.Question.ScorePoints} scorePoints
       * @returns {number}
       */

  }, {
    key: 'results',
    value: function results(draggables, solutions, scorePoints) {
      var self = this;
      var points = 0;
      self.rawPoints = 0;
      var nbDraggablesInZone = 0;
      var nbPlacedDraggables = 0;
      var completed = false;
      var acceptedNumber = self.acceptedNumber;
      var dropZoneId = self.id;
      var solutions = solutions[dropZoneId];
      if (nbDraggablesInZone === undefined) {
        return 0;
      }
      for (var i = 0; i < draggables.length; i++) {
        var draggable = draggables[i];
        if (draggable === undefined) {
          continue;
        }
        var element = draggable.elements[0];
        // Draggable not in dropZone
        if (element.dropZone !== dropZoneId) {
          continue;
        }
        nbDraggablesInZone++;
        var dragId = draggable.id;
        var dragOkDZ = $.inArray(dragId, solutions);
        if (nbPlacedDraggables > acceptedNumber) {
          continue;
        }
        if (dragOkDZ !== -1) {
          nbPlacedDraggables++;
        }
        if (nbPlacedDraggables == acceptedNumber && dragOkDZ !== -1 && nbDraggablesInZone == acceptedNumber && completed == false) {
          completed = true;
          self.rawPoints++;
          self.markCompleted();
        } else {
          completed = false;
          self.unMarkCompleted();
        }
      }
      // Use case of empty dropZone expecting 0 draggables!   
      if (nbDraggablesInZone === 0 && acceptedNumber === 0) {
        completed = true;
        self.markCompleted();
        self.rawPoints++;
        return 1;
      }

      for (var i = 0; i < draggables.length; i++) {
        var draggable = draggables[i];
        if (draggable === undefined) {
          continue;
        }
        var element = draggable.elements[0];
        // Draggable not in dropZone
        if (element.dropZone !== dropZoneId) {
          continue;
        }
        // Just in case it was previously added.
        element.$.removeClass('h5p-correct-quantity');
        if (completed) {
          element.$.addClass('h5p-correct-quantity');
        }
      }
      if (completed) {
        points++;
      } else {
        points--;
      }
      return points;
    }
  }]);

  return DropZone;
}();

exports.default = DropZone;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dragUtils = __webpack_require__(2);

var _dragUtils2 = _interopRequireDefault(_dragUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = H5P.jQuery;

var Draggable = function (_H5P$EventDispatcher) {
  _inherits(Draggable, _H5P$EventDispatcher);

  /**
   * Creates a new draggable instance.
   * Makes it easier to keep track of all instance variables and elements.
   *
   * @class
   * @param {Object} element
   * @param {number} id
   * @param {Array} [answers] from last session
   * @param {Object.<string, string>} l10n
   */
  function Draggable(element, id, answers, l10n) {
    _classCallCheck(this, Draggable);

    var _this = _possibleConstructorReturn(this, (Draggable.__proto__ || Object.getPrototypeOf(Draggable)).call(this));

    var self = _this;

    self.$ = $(self);
    self.id = id;
    self.elements = [];
    self.x = element.x;
    self.y = element.y;
    self.width = element.width;
    self.height = element.height;
    self.backgroundOpacity = element.backgroundOpacity;
    self.dropZones = element.dropZones;
    self.type = element.type;
    self.multiple = element.multiple;
    self.l10n = l10n;
    // JR self.inline = element.inline;

    if (answers) {
      if (self.multiple) {
        // Add base element
        self.elements.push({});
      }

      // Add answers
      for (var i = 0; i < answers.length; i++) {
        self.elements.push({
          dropZone: answers[i].dz,
          position: {
            left: answers[i].x + '%',
            top: answers[i].y + '%'
          }
        });
      }
    }
    return _this;
  }

  /**
   * Insert draggable elements into the given container.
   *
   * @param {jQuery} $container
   * @param {Number} contentId
   * @returns {undefined}
   */


  _createClass(Draggable, [{
    key: 'appendTo',
    value: function appendTo($container, contentId) {
      var self = this;

      if (!self.elements.length) {
        self.attachElement(null, $container, contentId);
      } else {
        for (var i = 0; i < self.elements.length; i++) {
          self.attachElement(i, $container, contentId);
        }
      }
    }

    /**
     * Attach the given element to the given container.
     *
     * @param {Number} index
     * @param {jQuery} $container
     * @param {Number} contentId
     * @returns {undefined}
     */

  }, {
    key: 'attachElement',
    value: function attachElement(index, $container, contentId) {
      var self = this;

      var element;
      if (index === null) {
        // Create new element
        element = {};
        self.elements.push(element);
        index = self.elements.length - 1;
      } else {
        // Get old element
        element = self.elements[index];
      }

      $.extend(element, {
        clone: function clone() {
          self.attachElement(null, $container, contentId);
        },
        reset: function reset() {
          if (element.dropZone !== undefined) {
            // Let everyone know we're leaving the drop zone
            self.trigger('leavingDropZone', element);
            delete element.dropZone;
          }

          if (self.multiple) {
            // Remove element
            element.$.remove();
            delete self.elements[index];
            self.trigger('elementremove', element.$[0]);
          }
          delete element.position;
        }
      });

      // Attach element
      element.$ = $('<div/>', {
        class: 'h5p-draggable',
        tabindex: '-1',
        role: 'button',
        css: {
          left: self.x + '%',
          top: self.y + '%',
          width: self.width + 'em',
          height: self.height + 'em'
        },
        appendTo: $container
      }).on('click', function () {
        self.trigger('focus', this);
      }).draggable({
        revert: function revert(dropZone) {
          $container.removeClass('h5p-dragging');
          var $this = $(this);

          $this.data("uiDraggable").originalPosition = {
            top: self.y + '%',
            left: self.x + '%'
          };
          self.updatePlacement(element);
          $this[0].setAttribute('aria-grabbed', 'false');

          self.trigger('dragend');

          return !dropZone;
        },
        start: function start() {
          var $this = $(this);
          var mustCopyElement = self.mustCopyElement(element);

          if (mustCopyElement) {
            // Leave a new element for next drag
            element.clone();
          }

          // Send element to the top!
          $this.removeClass('h5p-wrong').detach().appendTo($container);
          $container.addClass('h5p-dragging');
          _dragUtils2.default.setElementOpacity($this, self.backgroundOpacity);
          this.setAttribute('aria-grabbed', 'true');

          self.trigger('focus', this);
          self.trigger('dragstart', {
            element: this,
            effect: mustCopyElement ? 'copy' : 'move'
          });
        },
        stop: function stop() {
          var $this = $(this);
          // Convert position to % to support scaling.
          element.position = _dragUtils2.default.positionToPercentage($container, $this);
          $this.css(element.position);

          var addToZone = $this.data('addToZone');
          if (addToZone !== undefined) {
            $this.removeData('addToZone');
            self.addToDropZone(index, element, addToZone);
          } else {
            element.reset();
          }
        }
      }).css('position', '');
      self.element = element;

      if (element.position) {
        // Restore last position
        element.$.css(element.position);
        self.updatePlacement(element);
      }

      _dragUtils2.default.addHover(element.$, self.backgroundOpacity);
      H5P.newRunnable(self.type, contentId, element.$);
      // Override image hover and use user defined hover text or none.
      if (self.type.library.indexOf('H5P.Image ') === 0) {
        element.$.find('img').attr('title', self.type.params.title || '');
      }
      // Add prefix for good a11y
      $('<span class="h5p-hidden-read">' + self.l10n.prefix.replace('{num}', self.id + 1) + '</span>').prependTo(element.$);

      // Add suffix for good a11y
      $('<span class="h5p-hidden-read"></span>').appendTo(element.$);

      // Update opacity when element is attached.
      setTimeout(function () {
        _dragUtils2.default.setElementOpacity(element.$, self.backgroundOpacity);
      }, 0);

      self.trigger('elementadd', element.$[0]);
    }

    /**
     * Set feedback for a draggable.
     * @param {string} feedback
     * @param {number} dropZoneId
     */

  }, {
    key: 'setFeedback',
    value: function setFeedback(feedback, dropZoneId) {
      this.elements.forEach(function (element) {
        if (element.dropZone === dropZoneId) {
          if (element.$feedback === undefined) {
            element.$feedback = $('<span>', {
              'class': 'h5p-hidden-read',
              appendTo: element.$
            });
          }
          element.$feedback.html(feedback);
        }
      });
    }

    /**
     * Determine if element should be copied when dragging, i.e. infinity instances.
     *
     * @param {Object} element
     * @returns {boolean}
     */

  }, {
    key: 'mustCopyElement',
    value: function mustCopyElement(element) {
      return this.multiple && element.dropZone === undefined;
    }

    /**
     * Check if this element can be dragged to the given drop zone.
     *
     * @param {Number} id
     * @returns {Boolean}
     */

  }, {
    key: 'hasDropZone',
    value: function hasDropZone(id) {
      var self = this;

      for (var i = 0; i < self.dropZones.length; i++) {
        if (parseInt(self.dropZones[i]) === id) {
          return true;
        }
      }

      return false;
    }

    /**
     * Places the draggable element in the given drop zone.
     *
     * @param {number} index Internal element index
     * @param {Object} element
     * @param {number} addToZone Dropzone index
     */

  }, {
    key: 'addToDropZone',
    value: function addToDropZone(index, element, addToZone) {
      var self = this;
      if (self.multiple) {

        // Check that we're the only element here
        for (var i = 0; i < self.elements.length; i++) {
          if (i !== index && self.elements[i] !== undefined && self.elements[i].dropZone === addToZone) {

            // Copy of element already in drop zone

            // Remove current element
            if (self.elements[index].dropZone !== undefined && self.elements[index].dropZone !== addToZone) {
              // Leaving old drop zone!
              self.trigger('leavingDropZone', element);
            }
            element.$.remove();
            delete self.elements[index];
            self.trigger('elementremove', self.element.$[0]);
            return;
          }
        }
      }

      if (element.dropZone !== undefined && element.dropZone !== addToZone) {
        // Leaving old drop zone!
        self.trigger('leavingDropZone', element);
      }
      element.dropZone = addToZone;
      self.updatePlacement(element);

      self.trigger('interacted');
    }

    /**
     * Update the visuals to match the position of the element
     */

  }, {
    key: 'updatePlacement',
    value: function updatePlacement(element) {
      var self = this;
      if (element.$suffix) {
        // Always remove old a11y text. (drop zone may have changed)
        element.$suffix.remove();
      }

      if (element.dropZone !== undefined) {
        element.$.addClass('h5p-dropped');
        _dragUtils2.default.setElementOpacity(element.$, self.backgroundOpacity);

        // Add suffix for good a11y
        element.$suffix = $('<span class="h5p-hidden-read">' + this.l10n.suffix.replace('{num}', element.dropZone + 1) + '. </span>').appendTo(element.$);
      } else {
        element.$.removeClass('h5p-dropped').removeClass('h5p-wrong').removeClass('h5p-correct').removeClass('h5p-question-solution').css({
          border: '',
          background: ''
        });
        _dragUtils2.default.setElementOpacity(element.$, this.backgroundOpacity);
      }
    }

    /**
     * Resets the position of the draggable to its original position.
     */

  }, {
    key: 'resetPosition',
    value: function resetPosition(correctDZs, correctClass) {
      var self = this;
      var oneIsCorrect = false;
      var keepCorrectAnswers = correctDZs !== undefined ? true : false;

      this.elements.forEach(function (draggable) {

        if (draggable.$feedback) {
          draggable.$feedback.remove();
          delete draggable.$feedback;
        }

        //If the draggable is in a dropzone reset its position and feedback.

        if (draggable.dropZone !== undefined) {

          // If keepCorrectAnswers and draggable is in the right DZ, then disable the draggable and stop.
          // DEV JR and number in dz < allowed number
          var element = self.elements[self.elements.indexOf(draggable)];
          var ok = element.$.hasClass(correctClass);
          if (keepCorrectAnswers && $.inArray(draggable.dropZone, correctDZs) !== -1 && ok === true) {
            oneIsCorrect = true;
            var element = self.elements[self.elements.indexOf(draggable)];
            element.$.draggable('disable');
            return;
          }

          var element = draggable.$;

          //Revert the button to initial position and then remove it.
          element.animate({
            left: self.x + '%',
            top: self.y + '%'
          }, function () {
            //Remove the draggable if it is an infinity draggable.
            if (self.multiple) {
              if (element.dropZone !== undefined) {
                self.trigger('leavingDropZone', element);
              }
              element.remove();
              //Delete the element from elements list to avoid a cluster of draggables on top of infinity draggable.
              if (self.elements.indexOf(draggable) >= 0) {
                delete self.elements[self.elements.indexOf(draggable)];
              }
              self.trigger('elementremove', element[0]);
            }
          });

          // Reset element style
          self.updatePlacement(draggable);
        }
      });

      if (oneIsCorrect === false) {
        // Draggable removed from dropzone.
        if (self.element.dropZone !== undefined) {
          self.trigger('leavingDropZone', self.element);
          delete self.element.dropZone;
        }

        // Reset style on initial element
        // Reset element style
        self.updatePlacement(self.element);
      }
    }

    /**
     * Shuffles the position of the draggables.
     */

  }, {
    key: 'shufflePosition',
    value: function shufflePosition(shuffle, x, y) {
      this.x = x;
      this.y = y;
      var self = this;
      if (!shuffle) {
        return;
      }
      this.elements.forEach(function (draggable) {
        var element = draggable.$;
        element.animate({
          left: self.x + '%',
          top: self.y + '%'
        }, function () {});
      });
    }

    /**
     * Look for the given DOM element inside this draggable.
     *
     * @param {Element} element
     * @returns {Object}
     */

  }, {
    key: 'findElement',
    value: function findElement(element) {
      var self = this;

      for (var i = 0; i < self.elements.length; i++) {
        if (self.elements[i] !== undefined && self.elements[i].$.is(element)) {
          return {
            element: self.elements[i],
            index: i
          };
        }
      }
    }

    /**
     * Detemine if any of our elements is in the given drop zone.
     *
     * @param {Number} id
     * @returns {Boolean}
     */

  }, {
    key: 'isInDropZone',
    value: function isInDropZone(id) {
      var self = this;
      for (var i = 0; i < self.elements.length; i++) {
        if (self.elements[i] !== undefined && self.elements[i].dropZone === id) {
          return true;
        }
      }

      return false;
    }

    /**
     * Disables the draggable.
     * @public
     */

  }, {
    key: 'disable',
    value: function disable() {
      var self = this;

      for (var i = 0; i < self.elements.length; i++) {
        var element = self.elements[i];

        if (element) {
          element.$.draggable('disable');
          self.trigger('elementremove', element.$[0]);
        }
      }
    }

    /**
     * Enables the draggable.
     * @public
     */

  }, {
    key: 'enable',
    value: function enable() {
      var self = this;

      for (var i = 0; i < self.elements.length; i++) {
        var element = self.elements[i];

        if (element) {
          element.$.draggable('enable');
          self.trigger('elementadd', element.$[0]);
        }
      }
    }

    /**
     * Calculate score for this draggable.
     *
     * @param {boolean} skipVisuals
     * @param {Array} solutions
     * @param {H5P.Question.ScorePoints} scorePoints
     * @param {H5P.Question.scoreInline} scoreInline
     * @returns {number}
     */

  }, {
    key: 'results',
    value: function results(skipVisuals, solutions, scorePoints, scoreInline) {
      var self = this;
      var i,
          j,
          element,
          correct,
          points = 0;
      self.rawPoints = 0;
      if (solutions === undefined) {

        // We should not be anywhere.
        for (i = 0; i < self.elements.length; i++) {
          element = self.elements[i];

          if (element !== undefined && element.dropZone !== undefined) {
            // ... but we are!
            if (skipVisuals !== true) {
              self.markElement(element, 'wrong', scorePoints, scoreInline);
            }
            points--;
          }
        }
        return points;
      }

      // Are we somewhere we should be?
      for (i = 0; i < self.elements.length; i++) {
        element = self.elements[i];

        if (element === undefined || element.dropZone === undefined) {
          continue; // We have not been placed anywhere, we're neither wrong nor correct.
        }
        // DEV JR QUANTITY do not mark correct if exceeds expected number!
        // correct only if equals accepted number of elements
        correct = false;
        for (j = 0; j < solutions.length; j++) {
          if (element.dropZone === solutions[j]) {
            // Yepp!
            if (skipVisuals !== true) {
              // If keeepCorrectAnswers is enabled, then the current element may already have been marked as correct, so skip the marking.
              if (element.$suffix.length == 1) {
                self.markElement(element, 'correct', scorePoints, scoreInline);
              }
            }
            // If element has already been marked as a "missing solution" do not give any points.
            if (!element.$.hasClass('h5p-question-solution')) {
              self.rawPoints++;
              points++;
            }
            correct = true;
            break;
          }
        }

        if (!correct) {
          // Nope, we're in another zone
          if (skipVisuals !== true) {
            self.markElement(element, 'wrong', scorePoints, scoreInline);
          }
          if (!element.$.hasClass('h5p-question-solution')) {
            points--;
          }
        }
      }

      return points;
    }

    /**
     * Marks given element as either correct or wrong
     *
     * @param {Object} element
     * @param {string} status 'correct' or 'wrong'
     * @param {H5P.Question.ScorePoints} scorePoints
     */

  }, {
    key: 'markElement',
    value: function markElement(element, status, scorePoints, scoreInline) {
      var self = this;

      var $elementResult = $('<span/>', {
        'class': 'h5p-hidden-read',
        html: this.l10n[status + 'Answer']
      });
      if (scorePoints) {
        $elementResult = $elementResult.add(scorePoints.getElement(status === 'correct'));
      }
      element.$suffix = element.$suffix.add($elementResult);
      if (scoreInline === true) {
        element.$suffix.addClass('h5p-question-score-inline');
        element.$.addClass('h5p-' + status + ' h5p-dg-inline').append($elementResult);
      } else {
        element.$suffix.addClass('h5p-question-score-normal');
        element.$.addClass('h5p-' + status + ' h5p-dg-normal').append($elementResult);
      }

      _dragUtils2.default.setElementOpacity(element.$, this.backgroundOpacity);
    }
  }, {
    key: 'markElementCorrectNumber',
    value: function markElementCorrectNumber(element) {
      element.$.addClass('h5p-correct h5p-dg-normal');
    }
  }, {
    key: 'unmarkElementCorrectNumber',
    value: function unmarkElementCorrectNumber(element) {
      element.$.removeClass('h5p-correct h5p-dg-normal');
    }
  }]);

  return Draggable;
}(H5P.EventDispatcher);

exports.default = Draggable;

/***/ })
/******/ ]);