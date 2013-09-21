import GameState from 'appkit/models/game_state';

var GameRoute = Ember.Route.extend({
  model: function() {
    return GameState.create({
      speed: this.controllerFor('select_speed').speed,
      gameType: this.controllerFor('select_game_type').gameType
    });
  }
});

export default GameRoute;
