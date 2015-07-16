angular.module('OathStructure').service('Deejay', function() {
  var playing = false;
  var currentSong = null;
  var player

  this.getIsPlaying = function(){
    return playing
  }

  this.getCurrentSong = function(){
    return currentSong
  }

  this.setCurrentSong = function(song){
    currentSong = song
    this.playSong()
  }

  this.playSong = function() {
    if (weHaveASong()){
      playVideo()
      playing = true
    }
  }

  this.pauseSong = function(){
    pauseVideo()
    playing = false;
  }

  this.stopSong = function(){
    stopVideo()
    playing = false
    currentSong = null
  }

  this.skipSong = function() {
    currentSong = null
    message.send('deejay-needs-a-song')
  }

  function playVideo() {
    if (currentSongChanged()) {
      player.cueVideoById(currentSong.youtubeId)
    }
    player.playVideo()
  }

  function pauseVideo() {
    player.pauseVideo()
  }

  function stopVideo() {
    player.pauseVideo()
    player.cueVideoById('')
  }

  function weHaveASong() {
    if (!currentSong) {
      message.send('deejay-needs-a-song')
      return false
    }else{
      return true
    }
  }

  function currentSongChanged() {
    return currentSong && videoIdFromPlayer() !== currentSong.youtubeId
  }

  function videoIdFromPlayer() {
    var data = player.getVideoData()
    if (!data) return null
    return data['video_id']
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

  function sendProgressUpdate() {
    if (player && player.getCurrentTime && player.getDuration) {
      message.send('song-progress', {position: player.getCurrentTime(), total: player.getDuration()})
    }
  }
  window.setInterval(sendProgressUpdate, 1000)

  function playerStateChanged(event) {
    if (event.data === YT.PlayerState.ENDED) {
      playing = false
      currentSong = null
      message.send('deejay-needs-a-song')
    } else if (event.data === YT.PlayerState.PLAYING) {
      playing = true
    } else if (event.data === YT.PlayerState.PAUSED) {
      playing = false
    }
  }
})
