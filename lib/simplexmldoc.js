
var elements = require('./elements');
var normalize = require('./normalize');

function Document(text) {
    var root = elements.element(text);
    
    this.root = function () { return root; };
    
    this.toObject = function (options) { return this.root().toObject(options); };
    
    this.toString = function () { return this.root().toString(); };
}

function fromObjectToString(obj, options) {
    var text = '';
    
    for (var n in obj) {
        var value = obj[n];
        
        n = normalize.name(n, options);
        
        if (value == null)
            text += '<' + n + '/>';
        else if (typeof value === 'object')
            text += '<' + n + '>' + fromObjectToString(value, options) + '</' + n + '>';
        else
            text += '<' + n + '>' + value + '</' + n + '>';
    }
    
    return text;
}

function fromObject(obj, options) {
    return new Document(fromObjectToString(obj, options));
}

module.exports = {
    fromString: function (text) { return new Document(text); },
    fromObject: fromObject
};

