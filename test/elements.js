
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

exports['get namespace'] = function (test) {
    var element = elements.element("<ns1:tag></ns1:tag>");
    
    test.equal(element.tag(), "tag");
    test.equal(element.ns(), "ns1");
};

exports['get xml'] = function (test) {
    var element = elements.element("<tag></tag>");
    
    test.equal(element.xml(), "<tag></tag>");
};

exports['get xml with inner text'] = function (test) {
    var element = elements.element("<tag>text</tag>");
    
    test.equal(element.xml(), "<tag>text</tag>");
};

exports['get text'] = function (test) {
    var element = elements.element("<tag>text</tag>");
    
    test.equal(element.text(), "text");
};

exports['get xml with inner element'] = function (test) {
    var element = elements.element("<tag><subtag></subtag></tag>");
    
    test.equal(element.xml(), "<tag><subtag></subtag></tag>");
};

exports['no text with inner element'] = function (test) {
    var element = elements.element("<tag><subtag></subtag></tag>");
    
    test.equal(element.text(), null);
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

exports['invalid tag name'] = function (test) {
    test.throws(
        function () { elements.element("<123></123>"); },
        "Error: Invalid tag name"
    );
};

exports['unclosed element'] = function (test) {
    test.throws(
        function () { elements.element("<tag"); },
        "Error: Unclosed element"
    );
};

exports['invalid element'] = function (test) {
    test.throws(
        function () { elements.element("<tag<>"); },
        "Error: Invalid element"
    );
};
