describe('LibraryParser.parse', function() {
    it('parses an artist with an album', function() {
        var input = lineSeparated
        (   "blextnootfy Some Artist"
        ,   ""
        ,   "urquatrantd An Album By That Artist"
        ,   "almezwrokon First Song on the Album"
        ,   "oiernmzafex Song 2"
        )

        var expected =
        [   { artist: "Some Artist"
            , album: "An Album By That Artist"
            , trackNumber: 1
            , title: "First Song on the Album"
            , youtubeId: "almezwrokon"
            , youtubeImageId: "urquatrantd"
            }
        ,   { artist: "Some Artist"
            , album: "An Album By That Artist"
            , trackNumber: 2
            , title: "Song 2"
            , youtubeId: "oiernmzafex"
            , youtubeImageId: "urquatrantd"
            }
        ]

        expect(parseLibrary(input)).toEqual(expected)
    })

    it('parses a library with two artists', function() {
        var input = lineSeparated
        (   "blextnootfy Artist the First"
        ,   ""
        ,   "urquatrantd Album the First"
        ,   "almezwrokon First Song"
        ,   ""
        ,   "mnarzksorly Artist the Second"
        ,   ""
        ,   "snaemfloorq Another Album"
        ,   "woinaiuzkma This Is a Song"
        )

        var expected =
        [   { artist: "Artist the First"
            , album: "Album the First"
            , trackNumber: 1
            , title: "First Song"
            , youtubeId: "almezwrokon"
            , youtubeImageId: "urquatrantd"
            }
        ,   { artist: "Artist the Second"
            , album: "Another Album"
            , trackNumber: 1
            , title: "This Is a Song"
            , youtubeId: "woinaiuzkma"
            , youtubeImageId: "snaemfloorq"
            }
        ]

        expect(parseLibrary(input)).toEqual(expected)
    })

    it('parses an artist with a bunch of singles', function() {
        var input = lineSeparated
        (   "blextnootfy I Am Whales"
        ,   ""
        ,   "singles"
        ,   "onwkamzkyrd Cake on Toast (Live)"
        ,   "zoarstkzsei Very Very Bad (Eschotalon Remix)"
        )

        var expected =
        [   { artist: "I Am Whales"
            , album: null
            , trackNumber: null
            , title: "Cake on Toast (Live)"
            , youtubeId: "onwkamzkyrd"
            , youtubeImageId: "onwkamzkyrd"
            }
        ,   { artist: "I Am Whales"
            , album: null
            , trackNumber: null
            , title: "Very Very Bad (Eschotalon Remix)"
            , youtubeId: "zoarstkzsei"
            , youtubeImageId: "zoarstkzsei"
            }
        ]

        expect(parseLibrary(input)).toEqual(expected)
    })

    function lineSeparated() {
        var s = ""
        for (var a of arguments) s += a + "\n"
        return s
    }
})
