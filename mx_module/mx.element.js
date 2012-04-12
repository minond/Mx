"use strict";


(function (self) {
	// every element is stored in an msql instance
	self.include.module.storage;
	self.include.module.debug;

	var settings = {
		node_warning: "Missing node element, creating new block.",
		classes: {
			mx_base: "mx_block",
			enviroment_base: "mx_enviroment_base"
		}
	};

	var main = self.module.register("element", settings, self.enviroment);

	// maps
	main.node_map = manage.const("div");
	main.type_map = manage.const("enviroment");
	main.color_map = {
		light_purple: 	"#BDAEC6",
		dark_purple: 	"#732C7B",
		salmon: 		"#E86850"
	};

	main.factory = function (props) {
		var elem;

		if (!props) {
			props = {};
		}

		props.type = props.type || main.node_map.DIV;
		elem = document.createElement(props.type);

		delete props.type;

		for (var prop in props)
			elem[ prop ] = props[ prop ];

		return elem;
	};

	main.block = function (cname) {
		return main.factory({
			type: main.node_map.DIV,
			className: mh.sconcat(settings.classes.mx_base, cname)
		});
	};

	// enviroment elements
	self.storage.register("enviroment_element", "offset");
	main.enviroment_element = function (offset) {
		var elem_s = {
			node: main.block(settings.classes.enviroment_element),
			type: main.type_map.ENVIROMENT,
			offset: offset
		};
	};

	// returns an element's css property value
	// get computed style
	main.gcs = function (node, prop) {
		var value, css_dec = getComputedStyle(node);

		if (css_dec && m(prop).is_string) {
			value = css_dec.getPropertyValue(prop);
		}

		return value;
	};

	// returns an element's node
	main.get_node = function (elem) {
		var node;

		if (mtype(elem).is_node)
			node = elem;
		else if (mtype(elem).is_character)
			node = elem[ main.Character.settings.holder_name ];
		else
			mx.debug.warnf(settings.node_warning);

		return node;
	};
})(mx);
