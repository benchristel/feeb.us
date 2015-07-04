describe('LinkedList', function() {
    it('starts empty', function() {
        var list = new LinkedList()

        expect(list.toArray().length).toEqual(0)
    })

    it('gives inserted items a unique tracking number', function() {
        var list = new LinkedList()
        var dumbleNum = list.add('dumbledore')
        var snapeNum = list.add('snape')

        expect(dumbleNum).not.toEqual(snapeNum)
    })

    it('gets the first item', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        list.add('snape')
        expect(list.first()).toEqual('dumbledore')
    })

    it('gets an item by id', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        var snapeId = list.add('snape')
        expect(list.get(snapeId)).toEqual('snape')
    })

    it('gets the next item after the one with the given ID', function() {
        var list = new LinkedList()
        var dumbleNum = list.add('dumbledore')
        var snapeNum = list.add('snape')

        expect(list.next(dumbleNum)).toEqual('snape')
        expect(list.next(snapeNum)).toEqual(null)
    })

    it('yields items from forEach', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        list.add('snape')

        expect(list.toArray()).toEqual(['dumbledore', 'snape'])
    })

    it('removes an item from the end of the list', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        var snapeId = list.add('snape')
        list.remove(snapeId)

        expect(list.toArray()).toEqual(['dumbledore'])
    })

    it('appends after removing an item from the end of the list', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        var snapeId = list.add('snape')
        list.remove(snapeId)
        list.add('potter')

        expect(list.toArray()).toEqual(['dumbledore', 'potter'])
    })

    it('removes an item from the beginning of the list', function() {
        var list = new LinkedList()
        var id = list.add('dumbledore')
        list.add('snape')
        list.remove(id)

        expect(list.toArray()).toEqual(['snape'])
    })

    it('removes an item from the middle of the list', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        var id = list.add('potter')
        list.add('snape')
        list.remove(id)

        expect(list.toArray()).toEqual(['dumbledore', 'snape'])
    })

    it('moves an item', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        var potter = list.add('potter')
        list.add('snape')
        var weasley = list.add('weasley')
        list.moveBefore(potter, weasley)

        expect(list.toArray()).toEqual(['dumbledore', 'weasley', 'potter', 'snape'])
    })

    it('inserts and removes an item in the middle of the list', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        var snapeId = list.add('snape')
        var potterId = list.insertBefore(snapeId, 'potter')

        expect(list.toArray()).toEqual(['dumbledore', 'potter', 'snape'])

        list.remove(potterId)

        expect(list.toArray()).toEqual(['dumbledore', 'snape'])
    })

    it('clears all items', function() {
        var list = new LinkedList()
        list.add('dumbledore')
        list.add('snape')

        list.clear()

        expect(list.toArray()).toEqual([])
    })
})
