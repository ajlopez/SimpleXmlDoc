
var elements = require('./elements');

function Document(text) {
    var root = elements.element(text);
    
    this.root = function () { return root; };
    
    this.toObject = function (options) { return this.root().toObject(options); };
}

module.exports = {
    fromString: function (text) { return new Document(text); } 
};