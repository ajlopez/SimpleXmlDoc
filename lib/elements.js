
function isNameChar(ch) {
    if (ch >= 'a' && ch <= 'z')
        return true;

    if (ch >= '0' && ch <= '9')
        return true;
        
    return false;
}

function isChar(ch) {
    if (ch >= 'a' && ch <= 'z')
        return true;
    
    return false;
}

function Element(text, offset) {
    offset = offset || 0;
    var length = text.length;
    
    while (text[offset] !== '<' && offset < length)
        offset++;
    
    if (!isChar(text[offset + 1]))
        throw new Error("Invalid tag name");
    
    this.tag = function () {
        for (var k = offset + 1; k < length; k++)
            if (!isNameChar(text[k]))
                break;
                
        return text.substring(offset + 1, k);
    }
}

function createElement(text, offset) {
    return new Element(text, offset);
}

module.exports = {
    element: createElement
}

