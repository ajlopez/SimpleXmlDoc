
var elements = require('../lib/elements');

exports['simple document with empty tag'] = function (test) {
    var element = elements.element("<tag></tag>");
    var result = element.toString();
    test.deepEqual(result, "<tag/>");
}

exports['person'] = function (test) {
    var text = [
        "<person>",
        "  <name>Adam</name>",
        "  <age>800</age>",
        "</person>"
    ].join('\n');
    
    var element = elements.element(text);
    var result = element.toString();
    test.deepEqual(result, "<person><name>Adam</name><age>800</age></person>");
}
