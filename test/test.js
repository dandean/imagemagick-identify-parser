var fs = require('fs');
var assert = require('assert');

var reader = require('../main');

var input = fs.readFileSync(require('path').join(__dirname, 'fixtures/sample.txt'), 'utf8');

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

  it('should return sensible info for GraphicsMagick 1.3.16 input data', function() {
    var identify_data_ok = fs.readFileSync(require('path').join(__dirname, 'fixtures/GraphicsMagick_1.3.16_identify_ok_1.txt'), 'utf8');
    var id = reader(identify_data_ok);
    // console.log(id);

    assert(id);
    assert.notDeepEqual(id, {}, "Output must not be empty");

    assert.strictEqual(id.Geometry, '187x251');
    assert.strictEqual(id.Format, 'JPEG (Joint Photographic Experts Group JFIF format)');
    assert.strictEqual(id.Depth, '8 bits-per-pixel component');

    assert.strictEqual(id.Type, 'true color');
    assert.strictEqual(id['Channel Statistics'].Red.Minimum, '3.00 (0.0118)');
  });

  it('should return sensible info for slightly bogon GraphicsMagick_1 1.3.16 input data 1', function() {
    var identify_data_bogon1 = fs.readFileSync(__dirname + "/fixtures/GraphicsMagick_1.3.16_identify_bogon_1.txt").toString();
    var id = reader(identify_data_bogon1);
    // console.log(id);

    assert(id);
    assert.notDeepEqual(id, {}, "Output must not be empty");

    assert.strictEqual(id.Geometry, '536x468');
    assert.strictEqual(id.Format, 'JPEG (Joint Photographic Experts Group JFIF format)');
    assert.strictEqual(id.Depth, '8 bits-per-pixel component');

    assert.strictEqual(id.Type, 'true color');
    assert.strictEqual(id['Channel Statistics'].Red.Mean, '30.93 (0.1213)');
  });

  it('should return sensible info for slightly bogon GraphicsMagick_1 1.3.16 input data 2', function() {
    var identify_data_bogon2 = fs.readFileSync(__dirname + "/fixtures/GraphicsMagick_1.3.16_identify_bogon_2.txt").toString();
    var id = reader(identify_data_bogon2);
    // console.log(id);

    assert(id);
    assert.notDeepEqual(id, {}, "Output must not be empty");

    assert.strictEqual(id.Geometry, '601x800');
    assert.strictEqual(id.Format, 'JPEG (Joint Photographic Experts Group JFIF format)');
    assert.strictEqual(id.Depth, '8 bits-per-pixel component');

    assert.strictEqual(id.Type, 'true color');

    // TODO: Does not work yet
    // assert.strictEqual(id['Profile-EXIF']['Date Time Digitized'], '2010:12:03 14:12:50');
  });

  it('should return sensible info for ImageMagick_6.7.2-7 input data', function() {
    var identify_data = fs.readFileSync(__dirname + "/fixtures/ImageMagick_6.7.2-7_identify_ok.txt").toString();
    var id = reader(identify_data);
    // console.log(id);

    assert(id);
    assert.notDeepEqual(id, {}, "Output must not be empty");

    assert.strictEqual(id.Geometry, '500x379+0+0');
    assert.strictEqual(id.Format, 'GIF (CompuServe graphics interchange format)');
    assert.strictEqual(id.Depth, '8-bit');

    assert.strictEqual(id.Type, 'Palette');
    assert.strictEqual(id['Channel statistics'].Green.kurtosis, 2.63942);
  });
});
