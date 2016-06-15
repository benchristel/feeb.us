angular.module('OathStructure').service('TitleChanger', ['$rootScope', '$window', 'Deejay', function($rootScope, $window, Deejay) {

  var docTitle = document.title
  var change = false;
  var currentSong = Deejay.getCurrentSong

  document.addEventListener('visibilitychange', function(){
    if (document.title === docTitle){
      change = true;
      if (currentSong() !== null) titleChanger(currentSong().title)
    }else{
      change = false;
      document.title = docTitle
    }
  })

  function titleChanger(text) {
    if (currentSong() && change){
      document.title = text;
      setTimeout(function () {
        if (text == currentSong().artist){
          titleChanger(currentSong().title);
        }else {
          titleChanger(currentSong().artist);
        }
      }, 4000);
    }
  }

}])
