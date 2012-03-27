"use strict";


(function () {
	var main = mx.out = {};
	var query = main.query = {};

	var templates = {};

	var graph = document.getElementById("mx_graph");
	var info = document.getElementById("mx_info");
	var holder = document.getElementById("mx_output_holder");

	var output = document.getElementById("mx_output");
	var query_avg = document.getElementById("mx_query_average");
	var query_avg_last = document.getElementById("mx_query_average_last");
	var query_total = document.getElementById("mx_query_count");

	var write = manage.throttle(function (template, fname) {
		output.innerHTML += Template.stringf(templates[ template ], fname);
		output.scrollTop = 100000;
	}, 30);


	query.average_last = function (v) {
		query_avg_last.innerHTML = v;
	};

	query.average = function (v) {
		query_avg.innerHTML = v;
	};

	query.count = function (v) {
		query_total.innerHTML = v;
	};

	// for custom templates
	main.register = function (template, template_str) {
		(function () {
			var loc_template = template;

			main[ loc_template ] = function (fname) {
				write(loc_template, fname);
			};

			templates[ loc_template ] = template_str;
		})();

		if (mx.debug && !mx.debugging) {
			holder.style.display = "none";
			graph.style.display = "none";
			info.style.display = "none";
		}
	}
})();

mx.out.register("module", "<div><span>[loading module] </span><span class='nmod'>{%0}</span></div>");
mx.out.register("file", "<div><span>[loading file] </span><span class='nmod'>{%0}</span></div>");
mx.out.register("resource", "<div><span>[loading {%type:type} file] </span><span class='nresource'>{%name}</span></div>");
mx.out.register("component", "<div><span>[loading component] </span><span class='ncom'>{%0}</span></div>");
mx.out.register("global", "<div><span>[global variable] </span><span class='gvar'>{%0}</span></div>");
mx.out.register("method", "<div><span>[running method] </span><span class='call'>{%0}</span></div>");
