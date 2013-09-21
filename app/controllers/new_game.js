import GameController from 'appkit/controllers/game';

var NewGameController = Ember.Controller.extend({

  needs: ['game'],

  options: GameController.gameTypes,

  actions: {
    makeSelection: function(gameType) {
      this.set('controllers.game.gameType', gameType);
      this.transitionToRoute('select_speed');
    }
  }
});

export default NewGameController;
