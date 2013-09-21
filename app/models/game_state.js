var COLORS = ['red', 'blue', 'green', 'yellow'],
    COLOR_QUEUE_SIZE = 6;

var GameState = Ember.Object.extend({
  bricks: null,
  speed: null,
  score: null,
  gameType: null,
  upcomingColors: null,
  isPlaying: false,

  reset: function() {
    this.setProperties({
      bricks: [],
      score: 0,
      isPlaying: false,
      upcomingColors: []
    });

    for (var i = 0; i < COLOR_QUEUE_SIZE; ++i) {
      this.upcomingColors.pushObject(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
  }.on('init'),

  popColor: function() {
    this.upcomingColors.unshiftObject(COLORS[Math.floor(Math.random() * COLORS.length)]);
    return this.upcomingColors.popObject();
  }
});

export default GameState;
