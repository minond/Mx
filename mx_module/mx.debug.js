"use strict";

(function (self) {
	// debugging is turned off by default
	// most methods will check this setting
	// before doing anything
	var settings = {
		debugging: false
	};

	var main = self.module.register("debug", settings);

	// timer tracking map
	var clocks = {};

	// toggle function for time and timeEnd
	main.time = function (watch) {
		if (main.settings.debugging) {
			if (watch in clocks) {
				console.timeEnd(watch);
				delete clocks[ watch ];
			}
			else {
				clocks[ watch ] = 1;
				console.time(watch);
			}
		}

		return !!settings.debugging;
	};

	// similar to the time method except 
	// this returns a time value in milliseconds
	// a start time can be passed, otherwise 
	// the current time is used as a start time.
	main.Timer = function (time) {
		var start_time = time || Date.now();

		return function () {
			return Date.now() - start_time;
		};
	};

	// parses a message string using additional 
	// arguments and outputs to console log
	main.logf = function (template) {
		if (main.settings.debugging)
			console.log(stringf.apply(stringf, (mh.arg_unshift(arguments, template))));
	
		return !!settings.debugging;
	};

	// parses a message string using additional 
	// arguments and outputs to console warn
	main.warnf = function (template) {
		if (main.settings.debugging)
			console.warn(stringf.apply(stringf, (mh.arg_unshift(arguments, template))));
	
		return !!settings.debugging;
	};
})(mx);
