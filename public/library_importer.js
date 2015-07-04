var LibraryImporter = {}

LibraryImporter.parse = function(input) {
  "use strict"

  var out = []
  var albumTexts = input.split(/\n\n+/)

  for (var albumText of albumTexts) {
    var lines = albumText.split(/\n/)
    var album = lines[0].trim()

    for (var i = 1; i < lines.length; i++) {
        var songText = lines[i]

        out.push({
            album: album,
            track: i,
            title: lines[i].slice(11, lines[i].length).trim(),
            mediaId: lines[i].slice(0, 11)
        })
    }
  }

  return out
}
