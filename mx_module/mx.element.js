"use strict";


// each element requires the tag to be set
// when creating a new element it is this setting
// that is used to determine how it should be built
// @see mx.element
mx.element_node = manage.const("div", "img", "span");

// not used in the building of element, although this
// is set as a property of the node create. should be
// used on other modules, however, it is here where
// it is set.
// @see mx.element
mx.element_type = manage.enum("env", "building", "player");

// main module to building/editing new elements for
// game. images, divs, and spans are the main building
// blocks for everything in mx.
// @see mx.element_node
// @see mx.element_type
mx.element = (function () {
	var main = {};

	// storage for settings/options used when building
	// elements. set during run time and is specific
	// to the project.
	// sample:
	// { type: MX_NODE, root: DIR, elements: { 
	// elem1: { file: FILE_NAME, type: MX_TYPE }, elem2: ... } }
	var map = main.map = {};


	// given an element's name and section
	// this function generates a url pointing
	// to the image's file. for images only.
	// assumes both section and image are valid.
	// no checking is done at all.
	var generate_element_url = function (name, section) {
		return	Template.stringf("mx_images/{%0}/{%1}",
				map[ section ].root,
				map[ section ].elements[ name ].file);
	};


	// creates a new element
	// all same settings are used across every node
	// assumes both section and image are valid.
	// no checking is done at all.
	var generate_element_node = function (name, section) {
		var info = map[ section ];
		var node = document.createElement( info.type );

		if (!map[ section ].elements[ name ].count)
			map[ section ].elements[ name ].count = 0;

		node.className = Template.stringf("{%0}_{%1}", section, name);

		node.mx_type = map[ section ].elements[ name ].type;

		if (info.type === mx.element_node.IMG)
			node.src = generate_element_url(name, section);

		node.id = Template.stringf("{%0}_{%1}_{%2}", section, name, 
			map[ section ].elements[ name ].count++);


		return node;
	}


	// factory function. builds new elements
	// assigned to the map object. stores every new node
	// into the elements table to mx.storage
	var factory = main.factory = function (elem_name, elem_section) {
		var node;

		if (!elem_name || !elem_section)
			return false;

		// section check
		if (!( elem_section in map ))
			return false;

		// image check
		if (!( elem_name in map[ elem_section ].elements ))
			return false;


		node = generate_element_node(elem_name, elem_section);
		mx.storage.insert.element(
			[node.id, node.mx_type, [null, null], node, document.body]);

		return node;
	}

	return main;
})();


/*

// samples:

// creating a new element
mx.element.factory("grass", "enviroment");

// creating a new set of elements
mx.element.map.enviroment = {
	type: mx.element_node.DIV,
	root: "enviroment",
	elements: {
		grass: {
			file: "grass.jpg",
			type: mx.element_type.env
		},

		empty: {
			file: "empty.png",
			type: mx.element_type.env
		}
	}
};

*/
