angular.module('OathStructure').controller('LibraryController', ['$scope', 'YoutubeService', 'SpotifyService', function($scope, YoutubeService, SpotifyService) {

  $scope.tab = 'library'
  // $scope.playlists = [{'name': 'THe best', 'tracks': [{'title':'subbydobydo' }, {'title':'malcom'},{'title': 'taken by surprise in the early eve' }]}, {'name': 'Worst', 'tracks': [{'title':'death is inexorable'}, {'title':'Smart money is on the other guy'}]} ]
  // $scope.playlists = []
  $scope.selectTab = function(tab){
    $scope.tab = tab
  }



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

  $scope.searchYoutube = function(){
    YoutubeService.getYoutubeId($scope.searchQuery, "").then(function(result){
      console.log(result)

      $scope.addToQueue({
        title: $scope.searchQuery,
        artist: "",
        album: "",
        trackNumber: 0,
        youtubeId: result,
        youtubeImageId: result
      })
    })
  }

  $scope.searchSpotify = function(){
    SpotifyService.trackSearch($scope.searchQuery, 1).then(function(result){
      console.log(result[0].artists[0].name)
      console.log(result[0].name)
      YoutubeService.getYoutubeId(result[0].artists[0].name , result[0].name).then(function(youtubeId){
        console.log(youtubeId)
        song = {
          title:  result[0].name,
          artist: result[0].artists[0].name,
          album: result[0].album.name,
          trackNumber: result[0].track_number,
          youtubeId: youtubeId,
          youtubeImageId: youtubeId
        }
        $scope.library.push(song)
        $scope.addToQueue(song)
      })
    })
  }

  $scope.$watch('searchQuery',function(){
    if ($scope.tab == "catalog"){
      $scope.search($scope.searchQuery, 4)
    }
  });

  $scope.$watch('tab',function(){
    if ($scope.tab == "catalog" && $scope.searchQuery){
      $scope.search($scope.searchQuery, 4)
    }
  });

  $scope.showResults = false
  $scope.albumResults = []
  $scope.artistResults = []
  $scope.trackResults = []

  $scope.search = function(){
    $scope.showResults=true;
    SpotifyService.albumSearch($scope.searchQuery, 4).then(function(result){
      console.log(result)
      $scope.albumResults = result
    })
    SpotifyService.artistSearch($scope.searchQuery, 4).then(function(result){
      console.log(result)
      $scope.artistResults = result
    })
    SpotifyService.trackSearch($scope.searchQuery, 4).then(function(result){
      console.log(result)
      $scope.trackResults = result
    })
  }

  $scope.artist = {}
  $scope.albumList = []
  $scope.trackList= []

  $scope.getArtistAlbums = function(artist){
    console.log("called artist")
    console.log(artist)
    $scope.artist = artist
    SpotifyService.getArtistAlbums(artist.id).then(function(result){
      $scope.albumList = result
    })
  }

  $scope.getAlbumTracks = function(album){
    console.log("called album")
    console.log(album)
    SpotifyService.getAlbumTracks(album.id).then(function(result){
      _.each(result, function(track){
        YoutubeService.getYoutubeId(track.artists[0].name , track.name).then(function(youtubeId){
          song = {
            title:  track.name,
            artist: track.artists[0].name,
            album: album.name,
            trackNumber: result[0].track_number,
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
