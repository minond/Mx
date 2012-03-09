"use strict";


(function () {
	var main = mx.out = {};

	var templates = {};
	var output = document.getElementById("mx_output");

	var write = manage.throttle(function (template, fname) {
		output.innerHTML += Template.stringf(templates[ template ], fname);
		output.scrollTop = 100000;
	}, 30);

	// for custom templates
	main.register = function (template, template_str) {
		(function () {
			var loc_template = template;

			main[ loc_template ] = function (fname) {
				write(loc_template, fname);
			};

			templates[ loc_template ] = template_str;
		})();
	}
})();

mx.out.register("module", "<div><span>loading module: </span><span class='nmod'>{%0}</span></div>");
mx.out.register("file", "<div><span>loading file: </span><span class='nmod'>{%0}</span></div>");
mx.out.register("component", "<div><span>loading component: </span><span class='ncom'>{%0}</span></div>");
mx.out.register("global", "<div><span>global variable: </span><span class='gvar'>{%0}</span></div>");
mx.out.register("method", "<div><span>running method: </span><span class='call'>{%0}</span></div>");
