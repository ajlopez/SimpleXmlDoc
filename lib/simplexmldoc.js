
var elements = require('./elements');

function Document(text) {
    var root = elements.element(text);
    
    this.root = function () { return root; };
    
    this.toObject = function (options) { return this.root().toObject(options); };
    
    this.toString = function () { return this.root().toString(); };
}

function fromObjectToString(obj) {
    var text = '';
    
    for (var n in obj) {
        var value = obj[n];
        
        if (typeof value === 'object')
            text += '<' + n + '>' + fromObjectToString(value) + '</' + n + '>';
        else
            text += '<' + n + '>' + value + '</' + n + '>';
    }
    
    return text;
}

function fromObject(obj) {
    return new Document(fromObjectToString(obj));
}

module.exports = {
    fromString: function (text) { return new Document(text); },
    fromObject: fromObject
};