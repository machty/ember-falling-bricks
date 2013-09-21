var SPEEDS = {
  'Slow': 20,
  'Normal': 30,
  'Fast': 40,
  'Crazy Fast': 50,
  'RAAAAAAA': 60
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
