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

  $scope.destroy = function() {
    for (var subscription of subs) {
        subscription.cancel()
    }
  }

  function playCurrentSong() {
    if (current) {
      message.send("play-now", SongRequest(current))

      if (queue.next(current.listId)) {
        message.send("play-next", queue.next(current.listId).id)
      }
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

  $scope.enqueue('au3-hk-pXsM', 'Magical Trevor #1')
  $scope.enqueue('HsUgZANvAbU', 'Magical Trevor #2')
  $scope.enqueue('5ARw19AnLK4', 'VGM Compilation')
}
