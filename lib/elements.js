
function isNameChar(ch) {
    if (ch >= 'a' && ch <= 'z')
        return true;
        
    return false;
}

function Element(text, offset) {
    offset = offset || 0;
    var length = text.length;
    
    while (text[offset] !== '<' && offset < length)
        offset++;
    
    this.tag = function () {
        for (var k = offset + 1; k < length; k++)
            if (!isNameChar(text[k]))
                break;
                
        return text.substring(offset + 1, k);
    }
}

function createElement(text) {
    return new Element(text);
}

module.exports = {
    element: createElement
}

