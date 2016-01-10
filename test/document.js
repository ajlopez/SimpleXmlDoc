
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

exports['from string to object'] = function (test) {
    var doc = sxmld.fromString('<Person><Name>Adam</Name><Age>800</Age></Person>');
    var result = doc.toObject({ camelize: true });
    test.deepEqual(result, { person: { name: 'Adam', age: '800' } });
};

exports['from string to document to string'] = function (test) {
    var doc = sxmld.fromString('<Person><Name>Adam</Name><Age>800</Age></Person>');
    var result = doc.toString();
    test.equal(result, '<Person><Name>Adam</Name><Age>800</Age></Person>');
};

exports['from object to document to string'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800' } });
    var result = doc.toString();
    test.equal(result, '<person><name>Adam</name><age>800</age></person>');
};

exports['from object to document to string with null value'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800', notes: null } });
    var result = doc.toString();
    test.equal(result, '<person><name>Adam</name><age>800</age><notes/></person>');
};

exports['from object to document to string using capitalize'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800' } }, { capitalize: true });
    var result = doc.toString();
    test.equal(result, '<Person><Name>Adam</Name><Age>800</Age></Person>');
};

