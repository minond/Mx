"use strict";

(function (self) {
	var main = self.module.constructor("Level");

	// creates blank levels
	// array of enviroment.Earth's
	main.public.__constructor = function (levels) {
		var me = this;
		mh.times(levels, function (i) {
			me[ i + 1 ] = null;
		});
	};
})(mx);
