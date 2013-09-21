var NewGameController = Ember.Controller.extend({

  needs: ['game'],

  options: Ember.computed.alias('controllers.game.gameTypes'),

  actions: {
    makeSelection: function(gameType) {
      this.set('controllers.game.gameType', gameType);
      this.transitionToRoute('select_speed');
    }
  }
});

export default NewGameController;
