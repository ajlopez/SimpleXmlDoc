
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

exports['from string with prologue'] = function (test) {
    var doc = sxmld.fromString('<?xml version="1.0" encoding="UTF-8"?><root><content>Text</content></root>');
    
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
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><Person><Name>Adam</Name><Age>800</Age></Person>');
};

exports['from object to document to string'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800' } });
    var result = doc.toString();
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><person><name>Adam</name><age>800</age></person>');
};

exports['from object to document to string with special characters'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800', note: '1<>2<>3' } });
    var result = doc.toString();
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><person><name>Adam</name><age>800</age><note>1&lt;&gt;2&lt;&gt;3</note></person>');
};

exports['from object to document to string with null value'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800', notes: null } });
    var result = doc.toString();
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><person><name>Adam</name><age>800</age><notes/></person>');
};

exports['from object to document to string using capitalize'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800' } }, { capitalize: true });
    var result = doc.toString();
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><Person><Name>Adam</Name><Age>800</Age></Person>');
};

exports['from object to document to string using array'] = function (test) {
    var doc = sxmld.fromObject({ persons: [ { name: 'Adam', age: '800' } ] }, { array: { persons: 'person' } });
    var result = doc.toString();
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><persons><person><name>Adam</name><age>800</age></person></persons>');
};

exports['from object to document to string using attributes'] = function (test) {
    var doc = sxmld.fromObject({ person: { name: 'Adam', age: '800', $attrs: { xmlns: 'xmlns1', status: 'OK' } } });
    var result = doc.toString();
    test.equal(result, '<?xml version="1.0" encoding="UTF-8"?><person xmlns="xmlns1" status="OK"><name>Adam</name><age>800</age></person>');
};
