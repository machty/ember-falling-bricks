var COLORS = ['red', 'blue', 'green', 'yellow'];

var Brick = Ember.Object.extend({
  color: null,
  grouped: false,
  hasLanded: false,

  distanceFromBottom: null

  //applyDefaultColor: function() {
    //if (!this.color) {
      //this.set('color', COLORS[Math.floor(Math.random() * COLORS.length)]);
    //}
  //}.on('init')
});

export default Brick;
