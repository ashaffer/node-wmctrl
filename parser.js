function Parser(str) {
  this.str = str;
}

Parser.prototype.get = function(re) {
  var val = re.exec(this.str)[1];
  this.str = this.str.slice(val.length);

  var spaces = /(^\s+).*/.exec(this.str);
  if(spaces && spaces.length)
    this.str = this.str.slice(spaces[1].length);

  return val;
};

Parser.prototype.hex = function() {
  return parseInt(this.get(/(^0x[\da-fA-F]+).*/), 16);
};

Parser.prototype.num = function() {
  return parseInt(this.get(/(^[\d\-]+)\s+.*/), 10);
};

Parser.prototype.string = function() {
  return this.get(/(^[^\s]+).*/);
}
Parser.prototype.rest = function() {
  return this.get(/(.*)/);
};

module.exports = Parser;