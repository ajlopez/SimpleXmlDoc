
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
}

function Element(text, offset) {
    offset = offset || 0;
    
    offset = text.indexOf('<', offset);
    
    var tag = parseName(text, offset + 1, 'tag');
    
    var nextgt = findClose(text, tag.offset + tag.length);
    
    var nextclose = text.indexOf('</', nextgt + 1);
    var length = nextclose + 2 + tag.length + 1 - offset; 
    
    this.tag = function () {
        return text.substring(tag.offset, tag.offset + tag.length);
    }
    
    this.xml = function () {
        return text.substring(offset, offset + length);
    }
}

function createElement(text, offset) {
    return new Element(text, offset);
}

module.exports = {
    element: createElement
}

