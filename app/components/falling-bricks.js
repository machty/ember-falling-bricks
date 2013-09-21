import Brick from 'appkit/models/brick';

var TOUCH_ENABLED = ('ontouchstart' in document.documentElement);

var requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

var BRICK_HEIGHT = 55,
    FALLING_BRICK_MARGIN = 15,
    STACK_SIZE = 10,
    FULL_STACK_SIZE = (BRICK_HEIGHT) * STACK_SIZE,
    TOP_GUTTER_HEIGHT = 130,
    TOTAL_HEIGHT = FULL_STACK_SIZE + TOP_GUTTER_HEIGHT,
    FAST_FALL_SPEED = 900;

var FallingBricksComponent = Ember.Component.extend({

  classNames: ['falling-bricks'],

  gameState: null,

  userLost: false,

  bricks: Ember.computed.alias('gameState.bricks'),
  speed: Ember.computed.alias('gameState.speed'),
  isPlaying: Ember.computed.alias('gameState.isPlaying'),

  initTicker: function() {
    var self = this;
    this._tick = function(timestamp) {
      Ember.run(self, 'tick', timestamp);
    };
  }.on('init'),

  setupContainerStyle: function() {
    this.$('ul.bricks').height(TOTAL_HEIGHT);
  }.on('didInsertElement'),

  addBrickIfNecessary: function() {
    var bricks = this.get('bricks');

    if (bricks.length >= STACK_SIZE) { return; }

    var lastBrick = bricks.get('lastObject');
    if (!lastBrick ||
        TOTAL_HEIGHT - lastBrick.distanceFromBottom >= BRICK_HEIGHT + FALLING_BRICK_MARGIN) {
      bricks.pushObject(Brick.create({
        distanceFromBottom: TOTAL_HEIGHT
      }));
    }
  },

  tick: function(timestamp) {
    if (!this.get('isPlaying')) { return; }

    // Schedule the next tick to fire.
    requestAnimationFrame(this._tick);

    var lastTimestamp = this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Skip the first tick; we need to know the time elapsed
    // since ticks in order to calculate how much bricks
    // should move.
    if (!lastTimestamp) { return; }

    var timeElapsed = timestamp - lastTimestamp,
        speed = this.get('speed'),
        secondsElapsed = timeElapsed / 1000,
        slowDistanceDropped = secondsElapsed * speed,
        fastDistanceDropped = secondsElapsed * FAST_FALL_SPEED;

    this.addBrickIfNecessary();

    var isCollapsing = false,
        groupsPresent = false;

    this.get('bricks').forEach(function(brick, i, bricks) {
      var lastBrick = (i > 0) ? bricks[i-1] : null,
          minimumDistanceFromBottom = lastBrick ? lastBrick.distanceFromBottom + BRICK_HEIGHT : 0;

      var newDistanceFromBottom;
      if (brick.color) {
        newDistanceFromBottom = Math.max(minimumDistanceFromBottom,
                                         brick.distanceFromBottom - fastDistanceDropped);

        if (isCollapsing || newDistanceFromBottom > minimumDistanceFromBottom) {
          isCollapsing = true;

          // Bricks become ungrouped when collapsing.
          brick.set('grouped', false);
        } else {
          if (lastBrick && brick.color && lastBrick.color === brick.color) {
            lastBrick.set('grouped', true);
            brick.set('grouped', true);
            groupsPresent = true;
          }
        }
      } else {

        if (brick.hasLanded) {
          newDistanceFromBottom = Math.max(minimumDistanceFromBottom,
                                           brick.distanceFromBottom - fastDistanceDropped);
        } else {
          newDistanceFromBottom = Math.max(minimumDistanceFromBottom,
                                           brick.distanceFromBottom - slowDistanceDropped);
        }

        if (newDistanceFromBottom === minimumDistanceFromBottom) {
          brick.set('hasLanded', true);
        } else {
          isCollapsing = true;
        }
      }

      brick.set('distanceFromBottom', newDistanceFromBottom);
      lastBrick = brick;
    });

    // Check if the user has lost.
    if (!isCollapsing && !groupsPresent) {
      this.set('isPlaying', false);
      Ember.run.later(this, 'sendAction', 'gameOver', 800);
    }
  },

  isPlayingDidChange: function() {
    if (this.get('isPlaying')) {
      // Start the loop timer
      requestAnimationFrame(this._tick);
    } else {
      // Clear out the previous timestamp.
      this.lastTimestamp = null;
    }
  }.observes('isPlaying').on('didInsertElement'),

  getNewColor: function() {
    Ember.run.schedule('afterRender', this, function() {
      // Animate upcoming colors.
      var shiftAmount = "35px";
      var $upcomingColors = this.$('.upcoming-colors ul');

      $upcomingColors.addClass('notransition')
                     .css({ top: '-' + shiftAmount });

      $upcomingColors.height(); // flush
      $upcomingColors.removeClass('notransition').css({ top: '0px'});
      $upcomingColors.find('li').last().addClass('next-up');
    });
    return this.get('gameState').popColor();
  },

  actions: {
    brickWasSelected: function(brick) {
      if (brick.grouped) {
        var bricks = this.get('bricks'),
            brickIndex = bricks.indexOf(brick);

        var endIndex = brickIndex + 1;
        while (endIndex < bricks.length &&
               bricks[endIndex].color === brick.color) {
          ++endIndex;
        }

        while (brickIndex >= 0 && bricks[brickIndex].color === brick.color) {
          --brickIndex;
        }
        brickIndex += 1;

        // Absorb a gray from each end.
        if (brickIndex > 0 && !bricks[brickIndex - 1].color) {
          --brickIndex;
        }

        var nextBrick = bricks[endIndex];
        if (nextBrick && nextBrick.hasLanded && !nextBrick.color) {
          ++endIndex;
        }

        bricks.removeAt(brickIndex, endIndex - brickIndex);
      } else if (!brick.color && !brick.hasLanded) {
        brick.set('color', this.getNewColor());
      }
    }
  },

  brickCollectionView: Ember.CollectionView.extend({
    tagName: 'ul',
    classNames: ['bricks'],

    itemViewClass: Ember.View.extend(Ember.ViewTargetActionSupport, {
      brick: Ember.computed.alias('content'),
      actionContext: Ember.computed.alias('brick'),
      action: 'brickWasSelected',

      classNameBindings: [':brick', 'brick.grouped', 'brick.color:selected', 'brick.hasLanded'],
      attributeBindings: ['style'],
      style: function() {
        var brick = this.get('brick');

        return (brick.color ? "background-color: " + brick.color + "; " : "" ) +
               "bottom: " + Math.floor(brick.distanceFromBottom) + "px; " +
               //"-webkit-transform: translateY(" + (TOTAL_HEIGHT - brick.distanceFromBottom - BRICK_HEIGHT) + "px); " +
               "height: " + BRICK_HEIGHT + "px; ";
      }.property('brick.color', 'brick.distanceFromBottom'),

      mouseDown: function() {
        if (!TOUCH_ENABLED) {
          this.triggerAction();
        }
      },

      touchStart: function(e) {
        if (TOUCH_ENABLED) {
          e.preventDefault();
          this.triggerAction();
        }
      }
    })
  })
});

export default FallingBricksComponent;
