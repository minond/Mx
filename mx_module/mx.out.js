"use strict";

// out module
// outputs messages to mx's output console
// allows a module to register a template output
// string for quick message templating.
(function (self) {
	var settings = {
		// build the output section
		generate: true,

		// message output variables
		message: {
			// lower case enforce
			as_lowercase: true,

			// for writing
			id: "mx_output",

			// classes
			out_class: "mx_out",
			holder_class: "mx_out_holder",

			// for production mode
			route_to: null,

			// scroll to bottom offset
			scroll_to: 10000,

			// default template
			template: "<div><b>[{%title}]</b> <span style='color: {%color}'>{%content}</span></div>",

			// default template settings
			default_template: {
				color: "blue",
				title: "message",
				content: "{%0}"
			}
		}
	};

	var main = self.module.register("out", settings);

	var template_map = {};
	var write_link = null;

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

		if (settings.message.as_lowercase) {
			message_str = message_str.toLowerCase();
		}

		if (!settings.message.route_to) {
			if (!write_link) {
				if (document.getElementById(settings.message.id)) {
					write_link = document.getElementById(settings.message.id);
				}
			}

			if (write_link) {
				write_link.innerHTML += message_str;
				write_link.scrollTop = settings.message.scroll_to;
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

	// output elements generator
	main.generate = manage.limit(function () {
		self.include.module.debug;
		self.include.module.enviroment.element;

		var msg_holder = self.enviroment.element.factory({
			type: self.enviroment.element.node_map.DIV,
			className: mh.sconcat(settings.message.holder_class, self.debug.settings.cname)
		});

		var msg_out = self.enviroment.element.factory({
			type: self.enviroment.element.node_map.DIV,
			className: mh.sconcat(settings.message.out_class, self.debug.settings.cname),
			id: settings.message.id
		});

		msg_holder.appendChild(msg_out);
		document.body.appendChild(msg_holder);
	}, 1);

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

	main.pause = function () {
		write.pause();
	};

	main.resume = function () {
		write.resume();
	};

	main.clear = function (no_html) {
		write.clear();

		if (!no_html) {
			if (document.getElementById(settings.message.id)) {
				document.getElementById(settings.message.id).innerHTML = "";
			}
		}
	};
})(mx);
