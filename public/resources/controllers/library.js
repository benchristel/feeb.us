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
    for (var song in list){
      $scope.addToQueue(song)
    }
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
}])
