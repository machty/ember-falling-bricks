var SelectSpeedController = Ember.Controller.extend({

  needs: ['game'],

  options: Ember.computed.alias('controllers.game.speeds'),

  actions: {
    makeSelection: function(speed) {
      this.set('controllers.game.gameType', speed);
      this.transitionToRoute('play');
    }
  }
});

export default SelectSpeedController;
