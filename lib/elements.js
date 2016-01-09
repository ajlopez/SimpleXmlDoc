
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

function findCloseTag(text, offset) {
    while (text[offset] != '<')
        offset++;
    
    return offset;
}

function Element(text, offset) {
    offset = offset || 0;
    
    offset = text.indexOf('<', offset);
    
    var tag = parseName(text, offset + 1, 'tag');

    var nextclose = text.indexOf('</', offset);
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

