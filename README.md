ImageMagick Identify Parser
===========================

Parses verbose output from the `identify` program into an object.

Example
-------

``` javascript
var im = require('imagemagick');
var imParse = require('imagemagick-identify-parser');

im.identify(['-verbose', '/path/to/image.png'], function(e, result) {

  var data = imParse(result, true);

  console.log(data.geometry);
  // 480x360+0+0
  
  console.log(data.channelStatistics.red.standardDeviation);
  // 60.4782 (0.237169)
});
```