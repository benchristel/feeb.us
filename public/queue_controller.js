var QueueController = function($scope) {
  "use strict"

  var queue = new LinkedList()
  var current = null

  $scope.queue = function() {
    return queue.toArray()
  }

  $scope.enqueue = function(id, title) {
    var queueItem = {
      id: id, //todo: rename to mediaId
      title: title || 'unknown',
      listId: null
    }

    var listId = queue.add(queueItem)
    queueItem.listId = listId
    $scope.addition = ''
  }

  $scope.advance = function() {
    current = queue.next(current.listId)
  }

  $scope.jumpTo = function(listId) {
    current = queue.get(listId)
    playCurrentSong()
  }

  $scope.isPlaying = function(listId) {
    return !!current && current.listId === listId
  }

  $scope.clear = function() {
    queue.clear()
  }

  var subs = []
  subs.push(message.on('song-complete', requestNextSong))
  function requestNextSong() {
    $scope.advance()
    playCurrentSong()
    $scope.$apply()
  }

  subs.push(message.on('play', startPlaying))
  function startPlaying() {
    current = queue.first()
    playCurrentSong()
  }

  subs.push(message.on('add-to-queue', addToQueue))
  function addToQueue(song) {
    $scope.enqueue(song.id, song.title)
  }

  $scope.destroy = function() {
    for (var subscription of subs) {
        subscription.cancel()
    }
  }

  function playCurrentSong() {
    if (current) {
      $scope.playerState.state = $scope.PLAYING
      message.send("play-now", SongRequest(current))

      if (queue.next(current.listId)) {
        message.send("play-next", queue.next(current.listId).id)
      }
    } else {
      $scope.playerState.state = $scope.STOPPED
    }
  }

  function SongRequest(queueItem) {
    var request = {}
    var inProgress = true

    request.queueId = function() {
        return queueItem.listId
    }

    request.mediaId = function() {
        return queueItem.id
    }

    request.playCompleted = function() {
        if (inProgress) {
            onPlayCompleted(request)
        }
    }

    return request
  }

  function onPlayCompleted() {
    requestNextSong()
  }
}
