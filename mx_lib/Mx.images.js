"use strict";


Mx.image = (function () {
	var main = {
		raw_url: {}
	};

	var mx_vars = {
		type: null,
		sep: null
	};

	var map = main.map = { 
		count: {},
		root: null
	};

	var error = {
		section: "Invalid section ({%0}).",
		image: "Invalid section ({%1}) and/or image ({%0})."
	};


	var gen_url = function (img, section) {
		return map.root + map[ section ].root + map[ section ][ img ];
	};

	var gen_image = function (i, s) {
		var img_info = map[ s ],
			url = gen_url(i, s),
			img = document.createElement(img_info.type);

		// img.src = url;
		img.className = s + mx_vars.sep + i;
		img.setAttribute(mx_vars.type, s);
		img.src = map.root + img_info.root + img_info[i];
		img.id = s + mx_vars.sep + i + mx_vars.sep + 
			(img.className in map.count ? 
			++map.count[ img.className ] : 
			(map.count[ img.className ] = 0, 0) );

		return img;
	};

	var factory = main.factory = function (i, s, loc) {
		var img;

		if (s in map && i in map[s]) {
			// if (i === 'root' || i === 'type' || s === 'root' || s === 'count')
			if ( x(Mx.internals.id.images.ignore).in_array(s) )
				Mx.debug.errorf(error.section, s);

			else {
				img = gen_image(i, s);
				Mx.storage.insert([img.id, loc, s, i, img], Mx.internals.id.storage.IMAGES);
				return img;
			}
		}

		else {
			Mx.debug.errorf(error.image, i, s);
		}
	};

	main.init = function () {
		mx_vars.type = Mx.internals.id.images.type;
		mx_vars.sep = Mx.internals.id.images.sep;
	};


	return main;
})();

