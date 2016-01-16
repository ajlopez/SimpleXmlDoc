
var elements = require('./elements');
var normalize = require('./normalize');
var find = require('./find');

function Document(text, offset) {
    offset = offset || 0;
    
    var root = elements.element(text, offset);
    
    this.root = function () { return root; };
    
    this.toObject = function (options) { return this.root().toObject(options); };
    
    this.toString = function () { return '<?xml version="1.0" encoding="UTF-8"?>' + this.root().toString(); };
}

function fromObjectToString(obj, options) {
    if (typeof obj !== 'object')
        return normalize.valueToString(obj.toString());
        
    options = options || {};
    
    var text = '';
    
    for (var n in obj) {
        if (n === '$attrs')
            continue;
            
        var value = obj[n];
        var attrs = '';
        
        if (value && value.$attrs)
            for (na in value.$attrs)
                attrs += ' ' + na + '="' + value.$attrs[na] + '"';
        
        if (options.array && options.array[n] && Array.isArray(value)) {
            var elemname = normalize.name(options.array[n], options);
            n = normalize.name(n, options);
            text += '<' + n + attrs + '>';
            
            value.forEach(function (elem) {
                text += '<' + elemname + '>' + fromObjectToString(elem, options) + '</' + elemname + '>';
            });

            text += '</' + n + '>';
            
            continue;
        }
        
        n = normalize.name(n, options);
        
        if (value == null)
            text += '<' + n + attrs + '/>';
        else
            text += '<' + n + attrs + '>' + fromObjectToString(value, options) + '</' + n + '>';
    }
    
    return text;
}

function fromObject(obj, options) {
    return new Document(fromObjectToString(obj, options), 0);
}

function fromString(text) {
    text = text.trim();
    
    if (text[0] !== '<')
        throw new Error('Invalid document');
        
    var offset = 0;
        
    if (text[1] === '?')
        offset = find.close(text, 1) + 1;
        
    return new Document(text, offset);
}

module.exports = {
    fromString: fromString,
    fromObject: fromObject
};

