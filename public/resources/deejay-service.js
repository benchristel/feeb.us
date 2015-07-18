angular.module('OathStructure').service('Deejay', ['$rootScope', function($rootScope) {
  var PAUSED = 0
  var PLAYING = 1
  var BETWEEN_SONGS = 2

  var onAir = false;
  var paused = false;
  var betweenSongs = false;
  var currentSong = null;
  var deejay = this

  var player

  this.pause = function() {
    player.pauseVideo()
  }

  this.play = function() {
    player.playVideo()
  }

  this.goOnAir = function() {
    if (!onAir) {
      onAir = true
      notify()
    }
  }

  this.goOffAir = function() {
    onAir = false
    currentSong = null
    stopVideo()
    notify()
  }

  this.fromTheTop = function(song) {
    currentSong = song
    this.goOnAir()
    player.cueVideoById(song.youtubeId)
    player.playVideo()
  }

  this.skipThisSong = function() {
    currentSong = null
    notify()
  }

  this.needsSong = function() {
    return onAir && !currentSong
  }

  this.isPlaying = function() {
    return onAir && !paused
  }

  this.isPaused = function() {
    return onAir && paused
  }

  this.isOnAir = function() {
    return onAir
  }

  this.isBetweenSongs = function() {
    return onAir && betweenSongs
  }

  this.getCurrentSong = function() {
    return currentSong
  }

  this.currentPlaybackPosition = function() {
    return player && player.getCurrentTime && player.getCurrentTime()
  }

  this.duration = function() {
    return player && player.getDuration && player.getDuration()
  }

  this.seekTo = function(fraction){
    var seconds = Math.round(player.getDuration() * fraction)
    player.seekTo(seconds, true)
  }

  function stopVideo() {
    player.pauseVideo()
    player.cueVideoById('')
  }

  function notify() {
    message.send('deejay-updated', deejay)
  }

  function youtubeIsReady() {
    player = new YT.Player(
      'youtube-player-1',
      {
        height: '195',
        width: '320',
        // videoId: 'au3-hk-pXsM',
        playerVars: { rel: 0, controls: 0 },
        events: {
          // 'onReady': readyPlayer1,
          'onStateChange': playerStateChanged
        }
      }
    )
  }
  message.on('youtube-iframe-api-ready', youtubeIsReady)

  //function sendProgressUpdate() {
  //  if (betweenSongs) return
  //  if (player && player.getCurrentTime && player.getDuration) {
  //    message.send('song-progress', {position: player.getCurrentTime(), total: player.getDuration()})
  //  }
  //}
  //window.setInterval(sendProgressUpdate, 1000)

  function playerStateChanged(event) {
    switch(event.data) {
      case YT.PlayerState.UNSTARTED:
        console.debug("YT unstarted")
        betweenSongs = true
        paused = false
        break
      case YT.PlayerState.BUFFERING:
        console.debug("YT buffering")
        paused = false
        break
      case YT.PlayerState.PLAYING:
        console.debug("YT playing")
        paused = false
        betweenSongs = false
        break
      case YT.PlayerState.PAUSED:
        console.debug("YT paused")
        paused = true
        break
      case YT.PlayerState.ENDED:
        console.debug("YT ended")
        paused = false
        betweenSongs = true
        currentSong = null
        break
    }
    $rootScope.$apply(notify)
  }
}])
