
var elements = require('./elements');
var normalize = require('./normalize');

function Document(text) {
    var root = elements.element(text);
    
    this.root = function () { return root; };
    
    this.toObject = function (options) { return this.root().toObject(options); };
    
    this.toString = function () { return this.root().toString(); };
}

function fromObjectToString(obj, options) {
    if (typeof obj !== obj)
        return obj.toString();
        
    options = options || {};
    
    var text = '';
    
    for (var n in obj) {
        var value = obj[n];
        
        if (options.array && options.array[n] && Array.isArray(value)) {
            var elemname = normalize.name(options.array[n], options);
            n = normalize.name(n, options);
            text += '<' + n + '>';
            
            value.forEach(function (elem) {
                text += '<' + elemname + '>' + fromObjectToString(elem, options) + '</' + elemname + '>';
            });

            text += '</' + n + '>';
            
            continue;
        }
        
        n = normalize.name(n, options);
        
        if (value == null)
            text += '<' + n + '/>';
        else
            text += '<' + n + '>' + fromObjectToString(value, options) + '</' + n + '>';
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

