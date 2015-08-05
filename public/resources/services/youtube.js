angular.module('OathStructure').service('YoutubeService', ['$rootScope' , '$q', function($rootScope, $q) {
  var loaded = false
  var ip = null

  message.on('google-api-loaded', function(){
    loaded = true
  })


  //Auto searching could use some improvement. Possibly verify channelId by channel.list
  //Improvements to make:
  //1. Some channels use "Official" at the end or before VEVO: e.g. BORNSOfficialVEVO, also "band" e.g. grizzlybearband, and uk (royalblood)
  //2. some names have weird characters like BØRNS -- avoid? replace (with O)? Still works for the most part...
  //3. Possibly try VEVO first?
  //4. Investigate songs/bands with non-distinct names to see if just artist + song is good enough instead of adding "lyrics".
  //5. Check for length....
  //6. Check for live
  //7. Check for "not available"
  this.getYoutubeId = function(artist, song){
    if (loaded == true) {
      var query = hashTagQuery(artist, song)
      console.log(query)
      return searchYoutubePromise(query).then(function(resultOne){
        console.log(resultOne)
        if (resultOne.items.length == 0 || resultOne.items[0].snippet.title.toLowerCase() != song.toLowerCase()){
          query = artist + " " + song
          console.log(query)
          return searchYoutubePromise(query).then(function(resultOnePointFive){
            console.log(resultOnePointFive)
            for (var i = 0; i < resultOnePointFive.items.length; i++){
              var result = resultOnePointFive.items[i]
              var title = result.snippet.channelTitle.toLowerCase().replace(/\W/g, '')
              if (title.indexOf(artist.toLowerCase().replace(/\W/g, '')) !== -1){
                return result.id.videoId
              }
            }
            query = vevoQuery(artist, song)
            console.log(query)
            return searchYoutubePromise(query).then(function(resultTwo){
              if (resultTwo.items.length == 0 || resultTwo.items[0].snippet.title.toLowerCase().indexOf(song.toLowerCase()) == -1 ){
                query = lyricQuery(artist, song)
                console.log(query)
                return prom_two = searchYoutubePromise(query).then(function(resultThree){
                  if (resultThree.items.length == 0){
                    console.log("Couldn't find anything")
                    return null
                  }else{
                    return resultThree.items[0].id.videoId
                  }
                })
              }else{
                return resultTwo.items[0].id.videoId
              }
            })
          })
        }else{
          return resultOne.items[0].id.videoId
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
      videoEmbeddable: "true",
      restriction: "US",
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
        videoEmbeddable: "true",
        restriction: "US",
        // fields: 'items(id),items(snippet(channelId)),items(snippet(channelTitle)),items(snippet(title)),items(snippet(thumbnails(default)))',
        type: 'video'
    });

    request.execute(function(response) {
        defer.resolve(response)
    });
    return defer.promise;
  }

  function verifyChannelId(channelId, artist){
    var defer=$q.defer();

    var request = gapi.client.youtube.search.list({
      id: channelId,
      part: 'snippet'
    })

    request.execute(function(response) {
      if (response.items[0].title == "#" + artist.replace(/\W/g, '') ){
        defer.resolve(true)
      }else{
        defer.resolve(false)
      }
    });
    return defer.promise;
  }

  function hashTagQuery(artist, song){
    return "\"#" + artist.replace(/\W/g, '') + "\" " + song
  }

  function lyricQuery(artist, song){
    return artist + " " + song + " lyrics"
  }

  function vevoQuery(artist, song){
    return  "\"" +artist.replace(/\W/g, '') + "VEVO\" " + song
  }

}])


var apiKey = 'AIzaSyAVL6e_1RMEKzvAli0cUsUzQYPVJJgA3dc' // Limited to accepted domains
function googleApiClientReady() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3').then(function(){
    message.send('google-api-loaded')
  })
}
