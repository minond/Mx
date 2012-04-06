"use strict";

// out module
// outputs messages to mx's output console
// allows a module to register a template output
// string for quick message templating.
(function (self) {
	var settings = {
		message: {
			generate: true,
			id: "mx_output",
			route_to: null,
			scroll_to: 10000,
			template: "<div>[{%title}] <span style='color: {%color}'>{%content}</span></div>",
			default_template: {
				color: "blue",
				title: "message",
				content: "{%0}"
			}
		}
	};

	var main = self.module.register("out", settings);

	var template_map = {};

	// appends a new message to the output holder element
	// if a route to method has been set it will send the 
	// template information and the generated template to
	// the route to method instead of displaying a message
	var write = manage.throttle(function (template_name, variables) {
		var message_str;

		if (!variables) {
			variables = [];
		}
		
		variables.unshift(template_map[ template_name ]);
		message_str = stringf.apply(Template, variables);

		if (!settings.message.route_to) {
			document.getElementById(settings.message.id).innerHTML += message_str;
			document.getElementById(settings.message.id).scrollTop = settings.message.scroll_to;
		}
		else {
			settings.message.route_to({
				template_name: template_name,
				template_string: message_str,
				template_variables: mh.rest(arguments)
			});
		}

		return message_str;
	});

	// register a template string to a property in module
	// used to quickly call the message method for a module
	main.register = function (template_name, template_settings) {
		template_settings = mh.merge(template_settings || {}, settings.message.default_template);

		(function () {
			var loc_template_name = template_name;
			var loc_template_settings = template_settings;

			// save the template information
			template_map[ loc_template_name ] = stringf(settings.message.template, template_settings);

			// and create a shortcut function for this message
			main[ loc_template_name ] = function () {
				return write(loc_template_name, mh.to_array(arguments));
			};
		})();

		return main[ template_name ];
	};
})(mx);

/*
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
	}
})();

mx.out.register("module", "loading module", null, "blue");
mx.out.register("file", "loading file", null, "#097054");
mx.out.register("resource", "loading {%type:type} file", "{%name}", "purple");
mx.out.register("component", "loading component", null, "green");
mx.out.register("time", "{%name} time", "{%time}ms", "#666699");
mx.out.register("project_name", "project name", null, "#AD01CB");
mx.out.register("global", "global variable", null, "brown");
mx.out.register("method", "running method");
mx.out.register("initialized", "module initialized", null, "gray");
*/
