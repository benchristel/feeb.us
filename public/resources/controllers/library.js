angular.module('OathStructure').controller('LibraryController', ['$scope', 'YoutubeService', function($scope, YoutubeService) {
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
}])
