
"use strict"

var normalize = require('./normalize');
var find = require('./find');

function isNameChar(ch) {
    if (ch >= 'a' && ch <= 'z')
        return true;
    if (ch >= 'A' && ch <= 'Z')
        return true;

    if (ch >= '0' && ch <= '9')
        return true;
        
    return false;
}

function isLetter(ch) {
    if (ch >= 'a' && ch <= 'z')
        return true;
    if (ch >= 'A' && ch <= 'Z')
        return true;
    
    return false;
}

function parseName(text, offset, name) {
    var token = {
        text: text,
        offset: offset
    };
    
    var length = 1;
    
    if (!isLetter(text[offset]))
        throw new Error("Invalid " + name + " name");
    
    while (isNameChar(text[offset + length]))
        length++;
    
    token.length = length;
    
    return token;
}

function makeName(ns, tag) {
    if (ns == null)
        return tag.text.substring(tag.offset, tag.offset + tag.length);
        
    return ns.text.substring(ns.offset, ns.offset + ns.length) + ':' + tag.text.substring(tag.offset, tag.offset + tag.length);
}

function ElementCollection(elements) {
    this.count = function () { return elements.length; };
    
    this.get = function (n) { return elements[n]; };
    
    this.each = function (fn) { elements.forEach(fn); };
}

function Element(text, offset) {
    offset = offset || 0;
    offset = find.open(text, offset);
    
    var tag = parseName(text, offset + 1, 'tag');
    var ns = null;
    
    if (text[tag.offset + tag.length] === ':') {
        ns = tag;
        tag = parseName(text, tag.offset + tag.length + 1, 'tag');
    }
    
    var nextgt = find.close(text, tag.offset + tag.length);    
    var nextlt = find.open(text, nextgt + 1);
    var elements = [];
    
    if (text[nextgt - 1] === '/') {
        var nlength = nextgt - 1 - offset - 1;
        var length = nextgt + 1 - offset;
        var toffset = 0;
        var tlength = 0;
    }
    else {    
        var nlength = nextgt - offset - 1;
        
        while (nextlt >= 0) {
            if (text[nextlt + 1] == '/')
                break;
            
            var element = new Element(text, nextlt);
            elements.push(element);
            
            nextlt = find.open(text, element.offset() + element.length())
        }
        
        if (nextlt < 0)
            throw new Error('Unclosed element');
            
        var closetag = parseName(text, nextlt + 2, 'close tag');
        var closens = null;
        
        if (text[closetag.offset + closetag.length] === ':') {
            closens = closetag;
            closetag = parseName(text, closetag.offset + closetag.length + 1, 'close tag');
        }
        
        var openname = makeName(ns, tag);
        var closename = makeName(closens, closetag);
        
        if (openname !== closename)
            throw new Error('Unclosed element');

        var toffset = nextgt + 1;
        var tlength = nextlt - toffset;
        
        var nextgt2 = find.close(text, nextlt + 1, 'close tag');
        
        var length = nextgt2 + 1 - offset; 
    }
    
    this.tag = function () {
        return text.substring(tag.offset, tag.offset + tag.length);
    }
    
    this.ns = function () {
        if (ns == null)
            return null;
        
        return text.substring(ns.offset, ns.offset + ns.length);
    }
    
    this.name = function () {
        return makeName(ns, tag);
    }
    
    this.xml = function () {
        return text.substring(offset, offset + length);
    }
    
    this.offset = function () { return offset; }
    
    this.length = function () { return length; }
    
    this.text = function () {
        if (elements.length)
            return null;
        
        return normalize.valueFromString(text.substring(toffset, toffset + tlength));
    }

    function xmltext() {
        if (elements.length)
            return null;
        
        return text.substring(toffset, toffset + tlength);
    }
    
    this.elements = function () { return new ElementCollection(elements); }
    
    this.toString = function () {
        var name = this.name();
        var elem = text.substring(offset + 1, offset + nlength + 1);
        
        var result;
        
        if (elements.length) {
            result = "<" + elem + ">";
            
            elements.forEach(function (element) {
                result += element.toString();
            });
            
            result += "</" + name + ">";
        }
        else {
            var xtext = xmltext();
            
            if (xtext === '' || xtext == null)
                result = "<" + name + "/>";
            else
                result = "<" + elem + ">" + xtext + "</" + name + ">";
        }
        
        return result;
    };
    
    this.toObject = function (options) {
        options = options || { };
        
        if (typeof options.array === 'string')
            options.array = [ options.array ];
            
        options.array = options.array || [];
            
        var result = { };
        
        var name = normalize.name(this.name(), options);
        
        if (options.array.indexOf(this.tag()) >= 0 || options.array.indexOf(this.name()) >= 0) {
            result[name] = [];
            
            elements.forEach(function (element) {
                result[name].push(element.toObject(options)[normalize.name(element.name(), options)]);
            });
        }
        else if (elements.length) {
            var obj = { };
            result[name] = obj;
            
            elements.forEach(function (element) {
                var subobj = element.toObject(options);
                var elemname = normalize.name(element.name(), options);
                obj[elemname] = subobj[elemname];
            });
        }
        else {
            var xtext = normalize.value(this.text(), options);
            
            if (xtext === '' || xtext == null)
                xtext = null;
                
            result[name] = xtext;
        }
        
        return result;
    }
}

function createElement(text, offset) {
    return new Element(text, offset);
}

module.exports = {
    element: createElement
}

