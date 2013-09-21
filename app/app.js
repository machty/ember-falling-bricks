import Resolver from 'resolver';
import router from 'appkit/router';

var App = Ember.Application.create({
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver,
  Router: Ember.Router.extend({
    router: router,
    location: 'none'
  })
});

// Quick hack to get rid of ios address bar.
function hideAddressBar()
{
  if (!window.location.hash) {
    if (document.height < window.outerHeight) {
      document.body.style.height = (window.outerHeight + 50) + 'px';
    }
    setTimeout( function(){ window.scrollTo(0, 1); }, 50);
  }
}

window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
window.addEventListener("orientationchange", hideAddressBar );

export default App;
