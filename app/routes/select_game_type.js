var SelectGameTypeRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('options', ['Quickplay', 'Endless']);
  },

  actions: {
    makeSelection: function(gameType) {
      this.controller.set('gameType', gameType);
      this.transitionTo('select_speed');
    }
  }
});

export default SelectGameTypeRoute;

