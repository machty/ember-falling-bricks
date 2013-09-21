var requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

var FallingBricksComponent = Ember.Component.extend({

  initTicker: function() {
    var self = this;
    this._tick = function(timestamp) {
      self.tick(timestamp);
    };
  }.on('init'),

  reset: function() {
    this.setProperties({
      _lastTimestamp: null,
      _lastBrickAddTime: null,
      bricks: []
    });
  }.on('init'),

  tick: function(timestamp) {
    if (!this.isPlaying) { return; }
    console.log('ticking ' + timestamp);

    requestAnimationFrame(this._tick);
  },

  isPlayingDidChange: function() {
    if (this.isPlaying) {
      // Start the timer
      requestAnimationFrame(this._tick);
    }
  }.observes('isPlaying').on('didInsertElement')





});

export default FallingBricksComponent;
