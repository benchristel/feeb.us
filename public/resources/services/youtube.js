angular.module('OathStructure').service('YoutubeService', ['$rootScope' , '$q', function($rootScope, $q) {
  var loaded = false
  var ip = null

  message.on('google-api-loaded', function(){
    loaded = true
  })

  var whitelist = ["epitaphrecords", "fueledbyramen", "roadrunnerrecords", "atlanticvideos", "topshelfrecords"]

  //Auto searching could use some improvement. Possibly verify channelId by channel.list
  //Improvements to make:
  // (handled) 1. Some channels use "Official" at the end or before VEVO: e.g. BORNSOfficialVEVO, also "band" e.g. grizzlybearband, and uk (royalblood)
  //2. some names have weird characters like BØRNS -- avoid? replace (with O)? Still works for the most part...
  //3. Possibly try VEVO first?
  //4. Investigate songs/bands with non-distinct names to see if just artist + song is good enough instead of adding "lyrics".
  //5. Check for length of video....
  // (handled) 6. Check for live
  //7. Check for "not available"
  //8. Check for views?
  //9. Filter by duration
  //  (In the works) 10. Record Label Whitelist? Check if channelTitle is on the whitelist.
  //11. Found official remix for Dear Science, Shout me out instead of album version. Add album name to search?
  //12. Spoitify: Silversun Pickups: Pins and Needles, Youtube: Pins & Needles. :( test for common switches?
  //13. What happened to Viva La Vida? Coldplay
  // (handled) 14. Avoid videos with "cover" in it..
  //15. Downtown (feat. Eric Nally, Melle Mel, Kool Moe Dee & Grandmaster Caz)
  function isLiveOrCover(artist, title, videoTitle){
     return doesNotContainString(artist, title, videoTitle, "live") || doesNotContainString(artist, title, videoTitle, "cover")
  }

  function doesNotContainString(artist, title, videoTitle, string){
    title = title.toLowerCase()
    videoTitle = videoTitle.toLowerCase()
    if (videoTitle.indexOf(artist.toLowerCase()) !== -1){
      title =  artist + " " + title
    }
    var re = new RegExp(string, 'g');
    var titleCount = (title.match(re) || []).length;
    console.log(title + " " + titleCount)
    var videoTitleCount = (videoTitle.match(re) || []).length;
    console.log(videoTitle + " " + videoTitleCount)

    return titleCount !== videoTitleCount
  }

  this.getYoutubeId = function(artist, song){
    if (loaded == true) {
      return hashTagSearch(artist, song).then(function(id) {
        return id || basicSearch(artist, song).then(function(id) {
          return id || vevoSearch(artist, song).then(function(id) {
            return id || lyricSearch(artist, song).then(function(id) {
              return id
            })
          })
        })
      })
    }else{
      return  Promise.resolve(null)
    }
  }

  function hashTagSearch(artist, song){
    var query = hashTagQuery(artist, song)
    console.log(query)
    return searchYoutubePromise(query).then(function(result){
      if (!result || !result.items || result.items.length == 0 || result.items[0].snippet.title.toLowerCase() != song.toLowerCase()){
        return null
      }else{
        return result.items[0].id.videoId
      }
    })
  }


  function basicSearch(artist, song){
    query = basicQuery(artist, song)
    console.log(query)
    return searchYoutubePromise(query).then(function(queryResult){
      for (var i = 0; i < queryResult.items.length; i++){
        var result = queryResult.items[i]
        var title = result.snippet.channelTitle.toLowerCase()
        if ((title.replace(/\W/g, '').indexOf(artist.toLowerCase().replace(/\W/g, '')) !== -1 ||  _.contains(whitelist, title)) && !isLiveOrCover(artist, song, queryResult.items[i].snippet.title) && queryResult.items[i].snippet.title.toLowerCase().indexOf(song.toLowerCase()) !== -1){
          return result.id.videoId
        }
      }
      return null
    })
  }

  function vevoSearch(artist, song){
    query = vevoQuery(artist, song)
    console.log(query)
    return searchYoutubePromise(query).then(function(result){
      if (!result || !result.items || result.items.length == 0 || result.items[0].snippet.title.toLowerCase().indexOf(song.toLowerCase()) == -1 || isLiveOrCover(artist, song, result.items[0].snippet.title)){
        return null
      }else{
        return result.items[0].id.videoId
      }
    })
  }

  function lyricSearch(artist, song){
    query = lyricQuery(artist, song)
    console.log(query)
    return searchYoutubePromise(query).then(function(result){
      if (!result || !result.items || result.items.length == 0 || isLiveOrCover(artist, song, result.items[0].snippet.title)||result.items[0].snippet.title.toLowerCase().indexOf(removeAfterHyphen(song).toLowerCase()) == -1){
        console.log("Couldn't find anything for song: " + song)
        return null
      }else{
        return result.items[0].id.videoId
      }
    })
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
    return "\"#" + artist.replace(/\W/g, '') + "\" (\"" + song +"\" | \"" + removeAfterHyphen(song) + "\")"
  }

  function lyricQuery(artist, song){
    return "\"" +artist + "\" (\"" + song +"\" | \"" + removeAfterHyphen(song) + "\")"
  }

  function basicQuery(artist, song){
    return "\"" +artist + "\" (\"" + song +"\" | \"" + removeAfterHyphen(song) + "\")"
  }

  function vevoQuery(artist, song){
    return  "\"" +artist.replace(/\W/g, '') + "VEVO\" (\"" + song +"\" | \"" + removeAfterHyphen(song) + "\")"
  }

  function removeAfterHyphen(song){
    var s = song.substr(0, song.lastIndexOf(" - "))
    return s.length > 0 ? s : song
  }

}])


var apiKey = 'AIzaSyAVL6e_1RMEKzvAli0cUsUzQYPVJJgA3dc' // Limited to accepted domains
function googleApiClientReady() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3').then(function(){
    message.send('google-api-loaded')
  })
}
