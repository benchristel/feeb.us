angular.module('OathStructure').controller('LibraryController', ['$scope', '$location', '$window', '$anchorScroll', '$timeout', 'YoutubeService', 'SpotifyService',
                                                         function($scope, $location, $window, $anchorScroll, $timeout, YoutubeService, SpotifyService) {

  $scope.tab = 'library'

  $scope.selectTab = function(tab){
    console.log("selectedTab")
    $scope.tab = tab
    console.log(extractState($scope))
    history.pushState(extractState($scope), null, null);
  }




  $scope.onPopState = function(state){
    console.log(state)
    for (var key in state) {
      $scope[key] = state[key]
    }
    console.log(_.isEqual($scope.trackList, ["get"]))
    if (_.isEqual($scope.trackList, ["get"])){
      $scope.getAlbumTracks($scope.selectedAlbum, $scope.selectedTrack)
    }
  };

  history.replaceState(extractState($scope), null, null);

  function extractState(fullState){
    var state = Object.keys(fullState).reduce(function(previous, current) {
      if (typeof fullState[current] !== "function" && current[0] !== "$" && current !== "activeElement"){
        previous[current] = fullState[current];
      }
      return previous;
    }, {});
    return state

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
    $scope.cleanUpLibrary()
  }

  $scope.playNow = function(list) {
    message.send('play-now', _.map(list, function(song) { return angular.copy(song) }))
    $scope.addAlbumToLibrary(list)
  }

  $scope.playAlbumNow = function(song){
    var list = _.where($scope.library, {album: song.album})
    message.send('play-now', _.map(list, function(song) { return angular.copy(song) }))
  }

  $scope.playListNow = function(list){
    message.send('play-now', _.map(list, function(song) { return angular.copy(song) }))
  }

  $scope.addToQueueAndLibrary = function(song){
    $scope.library.push(song)
    $scope.addToQueue(song)
    $scope.cleanUpLibrary()
  }


  $scope.addAlbumToQueue = function(list){
    $scope.addAlbumToLibrary(list)
    _.each(list, function(song){
      $scope.addToQueue(song)
    })
  }

  $scope.addLibraryAlbumToQueue = function(song){
    var list = _.where($scope.library, {album: song.album})
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
  $scope.selectedTrack = null

  $scope.getArtistAlbums = function(artist){
    console.log("called artist")
    console.log(artist)
    $scope.showResults = false
    $scope.showAlbum = false;
    $scope.artist = artist
    SpotifyService.getArtistAlbums(artist.id).then(function(result){
      $scope.albumList = result
      history.pushState(extractState($scope), null, null);

    })
  }

  $scope.getAlbumTracks = function(album, selectedTrack) {
    console.log("called album")
    console.log(album)

    $scope.showResults = false
    $scope.selectedAlbum = album
    if (typeof selectedTrack !== 'undefined' && selectedTrack !== null){
      $scope.selectedTrack = typeof selectedTrack.name !== 'undefined' ? selectedTrack.name : selectedTrack
    }else{
      $scope.selectedTrack = null;
    }
    // $scope.selectedTrack = selectedTrack !== null ?  selectedTrack.name : null;

    $scope.showAlbum = true;
    if (!(_.isEqual($scope.trackList, ["get"]))){
      console.log("adding to history from getAlbumTracks")
      var state = extractState($scope)
      state.trackList = ["get"]
      history.pushState(state, null, null);
    }
    SpotifyService.getAlbumTracks(album.id).then(function(result){
      $scope.trackList = []
      _.each(result, function(track){
        YoutubeService.getYoutubeId(track.artists[0].name , track.name).then(function(youtubeId){
          song = {
            title:  track.name,
            artist: track.artists[0].name,
            album: album.name,
            trackNumber: track.track_number,
            discNumber: track.disc_number,
            youtubeId: youtubeId,
            youtubeImageId: youtubeId,
            albumArtUrl: album.images[1].url,
            selected: $scope.selectedTrack == track.name
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

angular.module('OathStructure').directive("ngPopstate", function($parse, $timeout, $window){
    return function($scope, $element, $attributes){
      var fn = $parse($attributes["ngPopstate"]);
      $window.addEventListener("popstate", function(event){
          event.stopPropagation();
          event.preventDefault();
          $timeout(function() {
              fn($scope, {
                  $state : event.state,
                  $event : event
              });
          });
      });
    };
});
