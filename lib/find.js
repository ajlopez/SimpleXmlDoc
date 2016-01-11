
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

module.exports = {
    open: findOpen,
    close: findClose
};

