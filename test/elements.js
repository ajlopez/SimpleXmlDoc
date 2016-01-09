
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

exports['get uppercase tag'] = function (test) {
    var element = elements.element("<TAG></TAG>");
    
    test.equal(element.tag(), "TAG");
};

exports['get tag from element with spaces'] = function (test) {
    var element = elements.element(" <tag ></tag>");
    
    test.equal(element.tag(), "tag");
};

exports['get element with offset'] = function (test) {
    var element = elements.element("<tag></tag><tag2></tag2>", 11);
    
    test.equal(element.tag(), "tag2");
};

exports['invalid tag'] = function (test) {
    test.throws(
        function () { elements.element("<123></123>"); },
        "Error: Invalid tag name"
    );
};

