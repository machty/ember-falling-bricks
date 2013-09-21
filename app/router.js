var router = Ember.Router.map(function(){
  this.route('select_game_type');
  this.route('select_speed');

  this.route('instructions');

  this.resource('game', function() {
    this.route('play');
    this.route('pause');
  });

  this.route('game_over');
});

export default router;
