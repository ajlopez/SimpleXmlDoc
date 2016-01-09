
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

