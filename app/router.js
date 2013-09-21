var router = Ember.Router.map(function(){
  // implicit IndexRoute

  this.route('new_game');
  this.route('achievements');
  this.route('how_to_play');

  this.route('select_speed');
});

export default router;
