
var elements = require('../lib/elements');

exports['get element'] = function (test) {
    var element = elements.element("<tag></tag>");
    
    test.ok(element);
    test.equal(typeof element, 'object');
};

exports['get autoclose element'] = function (test) {
    var element = elements.element("<tag/>");
    
    test.ok(element);
    test.equal(typeof element, 'object');
    test.equal(element.elements().count(), 0);
    test.equal(element.text(), '');
};

exports['get element with namespace'] = function (test) {
    var element = elements.element("<ns:tag></ns:tag>");
    
    test.ok(element);
    test.equal(typeof element, 'object');
    test.equal(element.ns(), 'ns');
    test.equal(element.tag(), 'tag');
    test.equal(element.name(), 'ns:tag');
};

exports['get tag and name'] = function (test) {
    var element = elements.element("<tag></tag>");
    
    test.equal(element.tag(), "tag");
    test.equal(element.name(), "tag");
};

exports['no elements'] = function (test) {
    var element = elements.element("<tag></tag>");
    
    test.equal(element.elements().count(), 0);
};

exports['one element'] = function (test) {
    var element = elements.element("<tag><subtag></subtag></tag>");
    
    test.equal(element.elements().count(), 1);
};

exports['two elements'] = function (test) {
    var element = elements.element("<tag><subtag>text 1</subtag><subtag>text 2</subtag></tag>");
    
    test.equal(element.elements().count(), 2);
    
    var elem1 = element.elements().get(0);
    
    test.ok(elem1);
    test.equal(elem1.tag(), "subtag");
    test.equal(elem1.text(), "text 1");
    
    var elem2 = element.elements().get(1);
    
    test.ok(elem2);
    test.equal(elem2.tag(), "subtag");
    test.equal(elem2.text(), "text 2");
};

exports['two indented elements'] = function (test) {
    var text = [
        "<tag>",
        "  <subtag>text 1</subtag>",
        "  <subtag>text 2</subtag>",
        "</tag>"
    ].join('\n');
    
    var element = elements.element(text);
    
    test.equal(element.elements().count(), 2);
    
    var elem1 = element.elements().get(0);
    
    test.ok(elem1);
    test.equal(elem1.tag(), "subtag");
    test.equal(elem1.text(), "text 1");
    
    var elem2 = element.elements().get(1);
    
    test.ok(elem2);
    test.equal(elem2.tag(), "subtag");
    test.equal(elem2.text(), "text 2");
};

exports['each over two elements'] = function (test) {
    var element = elements.element("<tag><subtag>text 1</subtag><subtag>text 2</subtag></tag>");
    var result = '';
    
    element.elements().each(function (elem) { result += elem.text(); });
    
    test.equal(result, 'text 1text 2');
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

exports['get text with capitalized tag'] = function (test) {
    var element = elements.element("<Tag>text</Tag>");
    
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

exports['invalid close tag name'] = function (test) {
    test.throws(
        function () { elements.element("<tag></teg>"); },
        "Error: Unclosed element"
    );
};

exports['invalid close tag name with namespace'] = function (test) {
    test.throws(
        function () { elements.element("<ns:tag></ns2:tag>"); },
        "Error: Unclosed element"
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
