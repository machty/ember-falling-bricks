import GameController from 'appkit/controllers/game';

var SelectSpeedController = Ember.Controller.extend({

  needs: ['game'],

  options: GameController.speeds.mapBy('name'),

  actions: {
    makeSelection: function(speed) {
      this.set('controllers.game.speedName', speed);
      this.transitionToRoute('game.play');
    }
  }
});

export default SelectSpeedController;
