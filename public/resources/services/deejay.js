angular.module('OathStructure').service('Deejay', ['$rootScope', '$window', function($rootScope, $window) {
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
      notify("go on air")
    }
  }

  this.goOffAir = function() {
    state = OFF_AIR
    currentSong = null
    stopVideo()
    notify("go off air")
  }

  this.fromTheTop = function(song) {
    currentSong = song
    console.log("Song Name: " + song.title)
    console.log("Song ID: " +song.youtubeId)
    this.goOnAir()
    player.loadVideoById(song.youtubeId)

    console.log("Playing new song from the top")
    $window.ga('send', 'event', 'Video', 'play')
    // titleScroller(song, song.title);

    //Is there supposed to be a notify here?
  }



  this.skipThisSong = function() {
    currentSong = null
    notify(" skip song")
  }

  this.needsSong = function() {
    console.log("Current song = " + currentSong)
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

  function notify(caller) {
    caller = typeof caller !== 'undefined' ? caller : "default";
    console.log(caller)
    console.log("deejay-updated: "+state+" "+deejay.currentPlaybackPosition())
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
          'onStateChange': playerStateChanged,
          'onError': playerError
        }
      }
    )
    if (!player){
      console.log("player didn't load?")
    }
  }
  message.on('youtube-iframe-api-ready', function(){
    console.log("received youtube message")
    youtubeIsReady()
  })

  if (youtubeIframeApiIsTotallyReady){
    console.log("Youtube was already ready")
    youtubeIsReady()
  }

  currentYoutubePlayerState = null;
  stateTransitions = []
  function playerStateChanged(event) {
    var msg = "" + currentYoutubePlayerState + " -> " + event.data + " " + player.getCurrentTime() + "/" + player.getDuration()
    console.log(msg)
    stateTransitions.push(msg)
    currentYoutubePlayerState = event.data

    if (state != PLAYING && (event.data === YT.PlayerState.UNSTARTED || event.data === YT.PlayerState.CUED)) {
      console.log("Not updating player state.")
      return
    }

    if(deejay.isOffAir() &&  event.data == YT.PlayerState.PAUSED){
      return
    }
    console.log("Going on air!!!!: Event Data: " + event.data)

    // console.log("Shit going down: "  + event.data)

    if (event.data === YT.PlayerState.ENDED) {
      console.log("Song ended")
      currentSong = null
    }

    var states = {}
    states[YT.PlayerState.UNSTARTED] = BETWEEN_SONGS
    states[YT.PlayerState.ENDED]     = BETWEEN_SONGS
    states[YT.PlayerState.PLAYING]   = PLAYING
    states[YT.PlayerState.PAUSED]    = PAUSED
    states[YT.PlayerState.BUFFERING] = PAUSED
    states[YT.PlayerState.CUED]      = BETWEEN_SONGS


    state = states[event.data]
    // console.debug('updated state: ' + state)
    $rootScope.$apply(notify)
  }

  function playerError(error) {
    console.log("error: " + error.data)
    deejay.skipThisSong()
  }
}])
