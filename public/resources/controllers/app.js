angular.module('OathStructure').
  controller('AppController', ['$scope', '$http', 'Deejay',
                      function ($scope,   $http,   Deejay) {
  $scope.searchQueryChars = function() {
    if (!$scope.searchQuery) return []
    return $scope.searchQuery.split('')
  }

  $scope.playlistName = ""

  whitelist = ["searchbar",  "model", "title", "artist", "album", "youtubeId", "albumArt", "trackNumber"]

  $scope.keypress = function(event){
    if (( document.activeElement !== null && !_.contains(whitelist, document.activeElement.id)) || document.activeElement === null){
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

  $scope.changeLibrary = function(newLibrary){
    $scope.library = newLibrary
  }

  $scope.saveLibrary = function(){
    localStorage['os-library'] = JSON.stringify($scope.library)
  }

  $scope.cleanUpLibrary = function() {
    $scope.library = _(_($scope.library).sortBy(artistAlbumAndTrack)).uniq(true, artistAlbumAndTrack)
    $scope.saveLibrary()
  }

  window.addEventListener("beforeunload", $scope.saveLibrary);

  loadLibrary()

  $scope.deleteSongFromLibrary = function(song){
    $scope.changeLibrary( _.without($scope.library, song))
  }

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
    var exists = false;
    _.each($scope.playlists, function(pl){
        if (pl.name == playlist.name){
          pl.tracks = playlist.tracks
          exists = true
        }
    })
    if (!exists){
      $scope.playlists.push(playlist)
    }
  }

  $scope.songBeingEdited = {}
  $scope.pendingChanges = {}
  $scope.editingSong = false

  $scope.editSong = function(song){
    $scope.editingSong = true
    $scope.songBeingEdited = song
    $scope.pendingChanges = angular.copy(song)
  }

  $scope.saveEdit = function(){
    var trackNumber = $scope.songBeingEdited.trackNumber
    angular.extend($scope.songBeingEdited, $scope.pendingChanges)
    if (trackNumber !== $scope.pendingChanges.trackNumber){
      console.log("Track number: " + trackNumber)
      console.log("New TN: " + $scope.pendingChanges.trackNumber)
      $scope.cleanUpLibrary()
    }
    $scope.editingSong = false
  }

  $scope.cancelSongEdit = function(){
    $scope.songBeingEdited = {}
    $scope.editingSong = false

  }

  $scope.addingSong = false
  $scope.songToAdd = {}

  $scope.addSongManually = function(){
    $scope.addingSong = true
  }

  $scope.saveSong = function(){
    if ($scope.songToAdd.youtubeId && $scope.songToAdd.youtubeId !== ""){
      $scope.songToAdd.trackNumber = $scope.songToAdd.trackNumber || 1
      $scope.library.push($scope.songToAdd)
      $scope.cleanUpLibrary()
    }
    $scope.songToAdd = {}
    $scope.addingSong = false

  }

  $scope.cancelSongAdd = function(){
    $scope.songToAdd = {}
    $scope.addingSong = false
  }

  function artistAlbumAndTrack(song) {
    return (song.artist + "\n" + song.album + "\n" +  zeropad(song.discNumber) + "\n" + zeropad(song.trackNumber) + "\n" + song.title).toLowerCase()
  }

  function zeropad(n) {
    var s = ""+n
    if (s.length === 2) return "0" + s
    if (s.length === 1) return "00" + s
    return s
  }

}])
