angular.module('OathStructure').controller('LibraryController', function($scope) {
  $scope.addToQueue = function(song) {
    message.send('add-to-queue', angular.copy(song))
  }


})
