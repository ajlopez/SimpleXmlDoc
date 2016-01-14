
function normalizeValue(value, options) {
    if (value == null)
        return value;
        
    if (!options)
        return value;
    
    if (options.trimmed)
        value = value.trim();
    
    return value;
}

function normalizeValueFromString(value) {
    if (value == null)
        return value;
        
    if (typeof value !== 'string')
        return value;
        
    value = value.replace(/&lt;/g, "<");
    value = value.replace(/&gt;/g, ">");
    
    return value;
}

function normalizeName(name, options) {
    if (!options)
        return name;
    
    if (options.camelize)
        name = camelize(name);

    if (options.capitalize)
        name = capitalize(name);
    
    if (options.nons)
        name = removeNamespace(name);
    
    return name;
}

function camelize(text) {
    var p = text.indexOf(':');
    
    if (p >= 0)
        return text = text.substring(0, p) + ':' + text[p + 1].toLowerCase() + text.substring(p + 2);
    
    return text[0].toLowerCase() + text.substring(1);
}

function capitalize(text) {
    var p = text.indexOf(':');
    
    if (p >= 0)
        return text = text.substring(0, p) + ':' + text[p + 1].toUpperCase() + text.substring(p + 2);
    
    return text[0].toUpperCase() + text.substring(1);
}

function removeNamespace(text) {
    var p = text.indexOf(':');
    
    if (p < 0)
        return text;
    
    return text.substring(p + 1);
}

module.exports = {
    name: normalizeName,
    value: normalizeValue,
    valueFromString: normalizeValueFromString
}