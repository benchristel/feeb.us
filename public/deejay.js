function Deejay() {
  "use strict"
  
  var div = document.createElement('div')
  div.setAttribute('id', 'youtube-player-1')
  document.getElementById('player-container').appendChild(div)

  div = document.createElement('div')
  div.setAttribute('id', 'youtube-player-2')
  document.getElementById('player-container').appendChild(div)

  var players = []
  players.push(new YT.Player(
    'youtube-player-1',
    {
      height: '195',
      width: '320',
      videoId: 'au3-hk-pXsM',
      playerVars: { rel: 0, controls: 0 },
      events: {
        'onReady': readyPlayer1,
        'onStateChange': stateChangePlayer1
      }
    }
  ))

  players.push(new YT.Player(
    'youtube-player-2',
    {
      height: '195',
      width: '320',
      videoId: 'au3-hk-pXsM',
      playerVars: { rel: 0, controls: 0 },
      events: {
        'onReady': readyPlayer2,
        'onStateChange': stateChangePlayer2
      }
    }
  ))

  message.on('play-now', function(request) {
    var videoId = request.mediaId()
    stop()
    var cued = inactivePlayer().getVideoData()
    if (cued && cued['video_id'] === videoId) {
      swapActivePlayer()
    } else {
      activePlayer().cueVideoById(videoId)
    }
    play()
  })

  message.on('play-next', function(videoId) {
    inactivePlayer().cueVideoById(videoId)
    // hack: start playing the video and immediately pause when the
    // state changes from BUFFERING to PLAYING. This will cause the
    // video to buffer in the background.
    // http://stackoverflow.com/questions/8088245/preloading-a-youtube-embed
    inactivePlayer().playVideo()
  })

  message.on('resume', function() {
    play()
  })

  message.on('pause', function() {
    stop()
  })

  function activePlayerStateChanged(event) {
    if (event.data === YT.PlayerState.ENDED) {
      message.send('song-complete')
    }
  }

  function inactivePlayerStateChanged(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      inactivePlayer().pauseVideo()
    }
  }

  function stop(hammerTime) {
    activePlayer().pauseVideo()
  }

  function play() {
    activePlayer().playVideo()
  }

  var activePlayerIndex = 0
  function activePlayer() {
    return players[activePlayerIndex]
  }

  function inactivePlayer() {
    return players[+!activePlayerIndex]
  }

  function swapActivePlayer() {
    activePlayerIndex = +!activePlayerIndex
  }

  var readyCount = 0
  function readyPlayer1() {
    readyCount++
    ready()
  }

  function readyPlayer2() {
    readyCount++
    ready()
  }

  function ready() {
    if (readyCount === 2) {
      message.send('deejay-ready')
    }
  }

  function stateChangePlayer1(event) {
    if (!activePlayerIndex) {
      activePlayerStateChanged(event)
    } else {
      inactivePlayerStateChanged(event)
    }
  }

  function stateChangePlayer2(event) {
    if (activePlayerIndex) {
      activePlayerStateChanged(event)
    } else {
      inactivePlayerStateChanged(event)
    }
  }
}
