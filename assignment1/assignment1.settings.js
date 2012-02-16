"use strict";


/*****************************************************************************
 * storate settings
 *****************************************************************************/

Mx.internals.id.storage = manage.const("images");


/*****************************************************************************
 * image settings
 *****************************************************************************/

Mx.image.map.root = "mx_images/";

Mx.image.map.enviroment = {
	type: "div",
    root: "enviroment/",
    grass: "grass.jpg",
    empty: "empty.png"
};

Mx.image.map.buildings = {
	type: "img",
	root: "buildings/",
	blank: "building.png"
};

Mx.internals.id.images = {
	type: "mx_type",
	sep: "_",
	ignore: ['type', 'root', 'count']
};



/*****************************************************************************
 * layout settings
 *****************************************************************************/
Mx.internals.id.dom = {
	master: "mx_master",
	viewport: "mx_viewport"
};

Mx.internals.id.dom.events = manage.enum("win_resize");



/*****************************************************************************
 * tests settings
 *****************************************************************************/
Mx.internals.id.tests = {
	mod_list: ["main", "image", "storage", "dom", "debug"],
	msg: "missing test case for {%0} module"
};

Mx.internals.id.out = {
	id: "#mx_out"
};



/*****************************************************************************
 * component settings
 *****************************************************************************/
Mx.internals.components = [ "buildings", "movement", "timer", "location", "panel", "menu", "notify", "3D", "d3" ];
Mx.internals.components.root = "mx_custom/{%0}.js";
