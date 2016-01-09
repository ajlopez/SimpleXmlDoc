
var elements = require('./elements');

function Document(text) {
    var root = elements.element(text);
    
    this.root = function () { return root; };
}

module.exports = {
    fromString: function (text) { return new Document(text); } 
};