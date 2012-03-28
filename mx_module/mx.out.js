"use strict";


(function () {
	var main = mx.out = {};
	var query = main.query = {};

	var templates = {};
	var template_partrs = "<div><span>[{%0}] </span><span style='color: {%2:black}'>{%1}</span></div>";

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
	// main.register = function (template, template_str) {
	main.register = function (template, title, content, color) {
		(function () {
			var loc_template = template;

			main[ loc_template ] = function (fname) {
				write(loc_template, fname);
			};

			templates[ loc_template ] = Template.stringf(template_partrs, title, content || "{%0}", color || "red");
		})();

		if (mx.debug && !mx.debugging) {
			holder.style.display = "none";
			graph.style.display = "none";
			info.style.display = "none";
		}
	}
})();

mx.out.register("module", "loading module", null, "blue");
mx.out.register("file", "loading file", null, "#097054");
mx.out.register("resource", "loading {%type:type} file", "{%name}", "purple");
mx.out.register("component", "loading component", null, "green");
mx.out.register("time", "{%name} time", "{%time}ms", "#666699");
mx.out.register("project_name", "project name", null, "#55D43F");
mx.out.register("global", "global variable", null, "brown");
mx.out.register("method", "running method");
