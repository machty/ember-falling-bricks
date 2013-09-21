var GameController = Ember.Controller.extend({

  gameType: null,
  speedName: null,

  speed: function() {
    // Why is toString necessary? Seems to be in class form otherwise
    return GameController.speeds.findProperty('name', this.get('speedName').toString());
  }.property('speed'),

  isPlaying: false,

  _lastTimestamp: null,
  _lastBrickAddTime: null,

  brickAddInterval: Ember.computed.alias('speed.brickAddInterval'),
  brickSpeed: Ember.computed.alias('speed.brickSpeed'),
  bricks: null,
});

GameController.reopenClass({
  gameTypes: ['Quickplay', 'Endless'],

  speeds: [
    {
      name: 'Slow',
      brickAddInterval: 2000,
      brickSpeed: 20
    },
    {
      name: 'Normal',
      brickAddInterval: 2000,
      brickSpeed: 20
    },
    {
      name: 'Adept',
      brickAddInterval: 2000,
      brickSpeed: 20
    },
    {
      name: 'Fury',
      brickAddInterval: 2000,
      brickSpeed: 20
    },
    {
      name: 'Gentle Rain',
      brickAddInterval: 2000,
      brickSpeed: 20
    }
  ]
});

export default GameController;
