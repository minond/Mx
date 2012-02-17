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
    grass: ["grass.jpg", Mx.const.dom.type.ENV],
    empty: ["empty.png", Mx.const.dom.type.ENV]
};

Mx.image.map.buildings = {
	type: "img",
	root: "buildings/",
	mew: ["mew.gif", Mx.const.dom.type.BUILDING],
	oldmew: ["oldmew.gif", Mx.const.dom.type.BUILDING],
	pidgey: ["pidgey.png", Mx.const.dom.type.BUILDING],
	pokeball: ["pokeball.png", Mx.const.dom.type.BUILDING],
	luigi: ["luigi.png", Mx.const.dom.type.BUILDING],
	blank: ["building.png", Mx.const.dom.type.BUILDING]
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
Mx.internals.components = [ "buildings", "movement", "timer", "location", "panel", "menu", "notify", "3D", "d3", "places" ];
Mx.internals.components.root = "mx_custom/{%0}.js";
