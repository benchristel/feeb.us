angular.module('OathStructure').controller('LibraryController', ['$scope', '$location', '$anchorScroll', '$timeout', 'YoutubeService', 'SpotifyService',
                                                         function($scope, $location, $anchorScroll, $timeout, YoutubeService, SpotifyService) {

  $scope.tab = 'library'
  // $scope.playlists = [{'name': 'THe best', 'tracks': [{'title':'subbydobydo' }, {'title':'malcom'},{'title': 'taken by surprise in the early eve' }]}, {'name': 'Worst', 'tracks': [{'title':'death is inexorable'}, {'title':'Smart money is on the other guy'}]} ]
  // $scope.playlists = []
  $scope.selectTab = function(tab){
    $scope.tab = tab
  }

  $scope.searchQuery = ""
  $scope.selectedPlaylist = {}

  $scope.selectPlaylist = function(playlist){
    $scope.selectedPlaylist.selected = false;
    playlist.selected = true;
    $scope.selectedPlaylist = playlist
    $timeout(function() {
      $location.hash('playlist-top');
      $anchorScroll();
    })
  }



  $scope.addToQueue = function(song) {
    message.send('add-to-queue', angular.copy(song))
  }

  $scope.addAllToQueue = function(list, name){
    $scope.setPlaylistName(name)
    _.each(list, function(song){
      $scope.addToQueue(song)
    })
  }


  $scope.addAlbumToLibrary = function(list){
    _.each(list, function(song){
      $scope.library.push(song)
    })
    cleanUpLibrary()
  }

  $scope.playNow = function(list) {
    message.send('play-now', _.map(list, function(song) { return angular.copy(song) }))
    $scope.addAlbumToLibrary(list)
  }

  $scope.playListNow = function(list){
    message.send('play-now', _.map(list, function(song) { return angular.copy(song) }))
  }

  $scope.addToQueueAndLibrary = function(song){
    $scope.library.push(song)
    $scope.addToQueue(song)
    cleanUpLibrary()
  }

  function cleanUpLibrary() {
    $scope.library = _(_($scope.library).sortBy(artistAlbumAndTrack)).uniq(true, artistAlbumAndTrack)
  }

  function artistAlbumAndTrack(song) {
    return song.artist + "\n" + song.album + "\n" + zeropad(song.trackNumber)
  }

  function zeropad(n) {
    var s = ""+n
    if (s.length === 2) return "0" + s
    if (s.length === 1) return "00" + s
    return s
  }

  $scope.addAlbumToQueue = function(list){
    $scope.addAlbumToLibrary(list)
    _.each(list, function(song){
      $scope.addToQueue(song)
    })
  }



  var savedQuery = ""
  $scope.$watch('searchQuery',function(){
    if ($scope.tab == "catalog" && $scope.searchQuery != ""){
      savedQuery = $scope.searchQuery
      $scope.search()
    }
  });

  $scope.$watch('tab',function(){
    if ($scope.tab == "catalog" && $scope.searchQuery != "" && savedQuery != $scope.searchQuery){
      savedQuery = $scope.searchQuery
      $scope.search()
    }
  });

  $scope.showResults = false
  $scope.albumResults = []
  $scope.artistResults = []
  $scope.trackResults = []


  $scope.onSearchResults = false;
  $scope.blur = function(){
    if (!$scope.onSearchResults) {
     $scope.showResults=false
    }
  }


  $scope.search = function(){
    $scope.showResults=true;
    SpotifyService.albumSearch($scope.searchQuery, 3).then(function(result){
      console.log(result)
      $scope.albumResults = result
    })
    SpotifyService.artistSearch($scope.searchQuery, 3).then(function(result){
      console.log(result)
      $scope.artistResults = result
    })
    SpotifyService.trackSearch($scope.searchQuery, 3).then(function(result){
      console.log(result)
      $scope.trackResults = result
    })
  }

  $scope.activeElement = document.activeElement

  $scope.$watch(
    function () { return document.activeElement; },
    function (newValue, oldValue) {
      if (newValue !== oldValue) {
        console.log(document.activeElement)
      }
    }
  );

  $scope.artist = {}
  $scope.albumList = []
  $scope.trackList= []
  $scope.showAlbum = true;
  $scope.selectedAlbum = {}

  $scope.getArtistAlbums = function(artist){
    console.log("called artist")
    // $location.hash("/artist/" + artist.id)
    console.log(artist)
    $scope.showResults = false
    $scope.showAlbum = false;
    $scope.artist = artist
    SpotifyService.getArtistAlbums(artist.id).then(function(result){
      $scope.albumList = result
    })
  }

  $scope.getAlbumTracks = function(album){
    console.log("called album")
    console.log(album)
    // $location.hash("/album/" + album.id)
    $scope.showResults = false
    $scope.selectedAlbum = album
    $scope.showAlbum = true;
    SpotifyService.getAlbumTracks(album.id).then(function(result){
      $scope.trackList = []
      _.each(result, function(track){
        YoutubeService.getYoutubeId(track.artists[0].name , track.name).then(function(youtubeId){
          song = {
            title:  track.name,
            artist: track.artists[0].name,
            album: album.name,
            trackNumber: track.track_number,
            youtubeId: youtubeId,
            youtubeImageId: youtubeId,
            albumArtUrls: album.images
          }
          $scope.trackList.push(song)
          $scope.trackList = _($scope.trackList).sortBy(function(track) { return track.trackNumber })
        })
      })
    })

    $timeout(function() {
      $location.hash('catalog-top');
      $anchorScroll();
    })
  }

}])
