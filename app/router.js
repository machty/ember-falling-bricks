var router = Ember.Router.map(function(){
  this.route('select_game_type');
  this.route('select_speed');

  this.route('achievements');
  this.route('how_to_play');

  this.resource('game', function() {
    this.route('play');
    this.route('pause');
  });
});

export default router;
