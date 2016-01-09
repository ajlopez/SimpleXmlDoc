
var sxmld  = require('..');

exports['from string'] = function (test) {
    var doc = sxmld.fromString('<root><content>Text</content></root>');
    
    test.ok(doc);
    
    var root = doc.root();
    
    test.ok(root);
    
    test.equal(root.name(), 'root');
    test.equal(root.tag(), 'root');
    test.equal(root.ns(), null);
    test.equal(root.elements().count(), 1);
    
    var content = root.elements().get(0);
    
    test.ok(content);
    test.equal(content.tag(), 'content');
    test.equal(content.text(), 'Text');
};