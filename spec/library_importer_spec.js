describe('LibraryImporter2', function() {
    it('parses a bunch of songs', function() {
        var text =
            "Heartbreaking Bravery :: Moonface with Siinai\n"+
            "ISgwLkgrdCQ Heartbreaking Bravery\n"+
            "lXb0cmewl2s Yesterday's Fire\n"+
            "jFKiLyh3FwQ Shitty City\n"+
            "-OI_r_wzrEI Quickfire, I Tried\n"+
            "G0QObwY6Tns I'm Not the Phoenix Yet\n"+
            "\n"+
            "Weebl's Stuff :: Mr. Weebl\n"+
            "au3-hk-pXsM Magical Trevor Episode 1"

        var out = LibraryImporter.parse(text)

        expect(out[0].title).toEqual('Heartbreaking Bravery')
        expect(out[0].album).toEqual('Heartbreaking Bravery :: Moonface with Siinai')
        expect(out[0].mediaId).toEqual('ISgwLkgrdCQ')
        expect(out[0].track).toEqual(1)
        expect(out[1].track).toEqual(2)
        expect(out[1].title).toEqual("Yesterday's Fire")
        expect(out[1].album).toEqual("Heartbreaking Bravery :: Moonface with Siinai")
        expect(out[5].album).toEqual("Weebl's Stuff :: Mr. Weebl")
        expect(out[5].title).toEqual("Magical Trevor Episode 1")
    })
})
