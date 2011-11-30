
function ImageMagickIdentifyReader(text) {
  if (Object.prototype.toString.call(text) !== '[object String]') {
    throw new Error('Invalid argument `text`: must be a String.');
  }
  
  this.raw = text;
  this.data = {};
  
  var input = text.trim();
  
  if (input === '') return;
  
  input = ('  ' + input).split("\n");
  
  var stack = [this.data];
  var lastDepth = 1;
  var lastKey;
  
  var t = this;

  input.forEach(function(line, i) {
    var index = line.indexOf(':');
    if (index > -1) {
      var depth = line.match(/^ +/)[0].length / 2;
      var key = line.slice(0, index).trim();
      var value = line.slice(index + 1).trim() || {};
      
      try {
        if (depth === lastDepth) {
          // Add the key/value pair to the last object in the stack
          stack[stack.length-1][key] = value;

          // Note this key as the last key, which will become the parent key if
          // the next object is a child.
          lastKey = key;

        } else if (depth === lastDepth + 1) {
          // Add the last key (which should be an empty object) to the end of
          // the object stack. This allows us to match stack depth to
          // indentation depth.
          stack.push(stack[stack.length-1][lastKey]);
          stack[stack.length-1][key] = value;
          lastDepth++;
          lastKey = key;

        } else if (depth < lastDepth) {
          // Remove items from the end of the stack so that we add this new
          // key/value pair to the correct parent object.
          stack = stack.slice(0, depth);
          stack[stack.length-1][key] = value;
          lastDepth = depth;
          lastKey = key;
        }
      } catch (e) {
        console.log(depth, key, value, t.data);
        throw e;
      }
      
    }
  });
  
  console.log(this.data);
}

module.exports = ImageMagickIdentifyReader;
