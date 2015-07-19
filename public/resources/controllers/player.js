angular.module('OathStructure').controller('PlayerController',  ['$scope','$window', '$interval', 'Deejay', function ($scope, $window, $interval, Deejay) {
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

  message.on('deejay-updated', function(deejay) {
    console.debug('deejay-updated: between songs = ' + deejay.isBetweenSongs())
    if (deejay.isBetweenSongs()) {
      updateProgress({position: 0, total: 1}, false)
    } else if (deejay.isPlaying()) {
      updateProgress({position: deejay.currentPlaybackPosition(), total: deejay.duration()}, true)
    } else if (deejay.isOffAir()) {
      updateProgress({position: 1, total: 1}, false)
    } else if (deejay.isPaused()) {
      updateProgress({position: deejay.currentPlaybackPosition(), total: deejay.duration()}, false)
    }
  })

  $interval(function() {
    if (Deejay.isPlaying() && !Deejay.isBetweenSongs()) {
      updateProgress({position: Deejay.currentPlaybackPosition(), total: Deejay.duration()}, true)
    }
  }, 1000)

  function updateProgress(progress, animate) {
    var lookahead = animate ? 1 : 0
    var fraction = (progress.position + lookahead) / progress.total
    $('.scrubber-fill').css('transition', animate ? '1s linear' : '0s')
    $('.scrubber-fill').css('transform', 'scaleX('+fraction+')')
  }
}])
