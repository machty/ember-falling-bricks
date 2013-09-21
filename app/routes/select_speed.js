var SPEEDS = {
  'Slow': 40,
  'Normal': 60,
  'Fast': 100,
  'Crazy Fast': 150,
  'RAAAAAAA': 220
};

var SelectSpeedRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('options', Ember.keys(SPEEDS));
  },

  actions: {
    makeSelection: function(speedName) {
      this.controller.set('speed', SPEEDS[speedName]);
      this.transitionTo('game.play');
    }
  }
});

export default SelectSpeedRoute;
