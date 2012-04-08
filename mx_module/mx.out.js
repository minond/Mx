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
			if (document.getElementById(settings.message.id)) {
				document.getElementById(settings.message.id).innerHTML += message_str;
				document.getElementById(settings.message.id).scrollTop = settings.message.scroll_to;
			}
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

// some default outputs
// current project's name
mx.out.register("project_name", {
	title: "Project Name"
});

// how log it took from loading mx to'
// loading the main project file
mx.out.register("project_load", {
	title: "Project Load Time",
	content: "{%0}ms"
});

// for the default initialize module method
mx.out.register("initialized_module", {
	title: "Module Initialized"
});
