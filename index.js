var exec = require('child_process').exec;
var Parser = require('./parser');
var es = require('event-stream');

var wmctrl = module.exports = {};

wmctrl.list = function(cb) {
  // If no callback is passed in, act like a stream
  if(arguments.length === 0) {
    return es.readable(function() {
      var self = this;
      wmctrl.list(function(err, data) {
        if(err) self.emit('error', err);
        else data.map(function(item) {
          self.emit('data', item);
        });
      });
    });
  }

  exec('wmctrl -l -G', function(err, data) {
    if(err) return cb(err, null);
    cb(null, data.split('\n').filter(Boolean).map(function(line) {
      var parser = new Parser(line);
      return {
        id: parser.hex(),
        desktop_number: parser.num(),
        x: parser.num(),
        y: parser.num(),
        width: parser.num(),
        height: parser.num(),
        machine_name: parser.string(),
        title: parser.rest()
      };
    }));
  });
};

wmctrl.activate = function(wnd, cb) {
  // If no arguments, we're streaming
  if(arguments.length === 0) {
    return es.through(function(wnd) {
      var self = this;
      wmctrl.activate(wnd.id, function() {
        self.emit('data', wnd);
      });
    });
  }

  exec('wmctrl -i -a 0x' + wnd.toString(16), function(err, data) {
    cb && cb(err && 'Invalid window id');
  });
};
