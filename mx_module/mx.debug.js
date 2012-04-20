"use strict";

(function (self) {
	// debugging is turned off by default
	// most methods will check this setting
	// before doing anything
	var settings = {
		debugging: false,
		cname: "debugging"
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

		return function (all, pre) {
			var time = Date.now() - start_time;
			var ret = time;
			pre = pre || 2;

			if (all) {
				ret = {
					// raw times
					microseconds: time * 1000,
					milliseconds: time,
					seconds: time / 1000,
					minutes: time / 1000 / 60,
					hours: time / 1000 / 60 / 60,
					days: time / 1000 / 60 / 60 / 24,

					// text
					microseconds_str: time * 1000 + " microsecond(s)",
					milliseconds_str: time + " millisecond(s)",
					seconds_str: (time / 1000).toFixed(pre) + " second(s)",
					minutes_str: (time / 1000 / 60).toFixed(pre) + " minute(s)",
					hours_str: (time / 1000 / 60 / 60).toFixed(pre)  + " hour(s)",
					days_str: (time / 1000 / 60 / 60 / 24).toFixed(pre) + " day(s)",
				};
			}

			return ret;
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
