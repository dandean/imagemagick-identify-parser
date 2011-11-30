var Reader = require('../main');
var input = require('fs').readFileSync(require('path').join(__dirname, 'sample.txt'), 'utf8');

describe('Module', function(){
  it('should convert input into an object', function(){
    var result = new Reader(input);
  });
});
