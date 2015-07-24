
angular.module('OathStructure').service('LastFmService', ['$rootScope' , '$http', function($rootScope, $http) {

  var api_key = "327927be40a0df73e9a605e03c397d91"
  var url = "http://ws.audioscrobbler.com/2.0/"
  var format = 'json'
  this.artistSearch = function(query, limit){
    var method = 'artist.search'
    var promise = $http.get(url, {
      params: {method: method,
        artist: query,
        api_key: api_key,
        limit: limit,
        format: format
      }
    }).then(function(response){
      return response.data.results.artistmatches.artist
    })
    return promise
  }

  this.albumSearch = function(method, query, limit){
    var method = 'album.search'
    var promise = $http.get(url, {
      params: {method: method,
        album: query,
        api_key: api_key,
        limit: limit,
        format: format
      }
    }).then(function(response){
      return response.data.results.albummatches.album
    })
    return promise
  }

  this.trackSearch = function(method, query, limit){
    var method = 'track.search'
    var promise = $http.get(url, {
      params: {method: method,
        track: query,
        api_key: api_key,
        limit: limit,
        format: format
      }
    }).then(function(response){
      return response.data.results.trackmatches.track
    })
    return promise
  }

  this.getArtist =  function(artist_id){
    var method = 'artist.search'
    var promise = $http.get(url, {
      params: {method: method,
        mbid: artist_id,
        api_key: api_key,
        limit: limit,
        format: format
      }
    }).then(function(response){
      return response.data.results.trackmatches.track
    })
  }




  this.getAlbum = function(album_id){

  }

  this.getTrack = function(track_name, artist){

  }

}])
