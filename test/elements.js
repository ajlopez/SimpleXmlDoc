
var elements = require('../lib/elements');

exports['get element'] = function (test) {
    var element = elements.element("<tag></tag>");
    
    test.ok(element);
    test.equal(typeof element, 'object');
};

exports['get tag'] = function (test) {
    var element = elements.element("<tag></tag>");
    
    test.equal(element.tag(), "tag");
};

