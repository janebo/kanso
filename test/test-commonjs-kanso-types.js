var testing = require('../lib/testing'),
    nodeunit = require('../deps/nodeunit');


var context = {window: {}, kanso: {design_doc: {}}, console: console};
var mcache = {};

module.exports = nodeunit.testCase({

    setUp: function (cb) {
        var that = this;
        testing.testRequire(
            'kanso/types', mcache, context, {}, function (err, types) {
                if (err) {
                    return cb(err);
                }
                that.types = types;
                testing.testRequire(
                    'kanso/fields', mcache, context, {}, function (err, fields) {
                        if (err) {
                            return cb(err);
                        }
                        that.fields = fields;
                        cb();
                    }
                );
            }
        );
    },

    'validate': function (test) {
        var types = this.types;
        var fields = this.fields;

        var doc = {
            type: 'test_type',
            one: 'one',
            two: 2
        };
        var errs = types.validate({
            'test_type': {
                fields: {
                    one: fields.string(),
                    two: fields.number()
                }
            }
        }, doc);
        test.same(errs, []);
        test.done();
    },

    'validate - error': function (test) {
        var types = this.types;
        var fields = this.fields;

        var doc = {
            type: 'test_type',
            one: 'one',
            two: 'asdf'
        };
        var errs = types.validate({
            'test_type': {
                fields: {
                    one: fields.string(),
                    two: fields.number()
                }
            }
        }, doc);
        test.same(errs.length, 1);
        test.same(errs[0].message, 'Not a number');
        test.done();
    }

});