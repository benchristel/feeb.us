
var LinkedList = function() {
    "use strict"
    var _first = null
    var _last = null
    var nextId = 0
    var map = {}

    this.forEach = function(f) {
        var i = _first
        while (i) {
            f(i.item)
            i = i.next
        }
    }

    this.add = function(i) {
        var added = wrap(i)
        map[added.id] = added
        if (_last) {
            _last.next = added
            added.prev = _last
            _last = added
        } else {
            _first = _last = added
        }
        return added.id
    }

    this.remove = function(id) {
        var toRemove = map[id]
        if (!toRemove) return null

        if (_first === toRemove) {
            _first = toRemove.next
        }

        if (_last === toRemove) {
            _last = toRemove.prev
        }

        if (toRemove.prev) {
            toRemove.prev.next = toRemove.next
        }

        if (toRemove.next) {
            toRemove.next.prev = toRemove.prev
        }

        map[id] = null
    }

    this.insertBefore = function(nextId, item) {
        var next = map[nextId]
        if (!next) return null
        var toInsert = wrap(item)
        map[toInsert.id] = toInsert

        if (_first === next) {
            _first = toInsert
        }

        if (next.prev) {
            next.prev.next = toInsert
        }

        toInsert.next = next
        toInsert.prev = next.prev
        return toInsert.id
    }

    this.first = function() {
        if (_first) return _first.item
    }

    this.next = function(id) {
        var item = map[id]
        if (!item || !item.next) return null
        return item.next.item
    }

    this.toArray = function() {
        var collected = []

        this.forEach(function(item) {
            collected.push(item)
        })

        return collected
    }

    this.clear = function() {
        map = {}
        nextId = 0
        _first = null
        _last = null
    }

    function wrap(i) {
        return {prev: null, next: null, item: i, id: nextId++}
    }
}
