import DragUtils from './drag-utils';

const $ = H5P.jQuery;

export default class DropZone {
  /**
   * Creates a new drop zone instance.
   * Makes it easy to keep track of all instance variables.
   *
   * @param {Object} dropZone
   * @param {Number} id
   * @param {string[]} l10n
   * @returns {_L8.DropZone}
   */
  constructor (dropZone, id, l10n) {
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
    self.acceptedValue = dropZone.acceptedValue;
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
  appendTo($container, draggables) {
    var self = this;

    // Prepare inner html with prefix for good a11y
    var html = '<div class="h5p-inner" style="color:' + self.dropzonebordercolor + ';"></div>';
    var extraClass = '';
    if (self.showLabel) {
      html = '<div class="h5p-label">' + self.label + '<span class="h5p-hidden-read"></span></div>' + html;
      extraClass = ' h5p-has-label';
    }
    html = '<span class="h5p-hidden-read">' + (self.l10n.prefix.replace('{num}', self.id + 1)) + '</span>' + html;

    var opacity = self.backgroundOpacity / 100;
    var style = self.background;
    style = DragUtils.setAlphas(style, 'rgba(', opacity); // Update rgba
    style = DragUtils.setAlphas(style, 'rgb(', opacity); // Convert rgb

    // Create drop zone element
    self.$dropZone = $('<div/>', {
      class: 'h5p-dropzone' + extraClass,
      tabindex: '-1',
      title: self.showLabel ? $('<div/>', {html: self.label}).text() : null,
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
    })
      .appendTo($container)
      .children('.h5p-inner')
        .droppable({
          activeClass: 'h5p-active',
          tolerance: 'intersect',
          accept: function (element) {
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
            var result = DragUtils.elementToDraggable(draggables, element);

            // Found no Draggable that the element belongs to. Don't accept it.
            if (!result) {
              return false;
            }

            // Figure out if the drop zone will accept the draggable
            return self.accepts(result.draggable, draggables);
          },
          drop: function (event, ui) {
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
            style = DragUtils.setAlphas(style, 'rgba(', opacity); // Update rgba
            style = DragUtils.setAlphas(style, 'rgb(', opacity); // Convert rgb
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
          over: function () {
            DragUtils.setOpacity($(this).addClass('h5p-over'), 'background', self.backgroundOpacity);
          },
          out: function () {
            DragUtils.setOpacity($(this).removeClass('h5p-over'), 'background', self.backgroundOpacity);
          }
        })
        .end()
      .focus(function () {
        if ($tip instanceof H5P.jQuery) {
          $tip.attr('tabindex', '0');
        }
      })
      .blur(function () {
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
      DragUtils.setOpacity(self.$dropZone.children('.h5p-label'), 'background', self.backgroundOpacity);
      DragUtils.setOpacity(self.$dropZone.children('.h5p-inner'), 'background', self.backgroundOpacity);
    }, 0);
  }

  /**
   * Help determine if the drop zone can accept this draggable
   */
  accepts(draggable, draggables) {
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
          currentDraggable.elements.forEach(element => {
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
  getIndexOf($alignable) {
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
  removeAlignable($alignable) {
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
  autoAlign() {
    var self = this;
    // Determine container size in order to calculate percetages
    // TODO JR does not work as expected in contracts (i.e. drag & drop activity within Course Presentation or Quiz)
    var containerSize = self.$dropZone.parent()[0].getBoundingClientRect();

    // Calcuate borders and spacing values in percetage
    var spacing = {
      x: (self.autoAlignable.spacing / self.autoAlignable.size.width) * 100,
      y: (self.autoAlignable.spacing / self.autoAlignable.size.height) * 100
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
      x: dropZoneSize.width - (spacing.x * 2),
      y: dropZoneSize.height - (spacing.y * 2)
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
    var alignElement = function () {
      // Position element at current spot
      $alignable.css({
        left: pos.x + '%',
        top: pos.y + '%'
      });
      self.trigger('elementaligned', $alignable);

      // Update horizontal space left + next position
      var spaceDiffX = (alignableSize.width + self.autoAlignable.spacing);
      spaceLeft.x -= spaceDiffX;
      pos.x += (spaceDiffX / containerSize.width) * 100;
      // Keep track of the highest element in this row
      var spaceDiffY = (alignableSize.height + self.autoAlignable.spacing);
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
      }
      else {
        // Did not fit, try next row

        // Reset X values
        spaceLeft.x = space.x;
        pos.x = self.x + spacing.x;

        // Bump Y values
        if (currentRowHeight) {
          // Update Y space and position according to previous row height
          spaceLeft.y -= currentRowHeight;
          pos.y += (currentRowHeight / containerSize.height) * 100;

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
  highlight() {
    this.$dropZone.attr('aria-disabled', 'false').children('.h5p-inner').addClass('h5p-active');
  }

  /**
   * De-highlight the current drop zone
   */
  dehighlight() {
    this.$dropZone.attr('aria-disabled', 'true').children('.h5p-inner').removeClass('h5p-active');
    this.$dropZone.children('.h5p-inner').css('color', 'red');
  }

  /**
   * Mark the current drop zone correct/wrong.
   */
  markResult(status) {
    this.$dropZone.children('.h5p-inner').addClass('h5p-dropzone-' + status + '-answer');
  }
  
  /**
   * REmove the current drop zone correct/wrong mark.
   */
  unmarkResult() {
    this.$dropZone.children('.h5p-inner').removeClass('h5p-dropzone-correct-answer h5p-dropzone-wrong-answer');
    this.$dropZone.removeClass('h5p-dropzone-completed-answer');
  }  

  /**
   * Mark the current drop zone completed.
   */
  markCompleted() {
    this.$dropZone.addClass('h5p-dropzone-completed-answer');
  }
  unMarkCompleted() {
    this.$dropZone.removeClass('h5p-dropzone-completed-answer');
  }

  getCompletedStatus() {
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
  
  results(draggables, solutions, scorePoints) {
    var self = this;
    var points = 0;
    var nbDraggablesInZone = 0;
    var nbPlacedDraggables = 0;
    var totalValue = 0;
    var completed = false;
    var acceptedNumber = self.acceptedNumber;
    var acceptedValue = self.acceptedValue;
    var dropZoneId = self.id;
    var solutions = solutions[dropZoneId];
    var oknb = false;
    var okval = false;
    // Do not mark elements inside a dropzone with undefined quantity OR undefined value either correct or wrong.
    if (acceptedNumber === undefined && acceptedValue === undefined) {      
      completed = undefined;
      self.unmarkResult();
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
      nbDraggablesInZone ++;
      var dragId = draggable.id;
      var dragVal = draggable.value;
      var dragOkDZ = $.inArray(dragId, solutions);
      var oknb = false;
      if (nbPlacedDraggables > acceptedNumber) {
        continue;
      }
      if (dragOkDZ !== -1) {
        nbPlacedDraggables ++;
        totalValue += dragVal;                        
      }
      if (acceptedNumber == undefined && totalValue == acceptedValue) {
        oknb = true;                                                                                                                                  
      }
      if (acceptedValue === undefined && nbPlacedDraggables == acceptedNumber) {
        okval = true; 
      }      
      if (dragOkDZ !== -1 && (nbPlacedDraggables == acceptedNumber || oknb) && (totalValue == acceptedValue || okval) && completed == false) {
        completed = true;
        self.markCompleted();                
      } else {                                      
        completed = false;
        self.unMarkCompleted();                                                                                              
      }
    } 
    // Use case of empty dropZone expecting 0 draggables!   
    if (nbDraggablesInZone === 0 && acceptedNumber === 0) {               
      self.markCompleted();
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
        // Just in case it was previously added and element was moved away from dz!
        if (element.dropZone === undefined) {
          element.$.removeClass('h5p-correct-quantity h5p-incorrect-quantity');
        }
        continue;
      }
      element.$.removeClass('h5p-correct-quantity h5p-incorrect-quantity');
      if (completed == true) {
        element.$.addClass('h5p-correct-quantity');          
      } else if (completed == false) {
        element.$.addClass('h5p-incorrect-quantity');
      }
    }
    if (completed === undefined) {
      self.unmarkResult();
    }                   
    if (completed === true) {
      return 1;      
    } else {                    
      return 0;
    }
  }
}
