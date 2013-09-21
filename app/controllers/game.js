var GameController = Ember.Controller.extend({

  gameTypes: ['Quickplay', 'Endless'],
  speeds: ['Slow', 'Normal', 'Adept', 'Fury', 'Gentle Rain'],

  gameType: null,
  speed: null
});

export default GameController;
