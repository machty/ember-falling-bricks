var GamePauseRoute = Ember.Route.extend({

  // Re-use the parent GameController for this route.
  controllerName: 'game',

  renderTemplate: function(controller) {
    this.render('game/pause', {
      outlet: 'pause',
      controller: controller
    });
  }
});

export default GamePauseRoute;

