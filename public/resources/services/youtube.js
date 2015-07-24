angular.module('OathStructure').service('YoutubeService', ['$rootScope' , '$q', function($rootScope, $q) {
  var loaded = false
  var ip = null

  message.on('google-api-loaded', function(){
    loaded = true
  })

  this.getYoutubeId = function(artist, song){
    if (loaded == true) {
      var query = hashTagQuery(artist, song)
      return searchYoutubePromise(query).then(function(result){
        if (result.items.length == 0){
          query = lyricQuery(artist, song)
          return searchYoutubePromise(query).then(function(result){
            if (result.items.length == 0){
              return null
            }else{
              return result.items[0].id.videoId
            }
          })
        }else{
          return result.items[0].id.videoId
        }
      })
    }else{
      return  Promise.resolve(null)
    }
  }

  this.findYoutubeId = function(artist, song_name, song){
    if (loaded = true){
      var hashquery = hashTagQuery(artist, song_name)
      searchYoutube(hashquery, song, "hash")
      var lyricquery = lyricQuery(artist, song_name)
      searchYoutube(lyricquery, song, "lyric")
    }

  }

  function searchYoutube(query, song){
    var q = query
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      type: 'video'
    });

    request.execute(function(response) {
      if (response.items.length !== 0){
        song.youtubeId = response.items[0].id.videoId

      }
    });
  }

  function searchYoutubePromise(query){
    var defer=$q.defer();
    var q = query
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet',
        type: 'video'
    });

    request.execute(function(response) {
        defer.resolve(response)
    });
    return defer.promise;
  }

  function hashTagQuery(artist, song){
    return "\"#" + artist.replace(/\W/g, '') + "\" " + song
  }

  function lyricQuery(artist, song){
    return artist + " " + song + " lyrics"
  }

}])


var apiKey = 'AIzaSyAVL6e_1RMEKzvAli0cUsUzQYPVJJgA3dc' // Limited to accepted domains
function googleApiClientReady() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3').then(function(){
    message.send('google-api-loaded')
  })
}
