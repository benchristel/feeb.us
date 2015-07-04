var QueueController = function($scope) {
  "use strict"

  var queue = new LinkedList()
  var current = null
  var selection = []

  $scope.queue = function() {
    return queue.toArray()
  }

  $scope.enqueue = function(id, title) {
    var queueItem = {
      id: id,
      title: title || 'unknown',
      listId: null,
      selected: false
    }

    var listId = queue.add(queueItem)
    queueItem.listId = listId
    $scope.addition = ''
  }

  $scope.dropSelected = function(beforeId) {
    var toMove = []
    queue.forEach(function(item) {
        if (item.selected) toMove.push(item)
    })
    for (var i of toMove) {
        queue.moveBefore(beforeId, i.listId)
    }
  }

  $scope.advance = function() {
    current = queue.next(current.listId)
  }

  $scope.jumpTo = function(listId) {
    current = queue.get(listId)
    playCurrentSong()
  }

  $scope.select = function(listId) {
    var item = queue.get(listId)
    item.selected = !item.selected
  }

  $scope.remove = function(listId) {
    if (current === queue.get(listId)) {
        $scope.advance()
        playCurrentSong()
    }

    queue.remove(listId)
  }

  $scope.isSelected = function(listId) {
    return selection.indexOf(listId) > -1
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
    $scope.enqueue(song.mediaId, song.title)
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
