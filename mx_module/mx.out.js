"use strict";


mx.out = (function () {
	var main = {};
	var output = main.output = document.getElementById("mx_output");

	var templates = {
		module: "<div><span class='lfile'>loading module: </span><span class='nmod'>{%0}</span></div>",
		component: "<div><span class='lfile'>loading component: </span><span class='ncom'>{%0}</span></div>"
	};

	var scroll = function () {
		output.scrollTop = 100000;
	};

	// outputs message when a new module
	// was requested to be loaded
	main.loading_module = function (modname) {
		output.innerHTML += Template.stringf(templates.module, modname);
		scroll();
	};

	// outputs message when a new component
	// was requested to be loaded
	main.loading_component = function (comname) {
		output.innerHTML += Template.stringf(templates.component, comname);
		scroll();
	};

	return main;
})();
