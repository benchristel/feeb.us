angular.module('OathStructure').controller('LibraryController', ['$scope', '$location', '$window', '$anchorScroll', '$timeout', 'YoutubeService', 'SpotifyService',
                                                         function($scope, $location, $window, $anchorScroll, $timeout, YoutubeService, SpotifyService) {

  $scope.tab = 'library'
  // $scope.playlists = [{'name': 'THe best', 'tracks': [{'title':'subbydobydo' }, {'title':'malcom'},{'title': 'taken by surprise in the early eve' }]}, {'name': 'Worst', 'tracks': [{'title':'death is inexorable'}, {'title':'Smart money is on the other guy'}]} ]
  // $scope.playlists = []
  $scope.selectTab = function(tab){
    console.log("selectedTab")
    $scope.tab = tab

    // $location.hash(tab)

    history.pushState({tab: $scope.tab, showAlbum: $scope.showAlbum, albumList: $scope.albumList}, null, null);
    // $location.state($scope.tab)
  }

  $scope.onPopState = function(state){
    console.log(state)
    if(state.tab !== null){
      $scope.tab = state.tab;
    }
    if(state.showAlbum !== null){
      $scope.showAlbum = state.showAlbum
    }
    if(state.albumList !== null){
      $scope.albumList = state.albumList
    }
  };

  history.replaceState({tab: $scope.tab, showAlbum: $scope.showAlbum, albumList: $scope.albumList}, null, null);



  // $window.onpopstate = function(event) {
  //   console.log("State popped. Back or forward probably")
  //   $scope.tab = event.state.tab;
  //   console.log($scope.tab)
  // };

  // $window.addEventListener("popstate", function(event){
  //   event.stopPropagation();
  //   event.preventDefault();
  //   $timeout(function() {
  //       fn($scope, {
  //           $tab : event.state,
  //           $event : event
  //       });
  //   });
  // });

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
    // $location.hash("/artist/" + artist.id)
    console.log(artist)
    $scope.showResults = false
    $scope.showAlbum = false;
    $scope.artist = artist
    SpotifyService.getArtistAlbums(artist.id).then(function(result){
      $scope.albumList = result
      history.pushState({tab: $scope.tab, showAlbum: $scope.showAlbum, albumList: $scope.albumList}, null, null);

    })
  }

  $scope.getAlbumTracks = function(album, selectedTrack) {
    console.log("called album")
    console.log(album)

    // $location.hash("/album/" + album.id)
    $scope.showResults = false
    $scope.selectedAlbum = album
    $scope.selectedTrack = typeof selectedTrack !== 'undefined' ?  selectedTrack.name : null;
    console.log($scope.selectedTrack)
    $scope.showAlbum = true;
    history.pushState({tab: $scope.tab, showAlbum: $scope.showAlbum, albumList: $scope.albumList}, null, null);
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
          console.log("Is this called??")
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
