angular.module('OathStructure').controller('LibraryController', ['$scope', 'YoutubeService', 'SpotifyService', function($scope, YoutubeService, SpotifyService) {
  $scope.addToQueue = function(song) {
    message.send('add-to-queue', angular.copy(song))
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
      console.log(result[0])
      YoutubeService.getYoutubeId(result[0].artists[0].name , result[0].name).then(function(youtubeId){
        console.log(result)
        $scope.addToQueue({
          title:  result[0].name,
          artist: result[0].artists[0].name,
          album: result[0].album.name,
          trackNumber: result[0].track_number,
          youtubeId: youtubeId,
          youtubeImageId: youtubeId
        })
      })
    })
  }
}])
