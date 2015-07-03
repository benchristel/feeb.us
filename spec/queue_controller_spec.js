describe('QueueController', function() {
    var queue
    beforeEach(function() {
        queue = {$apply: function(){}, playerState: {}}
        QueueController(queue)
    })

    afterEach(function() {
        queue.destroy()
    })

    it('enqueues songs', function() {
        expect(queue.queue().length).toEqual(0)

        queue.enqueue('a Youtube video ID')

        expect(queue.queue().length).toEqual(1)
    })

    it('plays the first song when someone requests playback', function() {
        queue.enqueue('one')
        queue.enqueue('two')

        var requests = []
        message.on('play-now', function(songRequest) {
            requests.push(songRequest)
        })

        message.send('play')

        expect(requests.length).toEqual(1)
    })

    it('plays the second song when the first finishes', function() {
        queue.enqueue('one')
        queue.enqueue('two')

        var requests = []
        message.on('play-now', function(songRequest) {
            requests.push(songRequest)
        })

        message.send('play')

        expect(queue.isPlaying(requests[0].queueId())).toBe(true)

        requests[0].playCompleted()

        expect(requests.length).toEqual(2)
        expect(queue.isPlaying(requests[0].queueId())).toBe(false)
        expect(queue.isPlaying(requests[1].queueId())).toBe(true)
    })

    it('stops playback when the end of the queue is reached', function() {
        queue.enqueue('one')
        queue.enqueue('two')

        var requests = []
        message.on('play-now', function(songRequest) {
            requests.push(songRequest)
        })

        message.send('play')

        requests[0].playCompleted()
        requests[1].playCompleted()

        expect(requests.length).toEqual(2)
        expect(queue.isPlaying(requests[0].queueId())).toBe(false)
        expect(queue.isPlaying(requests[1].queueId())).toBe(false)
    })

    it('jumps to a song', function() {
        queue.enqueue('one')
        queue.enqueue('two')
        queue.enqueue('three')

        var requests = []
        message.on('play-now', function(songRequest) {
            requests.push(songRequest)
        })

        queue.jumpTo(1)

        expect(requests.length).toEqual(1)
    })
})
