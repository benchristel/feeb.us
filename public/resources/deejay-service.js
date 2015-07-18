angular.module('OathStructure').service('Deejay', ['$rootScope', function($rootScope) {
  var OFF_AIR = 0
  var PAUSED = 1
  var PLAYING = 2
  var BETWEEN_SONGS = 3

  var state = OFF_AIR
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
    if (this.isOffAir()) {
      state = BETWEEN_SONGS
      notify()
    }
  }

  this.goOffAir = function() {
    state = OFF_AIR
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
    return this.isOnAir() && !currentSong
  }

  this.isPlaying = function() {
    return state === PLAYING
  }

  this.isDoingStuff = function() {
    return state === PLAYING || state === BETWEEN_SONGS
  }

  this.isPaused = function() {
    return state === PAUSED
  }

  this.isOnAir = function() {
    return state !== OFF_AIR
  }

  this.isOffAir = function() {
    return state === OFF_AIR
  }

  this.isBetweenSongs = function() {
    return state === BETWEEN_SONGS
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

  function playerStateChanged(event) {
    if (event.data === YT.PlayerState.ENDED) {
      currentSong = null
    }

    var states = {}
    states[YT.PlayerState.UNSTARTED] = BETWEEN_SONGS
    states[YT.PlayerState.BUFFERING] = PLAYING
    states[YT.PlayerState.PLAYING]   = PLAYING
    states[YT.PlayerState.PAUSED]    = PAUSED
    states[YT.PlayerState.ENDED]     = BETWEEN_SONGS
    states[YT.PlayerState.CUED]      = BETWEEN_SONGS

    state = states[event.data]
    console.debug('updated state: ' + state)

    $rootScope.$apply(notify)
  }
}])
