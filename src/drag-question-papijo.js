import Controls from 'h5p-lib-controls/src/scripts/controls';
import AriaDrag from 'h5p-lib-controls/src/scripts/aria/drag';
import AriaDrop from 'h5p-lib-controls/src/scripts/aria/drop';
import UIKeyboard from 'h5p-lib-controls/src/scripts/ui/keyboard';
import DragUtils from './drag-utils';
import DropZone from './dropzone';
import Draggable from './draggable';
const $ = H5P.jQuery;
let numInstances = 0;
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
  const self = this;
  numInstances++;
  this.id = this.contentId = contentId;
  H5P.Question.call(self, 'dragquestion');
  this.options = $.extend(true, {}, {
    description: 'Task description',
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
    correctNumber: 'Correct number: ',
    inCorrectNumber: 'Incorrect number: ',
    correctValue: 'Correct total value: ',
    inCorrectValue: 'Incorrect total value: ',
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
      enableScoreExplanationQuantity: true,
      dropZoneHighlighting: 'dragging',
      autoAlignSpacing: 2,
      showScorePoints: true,
      showScoreInline: false,
      keepCorrectAnswers: false,
      disableCompletedDropZones: false,
      randomizeDraggables: false,
      resetSingleDraggables: false,
      enableDroppedQuantity: false
    }
  }, options);
  // If single point is enabled, it makes no sense displaying
  // the score explanation. Note: In the editor, the score explanation is hidden
  // by the showWhen widget if singlePoint is enabled
  if (this.options.behaviour.singlePoint || this.options.behaviour.enableDroppedQuantity) {
    this.options.behaviour.enableScoreExplanation = false;
  }
  if (!this.options.behaviour.enableDroppedQuantity) {
    this.options.behaviour.enableScoreExplanationQuantity = false;
  }
  this.draggables = [];
  this.dropZones = [];
  this.nbDraggables = []; // Used by enableDroppedQuantity option.
  this.nbPlacedDraggables = []; // Used by enableDroppedQuantity option.
  // Initialize these arrays.
  const task = this.options.question.task;
  for (let i = 0; i < task.dropZones.length; i++) {
    this.nbDraggables[i] = 0;
    this.nbPlacedDraggables[i] = 0;
  }
  this.answered = (contentData !== undefined
    && contentData.previousState !== undefined
    && contentData.previousState.answers !== undefined
    && contentData.previousState.answers.length !== 0);
  this.hasSavedState = this.answered;
  this.blankIsCorrect = true;
  this.backgroundOpacity = (this.options.behaviour.backgroundOpacity === undefined || this.options.behaviour.backgroundOpacity === '') ? undefined : this.options.behaviour.backgroundOpacity;
  this.backgroundColor = (this.options.question.settings.backgroundColor === "rgba(255, 255, 255, 0)") ? undefined : this.options.question.settings.backgroundColor;
  this.backgroundOpacityDropZones = this.options.behaviour.backgroundOpacityDropZones === undefined || this.options.behaviour.backgroundOpacityDropZones === '' ? undefined : this.options.behaviour.backgroundOpacityDropZones;
  this.overrideBorderColor = (this.options.behaviour.overrideBorderColor === "rgba(0, 0, 0, 0)") ? undefined : this.options.behaviour.overrideBorderColor;
  this.dropZonesBackgroundColor = (this.options.behaviour.dropZonesBackgroundColor === undefined) ? "rgb(245, 245, 245)" : this.options.behaviour.dropZonesBackgroundColor;
  // Used in contracts (by showsolutions)
  this.solutionViewed = false;
  this.answerChecked = false;
  this.scoreViewed = false;
  this.maxScoreReached = false;
  self.$noDropZone = $('<div class="h5p-dq-no-dz" role="button" style="display:none;"><span class="h5p-hidden-read">' + self.options.noDropzone + '</span></div>');
  // Initialize controls for good a11y
  const controls = getControls(self.draggables, self.dropZones, self.$noDropZone[0]);
  /**
   * Update the drop effect for all drop zones accepting this draggable.
   *
   * @private
   * @param {string} effect
   */
  const setDropEffect = function (effect) {
    for (let i = 0; i < controls.drop.elements.length; i++) {
      controls.drop.elements[i].setAttribute('aria-dropeffect', effect);
    }
  };
  // List of drop zones that has no elements, i.e. not used for the task
  const dropZonesWithoutElements = [];
  // Create map over correct drop zones for elements
  this.correctDZs = [];
  for (let i = 0; i < task.dropZones.length; i++) {
    dropZonesWithoutElements.push(true); // All true by default
    const correctElements = task.dropZones[i].correctElements;
    for (let j = 0; j < correctElements.length; j++) {
      const correctElement = correctElements[j];
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
  const grabbablel10n = {
    prefix: self.options.grabbablePrefix.replace('{total}', task.elements.length),
    suffix: self.options.grabbableSuffix,
    correctAnswer: self.options.correctAnswer,
    wrongAnswer: self.options.wrongAnswer
  };
  for (let i = 0; i < task.elements.length; i++) {
    const element = task.elements[i];
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
    let answers = null;
    if (contentData && contentData.previousState !== undefined && contentData.previousState.answers !== undefined && contentData.previousState.answers[i] !== undefined) {
      answers = contentData.previousState.answers[i];
    }
    // Create new draggable instance
    const draggable = new Draggable(element, i, answers, grabbablel10n);
    const highlightDropZones = (self.options.behaviour.dropZoneHighlighting === 'dragging');
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
    for (let j = 0; j < element.dropZones.length; j++) {
      dropZonesWithoutElements[element.dropZones[j]] = false;
    }
  }
  // Create map over correct draggables for dropzones (if enableDroppedQuantity)
  if (this.options.behaviour.enableDroppedQuantity) {
    this.correctDraggables = [];
    for (let i = 0; i < task.dropZones.length; i++) {
      this.correctDraggables[i] = [];
      for (let j = 0; j < this.correctDZs.length; j++) {
        if (this.correctDZs[j] === undefined) {
          continue;
        }
        const dragOkDZ = $.inArray(i, this.correctDZs[j]);
        if (dragOkDZ !== -1) {
          this.correctDraggables[i].push(j);
        }
      }
    }
  }
  // Create a count to subtrack from score
  this.numDropZonesWithoutElements = 0;
  const dropzonel10n = {
    prefix: self.options.dropzonePrefix.replace('{total}', task.dropZones.length),
    tipLabel: self.options.tipLabel,
    tipAvailable: self.options.tipAvailable
  };
  // Add drop zones
  for (let i = 0; i < task.dropZones.length; i++) {
    const dropZone = task.dropZones[i];
    // Just in case it was previously set to true.
    if (this.options.behaviour.enableDroppedQuantity) {
      dropZone.single = false;
    }
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
    this.dropZones[i] = new DropZone(dropZone, i, dropzonel10n);
    // Update element internal position when aligned
    this.dropZones[i].on('elementaligned', function (event) {
      let $aligned = event.data;
      for (let i = 0; i < self.draggables.length; i++) {
        let draggable = self.draggables[i];
        if (!draggable || !draggable.elements || !draggable.elements.length) {
          continue;
        }
        for (let j = 0; j < draggable.elements.length; j++) {
          let element = draggable.elements[j];
          if (!element || element.$[0] !== $aligned[0]) {
            continue;
          }
          // Update position
          element.position = DragUtils.positionToPercentage(self.$container, element.$);
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
  const self = this;
  // Register introduction section
  let titleText = '';
  if (self.options.question.settings.showTitle) {
    titleText = self.options.question.settings.questionTitle;
  }
  let titleDescription = '';
  if (self.options.question.settings.description !== '') {
    titleDescription = '<p>' + self.options.question.settings.description + '</p>';
  }
  self.$introduction = $('<p class="h5p-dragquestion-introduction" id="dq-intro-' + numInstances + '">'
      + titleText + '</p>' + titleDescription);
  self.setIntroduction(self.$introduction);
  // Set class if no background
  let classes = '';
  if (this.options.question.settings.background !== undefined) {
    classes += 'h5p-dragquestion-has-no-background';
  }
  if (self.options.behaviour.dropZoneHighlighting === 'always' ) {
    if (classes) {
      classes += ' ';
    }
    classes += 'h5p-dq-highlight-dz-always';
  }
  // Register task content area
  self.setContent(self.createQuestionContent(), {
    'class': classes
  });
  // First we check if full screen is supported and if this content is not included in an Interactive Book, etc.
  if (this.isRoot() && H5P.canHasFullScreen !== false && this.options.behaviour.enableFullScreen) {
    // We create a function that is used to enter or
    // exit full screen when our button is pressed
    const toggleFullScreen = function () {
      if (H5P.isFullscreen) {
        H5P.exitFullScreen(self.$container);
      }
      else {
        H5P.fullScreen(self.$container.parent().parent(), self);
      }
    };
    // Create full screen button
    const $fullScreenButton = $('<div/>', {
      'class': 'h5p-my-fullscreen-button-enter',
      title: this.options.localize.fullscreen,
      role: 'button',
      tabindex: 0,
      on: {
        click: toggleFullScreen,
        keypress: function (event) {
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
  const xAPIEvent = this.createXAPIEventTemplate('answered');
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
  const definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
  $.extend(definition, this.getXAPIDefinition());
};
/**
 * Get object definition for xAPI statement.
 *
 * @return {Object} xAPI object definition
 */
C.prototype.getXAPIDefinition = function () {
  const definition = {};
  definition.description = {
    // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
    'en-US': $('<div>' + this.options.question.settings.questionTitle + '</div>').text()
  };
  definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
  definition.interactionType = 'matching';
  // Add sources, i.e. draggables
  definition.source = [];
  for (let i = 0; i < this.options.question.task.elements.length; i++) {
    const el = this.options.question.task.elements[i];
    if (el.dropZones && el.dropZones.length) {
      // Modified by papi Jo OCTOBER 2021 for new audio draggable compativility.
      const desc = DragUtils.strip(el.type.params.alt || el.type.params.text || el.type.metadata.title) || '?';
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
  let firstCorrectPair = true;
  for (let i = 0; i < this.options.question.task.dropZones.length; i++) {
    definition.target.push({
      'id': '' + i,
      'description': {
        // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
        'en-US': $('<div>' + this.options.question.task.dropZones[i].label + '</div>').text()
      }
    });
    if (this.options.question.task.dropZones[i].correctElements) {
      for (let j = 0; j < this.options.question.task.dropZones[i].correctElements.length; j++) {
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
  const maxScore = this.getMaxScore();
  const score = this.getScore();
  const success = score === maxScore ? true : false;
  xAPIEvent.setScoredResult(score, maxScore, this, true, success);
  xAPIEvent.data.statement.result.response = this.getUserXAPIResponse();
};
/**
 * Get what the user has answered encoded as an xAPI response pattern
 *
 * @return {string} xAPI encoded user response pattern
 */
C.prototype.getUserXAPIResponse = function () {
  const answers = this.getUserAnswers();
  if (!answers) {
    return '';
  }
  return answers
    .filter(function (answerMapping) {
      return answerMapping.elements.length;
    })
    .map(function (answerMapping, index) {
      return answerMapping.elements
        .filter(function (element) {
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
    return draggableMapping.draggable !== undefined &&
      draggableMapping.draggable.elements;
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
  // If reattaching, we no longer show solution. So forget that we
  // might have done so before.
  this.$container = $('<div class="h5p-inner" role="application" aria-labelledby="dq-intro-' + numInstances + '"></div>');
  if (this.options.question.settings.background !== undefined) {
    this.$container.css('backgroundImage', 'url("' + H5P.getPath(this.options.question.settings.background.path, this.id) + '")');
  }
  else if (this.backgroundColor !== undefined) {
    this.$container.css('background-color', this.backgroundColor);
  }
  const task = this.options.question.task;
  // Add elements (static and draggable)
  for (let i = 0; i < task.elements.length; i++) {
    const element = task.elements[i];
    if (element.dropZones !== undefined && element.dropZones.length !== 0) {
      // Attach draggable elements
      this.draggables[i].appendTo(this.$container, this.id);
    }
    else {
      // Add static element
      const $element = this.addElement(element, 'static', i);
      H5P.newRunnable(element.type, this.id, $element);
      // Override image hover and use user defined hover text or none.
      if (element.type.library.indexOf('H5P.Image ') === 0) {
        $element.find('img').attr('title', element.type.params.title || '');
      }
      const timedOutOpacity = function ($el, el) {
        setTimeout(function () {
          DragUtils.setOpacity($el, 'background', el.backgroundOpacity);
        }, 0);
      };
      timedOutOpacity($element, element);
    }
  }
  // Attach invisible 'reset' drop zone for keyboard users
  this.$noDropZone.appendTo(this.$container);
  // Attach drop zones
  for (let i = 0; i < this.dropZones.length; i++) {
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
  if (this.oneDropzonesHasCorrectElement() ) {
    if (!this.options.behaviour.enableDroppedQuantity) {
      this.addShowSolutionButton();
    }
    if (this.options.behaviour.randomizeDraggables) {
      this.shuffleDraggables();
    }
  }
};
/**
 * Add solution button to our container.
 */
C.prototype.addSolutionButton = function () {
  const that = this;
  this.addButton('check-answer', this.options.scoreShow, function () {
    that.answerChecked = true;
    that.showAllSolutions();
    that.showScore();
    if (!that.options.behaviour.enableDroppedQuantity) {
      that.addExplanation();
    }
    else {
      that.addExplanationDroppedQuantity();
    }
    // Just in case question-explanation has been hidden by showsolution
    $( '.h5p-question-explanation').show();
    const xAPIEvent = that.createXAPIEventTemplate('answered');
    that.addQuestionToXAPI(xAPIEvent);
    that.addResponseToXAPI(xAPIEvent);
    that.trigger(xAPIEvent);
    // Hide potential remaining multiple draggables
    if (that.maxScoreReached) {
      that.draggables.forEach(draggable => {
        if (draggable.multiple) {
          draggable.elements.forEach(element => {
            if (!element.$.hasClass('h5p-correct')) {
              element.$.addClass('h5p-dragquestion h5p-question-hidden');
            }
          });
        }
      });
    }
    if (that.options.behaviour.removeCorrectWrongStyles && that.maxScoreReached) {
      that.draggables.forEach(draggable => {
        draggable.elements.forEach(element => {
          if (element.$.hasClass('h5p-correct')) {
            element.$
              .removeClass('h5p-correct');
          }
          if (element.$suffix) {
            element.$suffix.remove();
          }
        });
      });
    }
    // Focus top of task for better focus and read-speaker flow
    const $nextFocus = that.$introduction ? that.$introduction : that.$container.children().first();
    $nextFocus.focus();
  });
};
/**
 * Add explanation/feedback (the part on the bottom part)
 */
C.prototype.addExplanation = function () {
  const task = this.options.question.task;
  let explanations = [];
  // Go through all dropzones, and find answers:
  task.dropZones.forEach((dropZone, dropZoneId) => {
    const feedback = {
      correct: dropZone.tipsAndFeedback.feedbackOnCorrect,
      incorrect: dropZone.tipsAndFeedback.feedbackOnIncorrect
    };
    // Don't run this code if feedback is not configured;
    if (feedback.correct === undefined && feedback.incorrect === undefined) {
      return;
    }
    // Index for correct draggables
    const correctElements = dropZone.correctElements;
    // Find all dragables placed on this dropzone:
    let placedDraggables = {};
    this.draggables.forEach(draggable => {
      draggable.elements.forEach(dz => {
        if (dz.dropZone === dropZoneId) {
          // Save reference to draggable, and mark it as correct/incorrect
          placedDraggables[draggable.id] = {
            instance: draggable,
            correct: correctElements.indexOf("" + draggable.id) !== -1
          };
        }
      });
    });
    // Go through each placed draggable
    Object.keys(placedDraggables).forEach(draggableId => {
      const draggable = placedDraggables[draggableId];
      // Modified by papi Jo OCT 2021 for new audio draggable compativility.
      const draggableLabel = DragUtils.strip(draggable.instance.type.params.alt || draggable.instance.type.params.text || draggable.instance.type.metadata.title) || '?';
      const dropZoneLabel = DragUtils.strip(dropZone.label);
      if (draggable.correct && feedback.correct) {
        explanations.push({
          correct: dropZoneLabel + ' + ' + draggableLabel,
          text: feedback.correct
        });
        draggable.instance.setFeedback(feedback.correct, dropZoneId);
      }
      else if (!draggable.correct && feedback.incorrect) {
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
 * Add explanation/feedback (the part on the bottom part) FOR contents with enableDroppedQuantity.
 */
C.prototype.addExplanationDroppedQuantity = function () {
  const task = this.options.question.task;
  const self = this;
  let explanations = [];
  // todo remove const $dropZones = self.dropZones; // DOM objects
  let i = 0;
  const $dropZones = self.dropZones; // DOM objects
  // Go through all dropzones, and find correct/incorrect feedback and current status.
  task.dropZones.forEach((dropZone, dropZoneId) => {
    // Init labels.
    let fb = '';
    let correctValueLabel = '';
    let correctNumberLabel = '';
    let inCorrectNumberLabel = '';
    let inCorrectValueLabel = '';
    const feedback = {
      correct: dropZone.tipsAndFeedback.feedbackOnCorrect,
      incorrect: dropZone.tipsAndFeedback.feedbackOnIncorrect,
      incorrectNumber:dropZone.tipsAndFeedback.feedbackOnIncorrectNumber,
      incorrectValue: dropZone.tipsAndFeedback.feedbackOnIncorrectValue
    };
    const $dropZone = $dropZones[i];
    const dropZoneLabel = DragUtils.strip(dropZone.label);
    // Calculate number of draggables in current zone and their total value.
    let nbDraggablesInZone = 0;
    let totalValueInZone = 0;
    this.draggables.forEach(draggable => {
      draggable.elements.forEach(dz => {
        if (dz.dropZone === dropZoneId) {
          nbDraggablesInZone++;
          totalValueInZone += draggable.value;
        }
      });
    });
    if (dropZone.acceptedNumber !== undefined) {
      if (nbDraggablesInZone === dropZone.acceptedNumber) {
        correctNumberLabel = this.options.correctNumber + dropZone.acceptedNumber + '<br />';
      }
      else {
        inCorrectNumberLabel = this.options.inCorrectNumber + nbDraggablesInZone + '<br />';
        if (feedback.incorrectNumber) {
          fb = feedback.incorrectNumber
            .replace('@requirednumber', dropZone.acceptedNumber)
            .replace('@selectednumber', nbDraggablesInZone);
        }
      }
    }
    if (dropZone.acceptedValue !== undefined) {
      if (totalValueInZone === dropZone.acceptedValue) {
        correctValueLabel = this.options.correctValue + dropZone.acceptedValue + '<br />';
      }
      else {
        if (dropZone.acceptedValue !== undefined) {
          if (fb === '') {
            inCorrectValueLabel = this.options.inCorrectValue + totalValueInZone + '<br />' ;
          }
          if (fb === '' && feedback.incorrectValue) {
            fb += feedback.incorrectValue
              .replace('@requiredvalue', dropZone.acceptedValue)
              .replace('@totalvalue', totalValueInZone)
              .replace('@oppositerequiredvalue', - dropZone.acceptedValue)
              .replace('@oppositetotalvalue', - totalValueInZone);
          }
        }
      }
    }
    let status = $dropZone.getCompletedStatus();
    if (status === true) {
      status = 'correct';
      fb = feedback.correct;
    }
    else if (dropZone.acceptedNumber === undefined && dropZone.acceptedValue === undefined) {
      status = 'none';
    }
    else {
      status = 'incorrect';
      if (fb === '' && feedback.incorrect) {
        fb = feedback.incorrect;
      }
    }
    if (status !== 'none') {
      explanations.push({
        correct: dropZoneLabel + '<br />' + correctNumberLabel + correctValueLabel,
        wrong: inCorrectNumberLabel + inCorrectValueLabel,
        text: fb
      });
    }
    $dropZone.markResult(status);
    i++;
  });
  if (explanations.length !== 0) {
    this.setExplanation(explanations, this.options.feedbackHeader);
  }
};
/**
 * Add retry button to our container.
 */
C.prototype.addRetryButton = function () {
  const that = this;
  this.addButton('try-again', this.options.tryAgain, function () {
    let forceReset = false;
    if (that.solutionViewed) {
      forceReset = true;
      that.solutionViewed = false;
    }
    if (that.maxScoreReached) {
      forceReset = true;
      that.maxScoreReached = false;
    }
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
  const selected = (this.$container.find('.h5p-dropped').length) >= this.draggables.length;
  return selected;
};
/**
 * Determine if at least one dropzone has at least one correct draggable element.
 *
 * @return {boolean}
 */
C.prototype.oneDropzonesHasCorrectElement = function () {
  const task = this.options.question.task;
  for (let i = 0; i < task.dropZones.length; i++) {
    if (task.dropZones[i].correctElements.length !== 0) {
      return true;
    }
  }
  return false;
};
/**
 * Add show solution button to our container.
 */
C.prototype.addShowSolutionButton = function () {
  const that = this;
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
  const self = this;
  // Make sure we use all the height we can get. Needed to scale up.
  if (this.$container === undefined || !this.$container.is(':visible')) {
    // Not yet attached or visible – not possible to resize correctly
    return;
  }
  // Check if decreasing iframe size
  const decreaseSize = e && e.data && e.data.decreaseSize;
  if (!decreaseSize) {
    this.$container.css('height', '99999px');
    self.$container.parents('.h5p-standalone.h5p-dragquestion').css('width', '');
  }
  const size = this.options.question.settings.size;
  const ratio = size.width / size.height;
  const parentContainer = this.$container.parent();
  // Use parent container as basis for resize.
  let width = parentContainer.width() - parseFloat(parentContainer.css('margin-left')) - parseFloat(parentContainer.css('margin-right'));
  // Check if we need to apply semi full screen fix.
  const $semiFullScreen = self.$container.parents('.h5p-standalone.h5p-dragquestion.h5p-semi-fullscreen');
  if ($semiFullScreen.length) {
    // Reset semi fullscreen width
    $semiFullScreen.css('width', '');
    // Decrease iframe size
    if (!decreaseSize) {
      self.$container.css('width', '10px');
      $semiFullScreen.css('width', '');
      // Trigger changes
      setTimeout(function () {
        self.trigger('resize', {decreaseSize: true});
      }, 200);
    }
    // Set width equal to iframe parent width, since iframe content has not been update yet.
    const $iframe = $(window.frameElement);
    if ($iframe) {
      const $iframeParent = $iframe.parent();
      width = $iframeParent.width();
      $semiFullScreen.css('width', width + 'px');
    }
  }
  let height = width / ratio;
  // Set natural size if no parent width
  if (width <= 0) {
    width = size.width;
    height = size.height;
  }
  this.$container.css({
    width: width + 'px',
    height: height + 'px',
    fontSize: (16 * (width / size.width)) + 'px'
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
  let scorePoints;
  if (!skipVisuals && this.options.behaviour.showScorePoints && !this.options.behaviour.singlePoint && this.options.behaviour.applyPenalties) {
    scorePoints = new H5P.Question.ScorePoints();
  }
  this.scoreInline = this.options.behaviour.showScoreInline;
  this.maxScoreReached = false;
  for (let i = 0; i < this.draggables.length; i++) {
    const draggable = this.draggables[i];
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
    for (let i = 0; i < this.draggables.length; i++) {
      const draggable = this.draggables[i];
      if (draggable === undefined) {
        continue;
      }
      // Find out where we are.
      this.points += draggable.results(skipVisuals, this.correctDZs[i], scorePoints, this.scoreInline);
      this.rawPoints += draggable.rawPoints;
    }
  }
  else { // enableDroppedQuantity Mode.
    for (let i = 0; i < this.dropZones.length; i++) {
      const dropzone = this.dropZones[i];
      this.points += dropzone.results(this.draggables, this.correctDraggables, scorePoints);
      this.rawPoints = this.points;
    }
  }
  if (this.points < 0) {
    this.points = 0;
  }
  if (!this.answered && this.blankIsCorrect) {
    this.points = this.weight;
  }
  if (this.options.behaviour.singlePoint) {
    this.points = (this.points === this.calculateMaxScore() ? 1 : 0);
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
  const self = this;
  this.points = 0;
  this.rawPoints = 0;
  this.answered = false;
  // Used in contracts (by showsolutions)
  this.solutionViewed = false;
  this.answerChecked = false;
  this.scoreViewed = false;
  let nbCorrectDropZones = 0;
  let totalDropZones = 0;
  // The "h5p-question-hidden" class may need to be removed from elements.
  this.draggables.forEach(draggable => {
    draggable.elements.forEach(element => {
      if (element.$.hasClass('h5p-question-hidden')) {
        element.$.removeClass('h5p-question-hidden');
      }
    });
  });
  //Enables Draggables
  this.enableDraggables();

  //Only reset position and feedback if we are not keeping the correct answers.
  // Do not reset positions if previous state is being restored. WHY NOT? dove
  if (this.options.behaviour.enableDroppedQuantity) {
    const task = this.options.question.task;
    task.dropZones.forEach((dropZone) => {
      if (dropZone.status !== 'none') {
        totalDropZones ++;
      }
      if (dropZone.status === 'correct') {
        nbCorrectDropZones ++;
      }
    });
  }
  this.draggables.forEach(function (draggable) {
    if (self.options.behaviour.keepCorrectAnswers && !forceReset) {
      let isMultiple = draggable.multiple;
      const element = draggable.elements[0];
      let correctClass = 'h5p-correct';
      let isCorrect = false;
      if (self.options.behaviour.enableDroppedQuantity) {
        if (element.$.hasClass('h5p-correct-quantity')) {
          element.$.addClass(correctClass);
          isCorrect = true;
        }
        correctClass += '-quantity';
      }
      // Deal with multiple draggables.
      if (isMultiple) {
        draggable.elements.forEach(element => {
          if (element.$.hasClass(correctClass) && element.$.hasClass('h5p-dropped')) {
            isCorrect = true;
          }
          return;
        });
      }
      else {
        if (element.$.hasClass(correctClass)) {
          isCorrect = true;
        }
      }
      if (isCorrect) {
        draggable.resetPosition(self.correctDZs[draggable.id], correctClass);
      }
      else {
        draggable.resetPosition();
      }
    }
    else {
      draggable.resetPosition();
    }
  });
  if (this.options.behaviour.enableDroppedQuantity) {
    if (nbCorrectDropZones === totalDropZones) {
      //Enables Draggables
      this.enableDraggables();
      this.draggables.forEach(function (draggable) {
        draggable.resetPosition();
      });
    }
  }
  this.hasSavedState = false;
  if (this.options.behaviour.enableDroppedQuantity) {
    const $dropZones = self.dropZones; // DOM objects
    for (let i = 0; i < $dropZones.length; i++) {
      const $dropZone = $dropZones[i];
      const status = $dropZone.getCompletedStatus();
      $dropZone.unmarkResult(status, self.options.behaviour.keepCorrectAnswers, self.options.behaviour.disableCompletedDropZones, forceReset);
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
  const self = this;
  self.solutionViewed = true;
  const dropZones = self.dropZones;
  // Reset all dropzones alignables to empty. ???
  for (let i = 0; i < dropZones.length; i++) {
    const dropZone = dropZones[i];
    dropZone.autoAlign();
    dropZone.alignables = [];
  }
  const correctDZs = [];
  for (let i = 0; i < this.draggables.length; i++) {
    const draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    correctDZs[draggable.id] = this.correctDZs[i];
  }
  const mustCloneElement = [];
  let oneIsMultiple = false;
  for (let i = 0; i < this.draggables.length; i++) {
    const draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    if (draggable.multiple) {
      oneIsMultiple = true;
      const dragId = draggable.id;
      const correctDZ = correctDZs[dragId];
      // If this draggable is not accepted by any dropZone, do not clone it.
      if (correctDZ) {
        mustCloneElement[dragId] = correctDZ.length;
        // When using Retry after ShowSolution, we may need to remove NULL elements from draggable.elements array.
        draggable.elements = draggable.elements.filter(function (n) {
          return n !== undefined;
        });
        // Needed if keepstate is ON and user has moved away and back.
        // Otherwise showSolution does not work if first dropZone is undefined.
        const element = draggable.elements[0];
        if (element.dropZone === undefined) {
          const ary = draggable.elements;
          ary.push(ary.shift());
        }
        for (let j = 0; j < draggable.elements.length; j++) {
          const element = draggable.elements[j];
          // If element is correct we need to clone one less element.
          const isCorrect = element.$.hasClass('h5p-correct');
          if (isCorrect) {
            mustCloneElement[dragId]--;
          }
        }
      }
    }
  }
  if (oneIsMultiple) {
    for (let i = 0; i < this.draggables.length; i++) {
      const draggable = this.draggables[i];
      if (draggable === undefined) {
        continue;
      }
      const dragId = draggable.id;
      if (draggable.multiple) {
        for (let j = 0; j < mustCloneElement[dragId]; j++) {
          const element = draggable.elements[j];
          if (element !== undefined) {
            element.clone();
          }
        }
      }
    }
  }
  this.draggables.forEach(draggable => {
    const dragId = draggable.id;
    const correctDZ = correctDZs[dragId];
    const remainingCorrectDZ = [];
    // Initialize and Copy correctDZ elements to remainingCorrectDZ array
    // in order to be able to remove the correctly placed elements later on
    // to avoid double display in dropzone.
    // TODO JR check that this is the cause for wrong solutions with multiple after using F5!
    const isMultiple = draggable.multiple;
    if (isMultiple && correctDZ) {
      for (let i = 0; i < correctDZ.length; i++) {
        remainingCorrectDZ.push(correctDZ[i]);
      }
    }
    let z = 0;
    draggable.elements.forEach(element => {
      let correct = element.$.hasClass('h5p-correct');
      if (!correct) {
        element.$.removeClass('h5p-wrong');
      }
      // Remove display of possible +1 / -1 score suffix from element; only keep the correct check mark.
      if (element.$suffix) {
        element.$suffix.remove();
      }
      if (correctDZ) {
        // Hide away multiple elements incorrectly placed, including remaining multiple draggage FIXED JR 31 OCT 2020!
        if (isMultiple && element.$.hasClass('h5p-wrong')) {
          element.$.addClass('h5p-dragquestion h5p-question-hidden');
        }
        if (!isMultiple) {
          for (let i = 0; i < correctDZ.length; i++) {
            // JR No, because a draggable can have the dropped class even if it has been removed from its drop zone!
            //if (!element.$.hasClass('h5p-dropped')) {
            element.$.addClass('h5p-question-solution');
            //};
            let dropZone = dropZones[correctDZ[i]];
            if (dropZone !== undefined) {
              draggable.addToDropZone(0, element, dropZone.id);
              // Set position in case DZ is full (auto align doesn't work)
              element.$.css({
                left: dropZone.x + '%',
                top: dropZone.y + '%',
              });
              if (element.$.hasClass('h5p-wrong')) {
                element.$.addClass('h5p-question-solution');
              }
              // Add to alignables
              if (dropZone.getIndexOf(element.$) === -1) {
                dropZone.alignables.push(element.$);
              }
              // maybe not needed ? dove
              dropZone.autoAlign();
            }
          }
        }
        else {
          // If element is correctly placed, leave it there but remove it from array of remainingCorrectDZ.
          if (element.$.hasClass('h5p-correct')) {
            const index = remainingCorrectDZ.indexOf(element.dropZone);
            const elDZ = element.dropZone;
            let dropZone = dropZones[elDZ];
            if (dropZone.getIndexOf(element.$) === -1) {
              dropZone.alignables.push(element.$);
            }
            // TODO ???
            dropZone.autoAlign();
            remainingCorrectDZ.splice(index, 1);
          }
          else {
            // If multiple element is wrongly placed then leave it in place and continue.
            if (!element.$.hasClass('h5p-wrong')) {
              // If multiple element has not yet been dropped into any correct dropzone then move it there.
              if (!element.$.hasClass('h5p-dropped')) {
                let dropZone = dropZones[remainingCorrectDZ[z]];
                if (dropZone !== undefined) {
                  element.$.addClass('h5p-question-solution');
                  element.dropZone = dropZone.id;
                  draggable.updatePlacement(element);
                  // Set position in case DZ is full (auto align doesn't work)
                  element.$.css({
                    left: dropZone.x + '%',
                    top: dropZone.y + '%',
                  });
                  // Add to alignables
                  if (dropZone.getIndexOf(element.$) === -1) {
                    dropZone.alignables.push(element.$);
                    // dove not needed?
                    dropZone.autoAlign();
                  }
                  // Now remove element.dropzone so that this element is NOT saved to currentState.
                  element.dropZone = '';
                  z++;
                }
              }
            }
          }
        }
      }
      else {
        // This draggable is not accepted by any dropZone. It's a so-called "distracter".
        // If it has been dropped, hide it away.
        if (element.$.hasClass('h5p-dropped')) {
          element.$.addClass('h5p-question-hidden');
        }
      }
    });
  });
  // Hide "unused" draggables. Maybe there is a better option.
  for (let i = 0; i < this.draggables.length; i++) {
    const draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    for (let j = 0; j < draggable.elements.length; j++) {
      const element = draggable.elements[j];
      if (!element.$.hasClass('h5p-correct') && !element.$.hasClass('h5p-question-solution')) {
        element.$.addClass('h5p-question-hidden');
      }
    }
  }
  // Reset all dropzones alignables to empty. WHY ???
  // Align all dropzones
  for (let i = 0; i < dropZones.length; i++) {
    const dropZone = dropZones[i];
    dropZone.autoAlign();
  }
  this.disableDraggables();
  //Show solution button
  this.showButton('try-again');
  this.hideButton('show-solution');
  // remove feedback/explanation h5p-question-explanation
  $( '.h5p-question-explanation').hide();
};
/**
 * Resets the task.
 * Used in contracts.
 * @public
 */
C.prototype.resetTask = function () {
  const forceReset = true;
  this.reTry(forceReset);
};
/**
 * Calculates the real max score.
 *
 * @returns {Number} Max points
 */
C.prototype.calculateMaxScore = function () {
  if (this.blankIsCorrect) {
    return 1;
  }
  if (this.maxScore) {
    return this.maxScore; // Will never change
  }
  if (this.options.behaviour.enableDroppedQuantity) {
    let max = 0;
    const dropZones = this.options.question.task.dropZones;
    for (let i = 0; i < dropZones.length; i++) {
      max++;
    }
    return max;
  }
  const that = this;
  /*
   * Maximum number of correct elements that could be put into dropzone spots
   * Could be larger than number of elements that can actually be dragged
   * if an element could be placed into more than one dropzone, but if
   * element does not allow to have multiple instances.
   */
  const maxScoreDropZones = this.options.question.task.dropZones.reduce(function (max, dropzone) {
    return max + (dropzone.single ? 1 : dropzone.correctElements.length);
  }, 0);
  /*
   * Maximum number of correct dropzone spots that could be filled by elements
   * Could be larger than number of actually available dropzone spots if
   * a dropzone accepts only one element.
   */
  let maxScoreDraggables = this.options.question.task.elements.reduce(function (max, element, index) {
    const correctIn = that.correctDZs[index] ? that.correctDZs[index].length : 0;
    return max + (element.multiple ? correctIn : Math.min(correctIn, 1));
  }, 0);
  /*
   * There could be elements that are only correct on dropzones that accept
   * only one element, and there could be more of these elements than dropzones
   * available.
   */
  // Number of dropzones that allow 1 item only
  const numberSingleDropZones = this.options.question.task.dropZones
    .filter(function (dropzone) {
      return dropzone.single;
    })
    .length;
  // Number of elements that can only be put onto dropzones that allow 1 item
  const numberElementsNeedSingleDZ = that.correctDZs
    .map(function (dropzones) {
      dropzones = dropzones || [];
      return dropzones.every(function (dropzoneId) {
        return that.options.question.task.dropZones[dropzoneId].single;
      });
    })
    .reduce(function (amount, hasOnlySingleDropzones) {
      return amount + ((hasOnlySingleDropzones) ? 1 : 0);
    }, 0);
  // Account for number of elements that cannot be placed anywhere
  maxScoreDraggables = maxScoreDraggables - Math.max(0, numberElementsNeedSingleDZ - numberSingleDropZones);
  this.maxScore = Math.min(maxScoreDropZones, maxScoreDraggables);
  return this.maxScore;
};
/**
 * Get maximum score.
 *
 * @returns {Number} Max points
 */
C.prototype.getMaxScore = function () {
  const max = this.options.behaviour.singlePoint ? this.weight : this.calculateMaxScore();
  return (max);
};
/**
 * Count the number of correct answers.
 * Only works while showing solution.
 *
 * @returns {Number} Points
 */
C.prototype.getScore = function () {
  this.showAllSolutions(true);
  const actualPoints = (this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint || this.options.behaviour.enableDroppedQuantity)
    ? this.points : this.rawPoints;
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
 * Shows the score to the user when the check button is pressed.
 */
C.prototype.showScore = function () {
  const self = this;
  let maxScore = this.calculateMaxScore();
  if (this.options.behaviour.singlePoint) {
    maxScore = 1;
  }
  if (this.options.behaviour.enableDroppedQuantity) {
    const task = this.options.question.task;
    // Count correctly filled in dropZones and add to score.
    let i = 0;
    const $dropZones = self.dropZones; // DOM objects
    task.dropZones.forEach((dropZone) => {
      const $dropZone = $dropZones[i];
      let status = $dropZone.getCompletedStatus();
      if (status === true) {
        status = 'correct';
        dropZone.status = status;
      }
      else {
        status = 'wrong';
        dropZone.status = status;
      }
      if (dropZone.acceptedNumber === undefined && dropZone.acceptedValue === undefined) {
        //status = 'none';
        //dropZone.status = status;
      }
      $dropZone.markResult(status);
      i++;
    });
    // Enable correct or wrong background-color for the draggables, accounting for their opacity.
    for (let i = 0; i < this.draggables.length; i++) {
      const draggable = this.draggables[i];
      if (draggable === undefined) {
        continue;
      }
      const element = draggable.elements[0];
      if (this.options.behaviour.enableDroppedQuantity) {
        if (element.$.hasClass('h5p-correct-quantity')) {
          element.$.addClass('h5p-correct');
        }
        else if (element.$.hasClass('h5p-incorrect-quantity')) {
          element.$.addClass('h5p-wrong');
        }
      }
      DragUtils.setOpacity(element.$, 'background', draggable.backgroundOpacity);
    }
  }
  this.scoreViewed = true;
  let helpText = '';
  const actualPoints = (this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint)
    ? this.points : this.rawPoints;
  const scoreText = H5P.Question.determineOverallFeedback(this.options.overallFeedback,
    actualPoints / maxScore).replace('@score', actualPoints).replace('@total', maxScore);
  if (this.options.behaviour.enableDroppedQuantity) {
    helpText = (this.options.behaviour.enableScoreExplanationQuantity)
      ? this.options.scoreExplanationQuantity : false;
  }
  else {
    helpText = (this.options.behaviour.enableScoreExplanation && this.options.behaviour.applyPenalties)
      ? this.options.scoreExplanation : false;
  }
  this.setFeedback(scoreText, actualPoints, maxScore, this.options.scoreBarLabel, helpText, undefined,
    this.options.scoreExplanationButtonLabel);
};
/**
 * Packs info about the current state of the task into a object for
 * serialization.
 *
 * @public
 * @returns {object}
 */
C.prototype.getCurrentState = function () {
  const state = {answers: []};
  for (let i = 0; i < this.draggables.length; i++) {
    const draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    const draggableAnswers = [];
    for (let j = 0; j < draggable.elements.length; j++) {
      const element = draggable.elements[j];
      if ( (element === undefined || element.dropZone === undefined) || element.$.hasClass('h5p-question-solution') || element.$.hasClass('h5p-question-hidden')) {
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
  const self = this;
  const info = new H5P.ContentCopyrights();
  const background = self.options.question.settings.background;
  if (background !== undefined && background.copyright !== undefined) {
    const image = new H5P.MediaCopyright(background.copyright);
    image.setThumbnail(new H5P.Thumbnail(H5P.getPath(background.path, self.id), background.width, background.height));
    info.addMedia(image);
  }
  for (let i = 0; i < self.options.question.task.elements.length; i++) {
    const element = self.options.question.task.elements[i];
    const instance = H5P.newRunnable(element.type, self.id);
    if (instance.getCopyrights !== undefined) {
      const rights = instance.getCopyrights();
      rights.setLabel((element.dropZones.length ? 'Draggable ' : 'Static ') + (element.type.params.contentName !== undefined ? element.type.params.contentName : 'element'));
      info.addContent(rights);
    }
  }
  return info;
};
C.prototype.getTitle = function () {
  return H5P.createTitle(this.options.question.settings.questionTitle);
};
C.prototype.shuffleDraggables = function () {
  // IF SHUFFLE/RANDOMIZE DRAGGABLES POSITIONS
  let draggablePositions = [];
  // Put current draggables coordinates into an array.
  // Check that the draggable does have elements, exclude distracters.
  // Do not shuffle the multiple draggables if content state has been saved at least once.
  this.draggables.forEach(draggable => {
    //if (draggable.elements && !draggable.multiple) {
    if (draggable.elements && !(draggable.multiple && this.hasSavedState)) {
      draggablePositions.push([draggable.x, draggable.y]);
    }
  });
  // Shuffle the array of coordinates.
  draggablePositions = H5P.shuffleArray(draggablePositions);
  let skipIt = 0;
  for (let i = 0; i < this.draggables.length; i++) {
    const draggable = this.draggables[i];
    // Do not shuffle the multiple draggables if content state has been saved at least once.
    if (draggable === undefined || (draggable.multiple && this.hasSavedState)) {
      skipIt++;
      continue;
    }
    const element = draggable.elements[0];
    // If keep correct answers and draggable is in its correct dropzone, set shuffled draggable coordinates but do not actually shuffle it.
    let shuffle = true;
    // Deal with enableDroppedQuantity option
    if (element.$.hasClass('h5p-dropped')) {
      shuffle = false;
    }
    let x = draggablePositions[i - skipIt][0];
    let y = draggablePositions[i - skipIt][1];
    draggable.shufflePosition(shuffle, x, y);
  }
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
const getControls = function (draggables, dropZones, noDropzone) {
  // Initialize controls components
  const controls = {
    drag: new Controls([new UIKeyboard(), new AriaDrag()]),
    drop: new Controls([new UIKeyboard(), new AriaDrop()])
  };
  controls.drag.useNegativeTabIndex();
  controls.drop.useNegativeTabIndex();
  // Keep track of current selected draggable (selected via keyboard)
  let selected;
  /**
   * De-selects the currently selected draggable element.
   *
   * @private
   */
  const deselect = function () {
    selected.draggable.trigger('dragend');
    selected.element.$.removeClass('h5p-draggable-hover');
    DragUtils.setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);
    if (controls.drop.elements.indexOf(noDropzone) !== -1) {
      controls.drop.removeElement(noDropzone);
      noDropzone.style.display = 'none';
    }
    for (let i = 0; i < dropZones.length; i++) {
      const dropZone = dropZones[i];
      // Remove highlighting
      dropZone.dehighlight();
      if (controls.drop.elements.indexOf(dropZone.$dropZone[0]) !== -1) {
        controls.drop.removeElement(dropZone.$dropZone[0]);
      }
    }
    if (selected.element.$.is(':visible')) {
      // Put focus back on element after deselecting
      selected.element.$.focus();
    }
    else {
      // Put focus on next draggable element
      const $next = selected.draggable.elements[selected.draggable.elements.length - 1].$;
      controls.drag.setTabbable($next[0]);
      $next.focus();
    }
    selected = undefined;
  };
  // Handle draggable selected through keyboard
  controls.drag.on('select', function (event) {
    const result = DragUtils.elementToDraggable(draggables, event.element);
    if (selected) {
      // De-select
      deselect();
      return;
    }
    selected = result;
    // Select
    selected.element.$.addClass('h5p-draggable-hover');
    DragUtils.setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);
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
    let $first;
    for (let i = 0; i < dropZones.length; i++) {
      const dropZone = dropZones[i];
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
    const dropZone = DragUtils.elementToDropZone(dropZones, event.element);
    const mustCopyElement = selected.draggable.mustCopyElement(selected.element);
    if (mustCopyElement) {
      // Leave a new element for next drag
      selected.element.clone();
    }
    // JR added possibility to reset draggables in single zones (except for multiples)
    if (dropZone.resetSingleDraggables && dropZone.single) {
      for (let i = 0; i < draggables.length; i++) {
        if (draggables[i] && draggables[i].isInDropZone(dropZone.id)) {
          const currentDraggable = draggables[i];
          const isMultiple = currentDraggable.multiple;
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
      top: dropZone.y + '%',
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