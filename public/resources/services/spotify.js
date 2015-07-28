
angular.module('OathStructure').service('SpotifyService', ['$rootScope' , '$http', function($rootScope, $http) {

  var url = "https://api.spotify.com/v1/"

  this.artistSearch = function(query, limit){
    var promise = $http.get(url + "search", {
      params: {
        q: query,
        type: "artist",
        limit: limit
      }
    }).then(function(response){
      return response.data.artists.items
    })
    return promise
  }

  this.albumSearch = function(query, limit){
    var promise = $http.get(url + "search", {
      params: {
        q: query,
        type: "album",
        limit: limit
      }
    }).then(function(response){
      return response.data.albums.items
    })
    return promise
  }

  this.trackSearch = function(query, limit){
    var method = 'track.search'
    var promise = $http.get(url + "search", {
      params: {
        q: query,
        type: "track",
        limit: limit
      }
    }).then(function(response){
      return response.data.tracks.items
    })
    return promise
  }

  this.getArtist =  function(artist_id){
    var promise = $http.get(url+'artists/'+artist_id+'/albums', {
      params: {
        limit: 50,
        market: 'US'
      }
    }).then(function(response){
      return response.data.items
    })
  }

  this.getAlbum = function(album_id){
    var promise = $http.get(url+'albums/'+album_id+'/tracks', {
      params: {
        limit: 50,
        market: 'US'
      }
    }).then(function(response){
      return response.data.items
    })
  }


}])
