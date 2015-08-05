angular.module('OathStructure').controller('LibraryController', ['$scope', '$location', 'YoutubeService', 'SpotifyService', function($scope, $location, YoutubeService, SpotifyService) {

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
  }


  $scope.addToQueue = function(song) {
    message.send('add-to-queue', angular.copy(song))
  }

  $scope.addAllToQueue = function(list){
    _.each(list, function(song){
      $scope.addToQueue(song)
    })
  }


  $scope.$watch('searchQuery',function(){
    if ($scope.tab == "catalog" && $scope.searchQuery != ""){
      $scope.search($scope.searchQuery, 4)
    }
  });
  var savedQuery = ""
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
      _.each(result, function(track){
        $scope.trackList = []
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
        })
      })
    })
  }

}])
