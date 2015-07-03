var message = (function() {
  "use strict"

  var handlers = {}
  var message = {}

  message.on = function(message, handler) {
    if (!handlers[message]) handlers[message] = []
    handlers[message].push(handler)
    console.log('there are now ' + handlers[message].length + ' handlers for "'+message+'".')
    return {
      cancel: function() {
        var index = handlers[message].indexOf(handler)
        handlers[message].splice(index, 1)
      }
    }
  }

  message.send = function() {
    var message = arguments[0]
    if (handlers[message]) {
      for (var handler of handlers[message]) {
        handler.call(null, arguments[1])
      }
    }
  }

  return message
})();
