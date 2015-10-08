angular.module('OathStructure').
  controller('AppController', ['$scope', '$http', 'Deejay',
                      function ($scope,   $http,   Deejay) {
  $scope.searchQueryChars = function() {
    if (!$scope.searchQuery) return []
    return $scope.searchQuery.split('')
  }

  $scope.playlistName = ""

  $scope.keypress = function(event){
    if (( document.activeElement !== null && document.activeElement.id !== "searchbar"  && document.activeElement.id !== "model") || document.activeElement === null){
      if (event.which == 32){
        if (Deejay.isPlaying()){
          Deejay.pause()
        }
        else{
          Deejay.play()
        }
      }
    }
  }


  function loadLibrary(){
    try {
      $scope.library = JSON.parse(localStorage['os-library'])
    } catch (e) {
      $scope.library = []
    }
  }

  $scope.saveLibrary = function(){
    localStorage['os-library'] = JSON.stringify($scope.library)
  }

  window.addEventListener("beforeunload", $scope.saveLibrary);

  loadLibrary()

  $scope.savingPlaylist = false
  $scope.playlistToBeSaved = []

  $scope.playlists = []

  function getPlaylists(){
    for(var i in localStorage){
      if (i.indexOf('playlist-') === 0){
        $scope.playlists.push(JSON.parse(localStorage[i]))
      }
    }
  }

  getPlaylists()

  message.on('saving-playlist', function(playlist){
    $scope.savingPlaylist = true;
    $scope.playlistToBeSaved = playlist
  })

  $scope.setPlaylistName = function(name){
    $scope.playlistName = name
  }

  $scope.savePlaylist = function(name){
    var playlistName = 'playlist-' + name
    // if (localStorage[playlistName]){
    //   playlistName += '' //need to do something to ensure no accidental dublicates...
    // }
    var playlistCopy = angular.copy($scope.playlistToBeSaved)
    setPlayingToFalse(playlistCopy)
    var playlist = {'filename': playlistName, 'name': name, 'tracks': playlistCopy}
    localStorage[playlistName] = JSON.stringify(playlist)
    updatePlaylists(playlist)
    $scope.savingPlaylist = false
    $scope.playlistToBeSaved = []
  }

  $scope.cancelSavePlaylist = function() {
    $scope.savingPlaylist = false
    $scope.playlistToBeSaved = []
  }

  $scope.deletePlaylist = function(playlist){
    localStorage.removeItem(playlist.filename)
    $scope.playlists = _.without($scope.playlists, playlist)
  }

  function setPlayingToFalse(playlist){
    _.each(playlist, function(song){
      song.playing = false
    })
  }

  function updatePlaylists(playlist){
    $scope.playlists.push(playlist)
  }

}])
