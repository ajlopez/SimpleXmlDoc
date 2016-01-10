
var elements = require('../lib/elements');

exports['simple document'] = function (test) {
    var element = elements.element("<tag></tag>");
    var result = element.toObject();
    test.deepEqual(result, { tag: null });
}

exports['person'] = function (test) {
    var element = elements.element("<person><name>Adam</name><age>800</age></person>");
    var result = element.toObject();
    test.deepEqual(result, { person: { name: 'Adam', age: '800' } });
}

exports['person with namespace'] = function (test) {
    var element = elements.element("<ns1:person><name>Adam</name><age>800</age></ns1:person>");
    var result = element.toObject();
    test.deepEqual(result, { "ns1:person": { name: 'Adam', age: '800' } });
}

exports['persons'] = function (test) {
    var element = elements.element("<persons><person><name>Adam</name><age>800</age></person></persons>");
    var result = element.toObject();
    test.deepEqual(result, { persons: { person: { name: 'Adam', age: '800' } } });
}

exports['persons as array'] = function (test) {
    var element = elements.element("<persons><person><name>Adam</name><age>800</age></person></persons>");
    var result = element.toObject({ array: 'persons' });
    test.deepEqual(result, { persons: [ { name: 'Adam', age: '800' } ] });
}

exports['person with capitalized names'] = function (test) {
    var element = elements.element("<Person><Name>Adam</Name><Age>800</Age></Person>");
    var result = element.toObject();
    test.deepEqual(result, { Person: { Name: 'Adam', Age: '800' } });
}

exports['person with capitalized names converted to camel'] = function (test) {
    var element = elements.element("<Person><Name>Adam</Name><Age>800</Age></Person>");
    var result = element.toObject({ camelize: true });
    test.deepEqual(result, { person: { name: 'Adam', age: '800' } });
}

exports['person with capitalized names converted to camel using namespace'] = function (test) {
    var element = elements.element("<ns1:Person><Name>Adam</Name><Age>800</Age></ns1:Person>");
    var result = element.toObject({ camelize: true });
    test.deepEqual(result, { "ns1:person": { name: 'Adam', age: '800' } });
}
