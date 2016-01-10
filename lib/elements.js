
"use strict"

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

function camelize(text) {
    return text[0].toLowerCase() + text.substring(1);
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

function findClose(text, offset) {
    var nextgt = text.indexOf('>', offset);
    
    if (nextgt < 0)
        throw new Error('Unclosed element');
    
    var nextlt = text.indexOf('<', offset);
    
    if (nextlt >= 0 && nextlt < nextgt)
        throw new Error('Invalid element');
    
    return nextgt;
}

function findOpen(text, offset) {
    var nextlt = text.indexOf('<', offset);    
    var nextgt = text.indexOf('>', offset);
    
    if (nextgt >= 0 && nextgt < nextlt)
        throw new Error('Invalid element');
    
    return nextlt;
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
    offset = findOpen(text, offset);
    
    var tag = parseName(text, offset + 1, 'tag');
    var ns = null;
    
    if (text[tag.offset + tag.length] === ':') {
        ns = tag;
        tag = parseName(text, tag.offset + tag.length + 1, 'tag');
    }
    
    var nextgt = findClose(text, tag.offset + tag.length);    
    var nextlt = findOpen(text, nextgt + 1);
    var elements = [];
    
    if (text[nextgt - 1] === '/') {
        var length = nextgt + 1 - offset;
        var toffset = 0;
        var tlength = 0;
    }
    else {    
        while (nextlt >= 0) {
            if (text[nextlt + 1] == '/')
                break;
            
            var element = new Element(text, nextlt);
            elements.push(element);
            
            nextlt = findOpen(text, element.offset() + element.length())
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
        
        var nextgt2 = findClose(text, nextlt + 1, 'close tag');
        
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
        
        return text.substring(toffset, toffset + tlength);
    }
    
    this.elements = function () { return new ElementCollection(elements); }
    
    this.toString = function () {
        var name = this.name();
        
        var result;
        
        if (elements.length) {
            result = "<" + name + ">";
            
            elements.forEach(function (element) {
                result += element.toString();
            });
            
            result += "</" + name + ">";
        }
        else {
            var text = this.text();
            
            if (text === '')
                result = "<" + name + "/>";
            else
                result = "<" + name + ">" + text + "</" + name + ">";
        }
        
        return result;
    };
    
    this.toObject = function (options) {
        options = options || { };
        
        if (typeof options.array === 'string')
            options.array = [ options.array ];
            
        options.array = options.array || [];
            
        var result = { };
        
        var name = this.name();
        
        if (options.camelize)
            name = camelize(name);
        
        if (options.array.indexOf(this.tag()) >= 0 || options.array.indexOf(this.name()) >= 0) {
            result[name] = [];
            
            elements.forEach(function (element) {
                result[name].push(element.toObject(options)[element.name()]);
            });
        }
        else if (elements.length) {
            var obj = { };
            result[name] = obj;
            
            elements.forEach(function (element) {
                var subobj = element.toObject(options);
                var elemname = element.name();
                if (options.camelize)
                    elemname = camelize(elemname);
                obj[elemname] = subobj[elemname];
            });
        }
        else {
            var text = this.text();
            
            if (text === '')
                text = null;
                
            result[name] = text;
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

