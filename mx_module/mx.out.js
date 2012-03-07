"use strict";


mx.out = (function () {
	var main = {};
	var output = main.output = document.getElementById("mx_output");

	var scroll = function () {
		output.scrollTop = 100000;
	};

	var write = manage.throttle(function (template, fname) {
		output.innerHTML += Template.stringf(templates[ template ], fname);
		scroll();
	}, 30);

	var templates = {
		module: "<div><span>loading module: </span><span class='nmod'>{%0}</span></div>",
		file: "<div><span>loading file: </span><span class='nmod'>{%0}</span></div>",
		component: "<div><span>loading component: </span><span class='ncom'>{%0}</span></div>",
		global: "<div><span>global variable: </span><span class='gvar'>{%0}</span></div>",
		method: "<div><span>running method: </span><span class='call'>{%0}</span></div>"
	};

	// function for all templates
	// special cases can be overwritten here after this loop
	for (var template in templates) {
		(function () {
			var loc_template = template;
			main[ loc_template ] = function (fname) {
				write(loc_template, fname);
			};
		})();
	}


	return main;
})();
