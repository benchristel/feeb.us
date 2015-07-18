function parseLibrary(text) {
  text = removeComments(text)

  var album, artist, art, songs = []
  var anyWhitespaceContainingAtLeastTwoNewlines = /\n\s*\n\s*/
  var anythingFollowingAHashSymbol = /#[^\n]\n/g

  var sections = text.split(anyWhitespaceContainingAtLeastTwoNewlines)
  sections = sections.map(function(s) { return s.split("\n") })

  for (var section of sections) {
    if (section.length === 1) {
      artist = textFrom(section[0])
    } else {
      album = textFrom(section[0])
      art = youtubeIdFrom(section[0])

      for (var i = 1; i < section.length; i++) {
        var line = section[i]
        if (line.trim().length === 0) continue

        songs.push({
          title: textFrom(line),
          artist: artist,
          album: album,
          trackNumber: album ? i : null,
          youtubeId: youtubeIdFrom(line),
          youtubeImageId: art || youtubeIdFrom(line)
        })
      }
    }
  }

  return songs

  function removeComments() {
    return text.replace(anythingFollowingAHashSymbol, "\n")
  }

  function textFrom(line) {
    if (line.length < 11) return null
    return line.substring(11, line.length).trim()
  }

  function youtubeIdFrom(line) {
    if (line.length < 11) return null
    return line.substring(0, 11)
  }
}
