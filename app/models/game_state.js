var GameState = Ember.Object.extend({
  bricks: null,
  speed: null,
  score: null,
  gameType: null,
  isPlaying: false,

  reset: function() {
    this.setProperties({
      bricks: [],
      score: 0,
      isPlaying: false
    });
  }.on('init')
});

export default GameState;
