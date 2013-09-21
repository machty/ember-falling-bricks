var SPEEDS = {
  'Slow': 40,
  'Normal': 80,
  'Fast': 140,
  'Crazy Fast': 200,
  'RAAAAAAA': 300
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
