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
      enableScoreExplanationQuantity: true,
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
  var task = this.options.question.task;
  for (i = 0; i < task.dropZones.length; i++) {
    var dropZone = task.dropZones[i];   
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
  var controls = getControls(self.draggables, self.dropZones, self.$noDropZone[0]);

  /**
   * Update the drop effect for all drop zones accepting this draggable.
   *
   * @private
   * @param {string} effect
   */
  var setDropEffect = function (effect) {
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
    var draggable = new Draggable(element, i, answers, grabbablel10n);
    var highlightDropZones = (self.options.behaviour.dropZoneHighlighting === 'dragging');
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
  this.on('domChanged', function(event) {
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

  // First we check if full screen is supported
  if (H5P.canHasFullScreen !== false && this.options.behaviour.enableFullScreen) {

    // We create a function that is used to enter or
    // exit full screen when our button is pressed
    var toggleFullScreen = function () {
      if (H5P.isFullscreen) {
        H5P.exitFullScreen(self.$container);
      }
      else {
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
C.prototype.addQuestionToXAPI = function(xAPIEvent) {
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
C.prototype.addResponseToXAPI = function(xAPIEvent) {
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
    }
    else {
      // Add static element
      var $element = this.addElement(element, 'static', i);
      H5P.newRunnable(element.type, this.id, $element);

      // Override image hover and use user defined hover text or none.
      if (element.type.library.indexOf('H5P.Image ') === 0) {
        $element.find('img').attr('title', element.type.params.title || '');
      }

      var timedOutOpacity = function ($el, el) {
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
  if (this.oneDropzonesHasCorrectElement() ) {
    if (!this.options.behaviour.enableDroppedQuantity) {
      this.addShowSolutionButton();
      }
    if (this.options.behaviour.randomizeDraggables) {
      this.shuffleDraggables();
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
    $( '.h5p-question-explanation').show();
    var xAPIEvent = that.createXAPIEventTemplate('answered');
    that.addQuestionToXAPI(xAPIEvent);
    that.addResponseToXAPI(xAPIEvent);
    that.trigger(xAPIEvent);               
    if (that.options.behaviour.removeCorrectWrongStyles && that.maxScoreReached) {
      that.draggables.forEach(draggable => {
        draggable.elements.forEach(element => {
          if (element.$.hasClass('h5p-correct')) {
            element.$
            .removeClass('h5p-correct');
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
    Object.keys(placedDraggables).forEach(draggableId => {
      const draggable = placedDraggables[draggableId];
      const draggableLabel = DragUtils.strip(draggable.instance.type.params.alt || draggable.instance.type.params.text) || '?';
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
 * Add retry button to our container.
 */
C.prototype.addRetryButton = function () {
  var that = this;

  this.addButton('try-again', this.options.tryAgain, function () {
    var forceReset = false;          
    if (that.solutionViewed) {
      forceReset = true;
      var keepCorrectAnswers = false;
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
  var selected = (this.$container.find('.h5p-dropped').length) >= this.draggables.length;
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
        self.trigger('resize', {decreaseSize: true});
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

  var scorePoints;
   
  if (!skipVisuals && this.options.behaviour.showScorePoints && !this.options.behaviour.singlePoint && this.options.behaviour.applyPenalties) {
    scorePoints = new H5P.Question.ScorePoints();
  }
  
  this.scoreInline = this.options.behaviour.showScoreInline;
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
  } else { // enableDroppedQuantity Mode.
    for (var i = 0; i < this.dropZones.length; i++) {
      var dropzone = this.dropZones[i];      
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
C.prototype.reTry = function (forceReset, keepCorrectAnswers) {
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
  this.draggables.forEach(draggable => {
    draggable.elements.forEach(element => {
      if (element.$.hasClass('h5p-question-hidden')) {
        element.$.removeClass('h5p-question-hidden');
      }
    })
  });

  //Enables Draggables
  this.enableDraggables();
  
  // IF SHUFFLE/RANDOMIZE DRAGGABLES POSITIONS
  if (self.options.behaviour.randomizeDraggables) {
    this.shuffleDraggables()
  }
 
  //Only reset position and feedback if we are not keeping the correct answers.
  // Do not reset positions if previous state is being restored. WHY NOT? dove
    
  if (this.options.behaviour.enableDroppedQuantity) {
    var nbCorrectDropZones = 0;
    var totalDropZones = 0;
    var task = this.options.question.task;
    task.dropZones.forEach((dropZone, dropZoneId) => {
      if (dropZone.status !== 'none') {
        totalDropZones ++;
      }
      if (dropZone.status == 'correct') {
        nbCorrectDropZones ++;
      }   
			var acceptedNumber = dropZone.acceptedNumber;     
      if (self.options.behaviour.keepCorrectAnswers && !forceReset) {
				var nbOK = 0;
				for (var i = 0; i < this.draggables.length; i++) {
    			var draggable = this.draggables[i];
          if (dropZone.status == 'correct') {
          	nbOK ++;  
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
      if (element.$.hasClass('h5p-correct-quantity')) {
        element.$.addClass('h5p-correct')
      }
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

  this.hasSavedState = false;
  if (this.options.behaviour.enableDroppedQuantity) {
    var $dropZones = self.dropZones; // DOM objects
    for (var i = 0; i < $dropZones.length; i++) {
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
    dropZone.autoAlign();
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
        draggable.elements = draggable.elements.filter(function(n){ return n != undefined });

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

  this.draggables.forEach(draggable => {
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
    draggable.elements.forEach(element => {
      // Remove display of possible +1 / -1 score suffix from element; only keep the correct check mark.
      if (element.$suffix) {
        element.$suffix.remove();
      }

      if (correctDZ) {
        // Hide away multiple elements incorrectly placed, including remaining multiple draggage FIXED JR 31 OCT 2020!
        if (isMultiple && !element.$.hasClass('h5p-correct')) {
          element.$.addClass('h5p-dragquestion h5p-question-hidden');
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
                top: dropZone.y + '%',
              });
              if (element.$.hasClass('h5p-wrong')) {
                element.$.addClass('h5p-question-solution');
              };
              // Add to alignables
              if (dropZone.getIndexOf(element.$) === -1) {
                dropZone.alignables.push(element.$);                
              };
              // maybe not needed ? dove              
              dropZone.autoAlign();
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
            // TODO ???
            dropZone.autoAlign();
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
        element.$
          .removeClass('h5p-wrong')
          .removeClass('h5p-correct')          ;
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
  $( '.h5p-question-explanation').hide();
  
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
      if (dropZones[i].acceptedNumber !== undefined || dropZones[i].acceptedValue !== undefined) {
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
    }
    else {
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
  var max = this.options.behaviour.singlePoint ? this.weight : this.calculateMaxScore();
  return (this.options.behaviour.singlePoint ? this.weight : this.calculateMaxScore());
};

/**
 * Count the number of correct answers.
 * Only works while showing solution.
 *
 * @returns {Number} Points
 */
C.prototype.getScore = function () {
  this.showAllSolutions(true);
  
  var actualPoints = (this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint || this.options.behaviour.enableDroppedQuantity) 
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
    var completedDZ = 0;  
    var $dropZones = self.dropZones; // DOM objects
    task.dropZones.forEach((dropZone, dropZoneId) => {
      var $dropZone = $dropZones[i];
      var acceptedNumber = dropZone.acceptedNumber;
      var status = $dropZone.getCompletedStatus();                                         
      if (status == true) {    
        status = 'correct';
        dropZone.status = status;
        completedDZ++        
      } else {
        status = 'wrong';
        dropZone.status = status;
      }
      if (dropZone.acceptedNumber === undefined && dropZone.acceptedValue === undefined) {
        status = 'none';
        dropZone.status = status;
      }
      $dropZone.markResult(status);      
      i++;            
    });    
    
    // Enable correct or wrong background-color for the draggables, accounting for their opacity.
    for (var i = 0; i < this.draggables.length; i++) {
      var draggable = this.draggables[i];
      if (draggable === undefined) {      
        continue;
      }
      var element = draggable.elements[0];      
      if (element.$.hasClass('h5p-correct-quantity')) {
        element.$.addClass('h5p-correct');
          
      } else if (element.$.hasClass('h5p-incorrect-quantity')) {
        element.$.addClass('h5p-wrong');
      }
      DragUtils.setOpacity(element.$, 'background', draggable.backgroundOpacity);
      
    };
  }
  
  this.scoreViewed = true;  
  var actualPoints = (this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint) 
    ? this.points : this.rawPoints;
  var scoreText = H5P.Question.determineOverallFeedback(this.options.overallFeedback, 
      actualPoints / maxScore).replace('@score', actualPoints).replace('@total', maxScore);
  if (this.options.behaviour.enableDroppedQuantity) {
    var helpText = (this.options.behaviour.enableScoreExplanationQuantity) 
      ? this.options.scoreExplanationQuantity : false;
  } else {
    var helpText = (this.options.behaviour.enableScoreExplanation && this.options.behaviour.applyPenalties) 
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
  var state = {answers: []};
  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }

    var draggableAnswers = [];
    for (var j = 0; j < draggable.elements.length; j++) {
      var element = draggable.elements[j];
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

C.prototype.getTitle = function() {
  return H5P.createTitle(this.options.question.settings.questionTitle);
};

C.prototype.shuffleDraggables = function() {
  // IF SHUFFLE/RANDOMIZE DRAGGABLES POSITIONS
  var self = this;
  var draggablePositions = [];
  // Put current draggables coordinates into an array (except for
  // the multiple draggables which cannot be shuffled at the moment).
  // Check that the draggable does have elements, exclude distracters.
  this.draggables.forEach(draggable => {
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
    if (element.$.hasClass('h5p-dropped')) {
      shuffle = false;
    };
    var x = draggablePositions[i-skipIt][0];
    var y = draggablePositions[i-skipIt][1];
    
    draggable.shufflePosition(shuffle, x, y);
  };
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
var getControls = function (draggables, dropZones, noDropzone) {
  // Initialize controls components
  var controls = {
    drag: new Controls([new UIKeyboard(), new AriaDrag()]),
    drop: new Controls([new UIKeyboard(), new AriaDrop()])
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
  var deselect = function () {
    selected.draggable.trigger('dragend');
    selected.element.$.removeClass('h5p-draggable-hover');
    DragUtils.setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);

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
    }
    else {
      // Put focus on next draggable element
      var $next = selected.draggable.elements[selected.draggable.elements.length - 1].$;
      controls.drag.setTabbable($next[0]);
      $next.focus();
    }
    selected = undefined;
  };

  // Handle draggable selected through keyboard
  controls.drag.on('select', function (event) {
    var result = DragUtils.elementToDraggable(draggables, event.element);
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
    var dropZone = DragUtils.elementToDropZone(dropZones, event.element);
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
