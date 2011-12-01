var reader = require('../main');
var input = require('fs').readFileSync(require('path').join(__dirname, 'sample.txt'), 'utf8');
var assert = require('assert');

var result = reader(input);

describe('Module', function(){

  it('should convert input into an object', function(){
    assert.ok(result instanceof Object);
    assert.ok(result instanceof String === false);
  });

  it('should retain a reference to the raw input', function() {
    assert.ok(Object.prototype.toString.call(result.rawInput) === '[object String]');
  });

  it('should convert integer-like values to a Number', function() {
    // Zero
    assert.ok(Object.prototype.toString.call(result['Channel statistics'].Alpha.skewness) === '[object Number]');

    // Negative
    assert.ok(Object.prototype.toString.call(result['Channel statistics'].Alpha.kurtosis) === '[object Number]');
  });

  it('should convert float-like values to a Number', function() {
    // Zero
    assert.ok(Object.prototype.toString.call(result['Channel statistics'].Blue.skewness) === '[object Number]');

    // Negative
    assert.ok(Object.prototype.toString.call(result['Channel statistics'].Blue.kurtosis) === '[object Number]');
  });

  it('should convert property names to camelCase when specified', function() {
    assert.ok(Object.keys(result).indexOf('Image statistics') > -1);
    result = reader(input, true);
    assert.ok(Object.keys(result).indexOf('imageStatistics') > -1);
  });

  it('should extract `width` and `height` properties from `geometry` property', function() {
    assert.ok(Object.keys(result).indexOf('width') > -1);
    assert.ok(Object.keys(result).indexOf('height') > -1);
  });
});
