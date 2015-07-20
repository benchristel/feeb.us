angular.module('OathStructure').
  controller('AppController', ['$scope', '$http', 'Deejay',
                      function ($scope,   $http,   Deejay) {
  $scope.searchQueryChars = function() {
    if (!$scope.searchQuery) return []
    return $scope.searchQuery.split('')
  }

  $scope.keypress = function(event){
    if (( document.activeElement !== null && document.activeElement.id !== "searchbar") || document.activeElement === null){
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

  message.on('import-library', function(song) {
    $scope.startImport()
  })

  $scope.startImport = function() {
    $scope.importing = true
  }

  $scope.importFrom = function(text) {
    $scope.library = parseLibrary(text || '')
    localStorage['oath-structure-library'] = text
    $scope.importing = false
  }

  $scope.cancelImport = function() {
    $scope.importing = false
  }

  $http.get('resources/library.txt').success(function(data) {
    $scope.importFrom(data)
  })
}])
