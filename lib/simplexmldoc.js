
var elements = require('./elements');

function Document(text) {
    var root = elements.element(text);
    
    this.root = function () { return root; };
    
    this.toObject = function (options) { return this.root().toObject(options); };
    
    this.toString = function () { return this.root().toString(); };
}

module.exports = {
    fromString: function (text) { return new Document(text); } 
};