var router = Ember.Router.map(function(){
  // implicit IndexRoute

  this.route('new_game');
  this.route('achievements');
  this.route('how_to_play');

  this.route('select_speed');

  this.resource('game', function() {
    this.route('play');
    this.route('pause');
  });
});

export default router;
