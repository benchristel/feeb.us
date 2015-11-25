angular.module('OathStructure').controller('PlayerController',  ['$scope','$window', '$interval', '$timeout', 'Deejay', function ($scope, $window, $interval, $timeout, Deejay) {
  $scope.play = function() {
    Deejay.play()
  }

  $scope.pause = function() {
    Deejay.pause()
  }

  $scope.forward = function(){
    Deejay.skipThisSong()
  }

  $scope.stop = function(){
    Deejay.goOffAir()
  }

  $scope.back = function(){
    message.send("back")
  }

  $scope.seekTo = function(event){
    Deejay.seekTo(event.offsetX/angular.element($window).width())
    updateProgress({position: event.offsetX, total: angular.element($window).width()}, false)
  }

  $scope.playing = function() {
    return Deejay.isDoingStuff()
  }

  $scope.currentSong = function() {
    return Deejay.getCurrentSong()
  }

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState == "visible" ){
      updateProgress({position: Deejay.currentPlaybackPosition(), total: Deejay.duration()})
      window.setTimeout(function () {
        manageProgress(Deejay);
      }, 0)

      console.log(document.visibilityState)
    }
  });

  message.on('deejay-updated', function(deejay) {
    manageProgress(deejay);
  })

  function manageProgress(deejay) {
    if (deejay.isBetweenSongs()) {

      console.log("Got called....")
      updateProgress({position: 0, total: 1})

    } else if (deejay.isPlaying()) {
      var remainingTime = deejay.duration() - deejay.currentPlaybackPosition()
      console.log("resetting to time " + deejay.currentPlaybackPosition())
      updateProgress({position: deejay.currentPlaybackPosition(), total: deejay.duration()})
      $timeout(function() {
        $('.scrubber-fill').css('transition', remainingTime + 's linear')
        $('.scrubber-fill').css('transform', 'scaleX(1)')
      }, 0)
    } else if (deejay.isOffAir()) {
      console.log("Animate to offAir new")
      updateProgress({position: 1, total: 1.0000001})//Crazy css transform bug. Using 1 causes nothing to happen, sometimes.
    } else if (deejay.isPaused()) {
      updateProgress({position: deejay.currentPlaybackPosition(), total: deejay.duration()})
    }
  }

  function updateProgress(progress) {
    var fraction = (progress.position) / progress.total
    console.debug("fraction: " + fraction)
    $('.scrubber-fill').css('transition', '0s')
    $('.scrubber-fill').css('transform', 'scaleX('+fraction+')')
  }
}])
