
var split = require('split');

module.exports = function(stream, regexp, opts, callback) {
	var results = [ ];
	
	var line_num = 1;

	stream.pipe(split())
		.on('data', function(line) {
			var match = regexp.exec(line);
			if(match) {
				var result = { capture: [ ], lineNum: line_num,
						charIndex: match.index };
				for(var i = 0; i < match.length; i++)
					result.capture.push(match[i]);
				results.push(result);
			}

			line_num++;
		})
		.on('end', function() {
			if(opts.mode == 'unique') {
				if(results.length == 0) {
					callback(null, null);
				}else if(results.length == 1) {
					callback(null, results[0]);
				}else{
					callback(new Error("Expected only one match"));
				}
			}else callback(null, results);
		});
};

