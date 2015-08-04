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
    this.goOnAir()
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
    //Is there supposed to be a notify here?
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

  this.setCurrentSong = function(song){
    currentSong = song
    player.cueVideoById(song.youtubeId)

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
    player.cueVideoById(null)
  }

  function notify() {
    message.send('deejay-updated', deejay)
  }

  function youtubeIsReady() {
    console.log("I was called")
    player = new YT.Player(
      'youtube-player',
      {
        height: '195',
        width: '320',
        playerVars: { rel: 0, controls: 0 },
        events: {
          'onStateChange': playerStateChanged
        }
      }
    )
    if (!player){
      console.log("player didn't load?")
    }
  }
  message.on('youtube-iframe-api-ready', function(){
    console.log("received message")
    youtubeIsReady()
  })

  function playerStateChanged(event) {
    if (deejay.isOffAir()) return

    if (event.data === YT.PlayerState.ENDED) {
      currentSong = null
    }

    var states = {}
    states[YT.PlayerState.UNSTARTED] = BETWEEN_SONGS
    states[YT.PlayerState.BUFFERING] = PAUSED
    states[YT.PlayerState.PLAYING]   = PLAYING
    states[YT.PlayerState.PAUSED]    = PAUSED
    states[YT.PlayerState.ENDED]     = BETWEEN_SONGS
    states[YT.PlayerState.CUED]      = BETWEEN_SONGS

    state = states[event.data]
    console.debug('updated state: ' + state)

    $rootScope.$apply(notify)
  }
}])
