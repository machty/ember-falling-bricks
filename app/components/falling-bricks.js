import Brick from 'appkit/models/brick';

var requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

var BRICK_HEIGHT = 40,
    FALLING_BRICK_MARGIN = 15,
    STACK_SIZE = 10,
    FULL_STACK_SIZE = (BRICK_HEIGHT + FALLING_BRICK_MARGIN) * STACK_SIZE,
    TOP_GUTTER_HEIGHT = 200,
    TOTAL_HEIGHT = FULL_STACK_SIZE + TOP_GUTTER_HEIGHT,
    FAST_FALL_SPEED = 300;

var FallingBricksComponent = Ember.Component.extend({

  gameState: null,
  
  bricks: Ember.computed.alias('gameState.bricks'),

  initTicker: function() {
    var self = this;
    this._tick = function(timestamp) {
      Ember.run(self, 'tick', timestamp);
    };
  }.on('init'),

  setupContainerStyle: function() {
    this.$('ul.bricks').height(TOTAL_HEIGHT);
  }.on('didInsertElement'),

  reset: function() {
    this.setProperties({
      lastTimestamp: null
      //bricks: "       ".split('').map(function(_, i) { return Brick.create({
        //distanceFromBottom: (i + 1) * 50
      //}); })
    });
  }.on('init'),

  tick: function(timestamp) {
    if (!this.isPlaying) { return; }

    // Schedule the next tick to fire.
    requestAnimationFrame(this._tick);

    var lastTimestamp = this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Skip the first tick; we need to know the time elapsed
    // since ticks in order to calculate how much bricks
    // should move.
    if (!lastTimestamp) { return; }

    var gameState = this.get('gameState'),
        timeElapsed = timestamp - lastTimestamp,
        speed = gameState.get('speed'),
        secondsElapsed = timeElapsed / 1000,
        slowDistanceDropped = secondsElapsed * speed,
        fastDistanceDropped = secondsElapsed * FAST_FALL_SPEED;

    var isCollapsing = false;
    gameState.get('bricks').forEach(function(brick, i, bricks) {
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
          if (lastBrick && lastBrick.color === brick.color) {
            lastBrick.set('grouped', true);
            brick.set('grouped', true);
          }
        }
      } else {
        newDistanceFromBottom = Math.max(minimumDistanceFromBottom,
                                         brick.distanceFromBottom - slowDistanceDropped);
        if (newDistanceFromBottom === minimumDistanceFromBottom) {
          brick.set('hasLanded', true);
        }
      }

      brick.set('distanceFromBottom', newDistanceFromBottom);
      lastBrick = brick;
    });
  },

  isPlayingDidChange: function() {
    if (this.isPlaying) {
      // Start the timer
      requestAnimationFrame(this._tick);
    } else {
      // Clear out the previous timestamp.
      this.lastTimestamp = null;
    }
  }.observes('isPlaying').on('didInsertElement'),

  brickCollectionView: Ember.CollectionView.extend({
    tagName: 'ul',
    classNames: ['bricks'],

    itemViewClass: Ember.View.extend({
      brick: Ember.computed.alias('content'),

      classNameBindings: [':brick', 'brick.grouped', 'brick.color:selected', 'brick.hasLanded'],
      attributeBindings: ['style'],
      style: function() {
        var brick = this.get('brick');

        return (brick.color ? "background-color: " + brick.color + "; " : "" ) +
               "bottom: " + Math.floor(brick.distanceFromBottom) + "px; " +
               "height: " + BRICK_HEIGHT + "px; ";
      }.property('brick.color', 'brick.distanceFromBottom'),

      click: function() {
        var brick = this.get('brick');

        if (brick.grouped) {
          // Check if this stacked block that can be removed.
        } else if (!brick.color && !brick.hasLanded) {
          this.set('content.color', 'red');
        }
      }
    })
  })
});

export default FallingBricksComponent;
